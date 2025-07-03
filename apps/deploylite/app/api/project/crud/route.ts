import { NextResponse, NextRequest } from "next/server"
import ConnectDb from "../../../../../middleware/connectdb"
import CheckAuth from "@/actions/CheckAuth"
import Project from "../../../../../models/Project"
import { CreateprojectSchema } from "@/zod/project/CreateprojectZod"
import PricingPlan from "../../../../../models/PricingPlan"
import User from "../../../../../models/User"
import Deployment from "../../../../../models/Deployment"
import { cookies } from "next/headers"
import CryptoJS from "crypto-js"
import VirtualSpace from "../../../../../models/VirtualSpace"
import WebBuilder from "../../../../../models/WebBuilder"

export const GET = async () => {
    try {
        await ConnectDb();
        
        const checkres = await CheckAuth();
        
        if (!checkres.result) {
            return NextResponse.json({
                success: false,
                message: "Authentication failed please try again later!"
            }, { status: 401 });
        }
        
        const user = await User.findOne({ email: checkres.email });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        
        const projectdata = await Project.find({ userid: user._id }).populate("userid");
        
        if (!projectdata || projectdata.length === 0) {
            return NextResponse.json({
                success: true,
                projectdata: [],
                message: "No Projects found."
            });
        }
        
        return NextResponse.json({
            success: true,
            projectdata: projectdata,
            message: "Successfully fetched"
        });
        
    } catch (err) {
        console.error("Error in GET /api/project/crud:", err);
        return NextResponse.json({
            success: false,
            message: "Something went wrong please try again later!"
        }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    const getcookie = await cookies();
    
    try {
        await ConnectDb();
        const data = await req.json();
        const auth = await CheckAuth();
        
        if (!auth.result) {
            return NextResponse.json({
                message: "User is not authenticated",
                success: false,
                autherror: true
            }, { status: 401 });
        }
        
        const sanitizePayload = CreateprojectSchema.safeParse(data);
        
        console.log(data);
        if (!sanitizePayload.success) {
            return NextResponse.json({
                message: "Invalid Payload tampering detected",
                success: false,
                error: sanitizePayload.error,
            }, { status: 400 });
        }
        
        // Check project is unique or not
        const name = data.name.replace(/\s+/g, '').toLowerCase();
        console.log(name);
        
        const projectname = await Project.findOne({ name: name });
        const webbuilder = await WebBuilder.findOne({ name: name });
        const virtualspace = await VirtualSpace.findOne({ name: name });
        
        // If project name already exists
        if (projectname != null) {
            return NextResponse.json({
                message: "Project name already exists. Select a different name",
                success: false,
                projectname: "exists"
            }, { status: 409 });
        }
        // If webbuilder name already exists
        if (webbuilder != null) {
            return NextResponse.json({
                message: "WebBuilder name already exists. Select a different name",
                success: false,
                webbuildername: "exists"
            }, { status: 409 });
        }

        //check in virtual space
        if (virtualspace != null) {
            return NextResponse.json({
                message: "Virtual Space name already exists. Select a different name",
                success: false,
                virtualspacename: "exists"
            }, { status: 409 });
        }
        
        console.log(data.planid);
        const checkplan = await PricingPlan.findOne({ _id: data.planid });
        
        if (checkplan == null) {
            return NextResponse.json({
                message: "Pricing Plan does not exist. Pricing plan may be deleted or invalid",
                success: false,
                planid: "invalid"
            }, { status: 400 });
        }
        
        console.log("checking user");
        const user = await User.findOne({ email: auth.email });
        console.log(user);
        
        if (user == null) {
            return NextResponse.json({
                message: "User not found",
                success: false,
                user: "notfound"
            }, { status: 404 });
        }



        console.log("creating project");
        
        const startbilingdate = new Date(); 
        const endbilingdate = new Date(startbilingdate); 
        
        endbilingdate.setDate(startbilingdate.getDate() + 1); 
        endbilingdate.setHours(0, 0, 0, 0); 
        
        console.log('Start Billing Date (Today, local time):', startbilingdate.toLocaleString());
        console.log('End Billing Date (Next day, 12:00 AM local time):', endbilingdate.toLocaleString());
        
        const project = new Project({
            name: name,
            type: data.type,
            repourl: data.repourl,
            repobranch: data.repobranch,
            techused: data.techused,
            buildcommand: data.buildcommand,
            startcommand: data.startcommand,
            rootfolder: data.rootfolder,
            outputfolder: data.outputfolder,
            installcommand: data.installcommand,
            planid: data.planid,
            userid: user._id,
            startdate: new Date(),
            projectstatus: "creating",
            billstatus: "pending",
            startbilingdate: startbilingdate,
            endbilingdate: endbilingdate,
        });
        
        await project.save();
        
        const deploymentData = new Deployment({
            userid: user._id,
            projectid: project._id,
            status: "creating",
            deploymentdate: new Date(),
        });
        
        await deploymentData.save();
        
        if (!user.githubtoken) {
            return NextResponse.json({
                message: "GitHub token not found. Please connect your GitHub account.",
                success: false,
            }, { status: 400 });
        }
        
        const decryptgithubauth = CryptoJS.AES.decrypt(user.githubtoken, process.env.SECRET_KEY || "").toString(CryptoJS.enc.Utf8);
        
        const createdep = await fetch(`${process.env.DEPLOYMENT_API}/createdeployment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getcookie.get("token")?.value || '',
            },
            body: JSON.stringify({
                projectid: project._id,
                userid: user._id,
                repourl: data.repourl,
                repobranch: data.repobranch,
                techused: data.techused,
                buildcommand: data.buildcommand,
                startcommand: data.startcommand,
                rootfolder: data.rootfolder,
                outputfolder: data.outputfolder,
                installcommand: data.installcommand,
                name: name,
                authtoken: decryptgithubauth,
                env: data.env || "",
            })
        });
        
        const result = await createdep.json();
        console.log(result);
        
        if (result.success) {
            return NextResponse.json({
                message: "Project Created & Deployment Started",
                success: true,
                project: project
            });
        } else {
            return NextResponse.json({
                message: `Project creation failed: Reason - ${result.message}`,
                success: false,
                project: project
            }, { status: 500 });
        }

    } catch (err) {
        console.error("Error occurred while creating project:", err);
        return NextResponse.json({
            message: "Error occurred while creating project",
            error: err instanceof Error ? err.message : "Unknown error",
            success: false,
        }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
         const getcookie = await cookies();
        const data = await req.json();
        await ConnectDb();
        
        const auth = await CheckAuth();
        
        if (!auth.result) {
            return NextResponse.json({
                message: "User is not authenticated",
                success: false,
                autherror: true
            }, { status: 401 });
        }
        
        const projectdelete = await Project.findOneAndDelete({ _id: data.id });
        console.log("Project to delete:", projectdelete);
        if(projectdelete !== null && projectdelete.arn !== null || projectdelete.arn !== undefined|| projectdelete.arn !== ""){ {
            console.log("inside ")
        console.log("Project not found or ARN is missing",projectdelete.arn);
         const createdep = await fetch(`${process.env.DEPLOYMENT_API}/deploy/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getcookie.get("token")?.value || '',
            },
            body: JSON.stringify({
              task:projectdelete.arn
            })
        });
    
        
        const result = await createdep.json();
        console.log(result);
          return NextResponse.json({
            success: true,
            message: "Project Deleted Successfully"
        });
    }
        if (projectdelete == null) {
            return NextResponse.json({
                success: false,
                message: "Project not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            message: "Project Deleted Successfully"
        });
    }
        
    } catch (err) {
        console.error("Error deleting project:", err);
        return NextResponse.json({
            success: false,
            message: "Something went wrong please try again later!"
        }, { status: 500 });
    }
}