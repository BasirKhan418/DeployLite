import { NextResponse, NextRequest } from "next/server"
import ConnectDb from "../../../../../middleware/connectdb"
import CheckAuth from "@/actions/CheckAuth"
import Project from "../../../../../models/Project"
import WebBuilder from "../../../../../models/WebBuilder"
import PricingPlan from "../../../../../models/PricingPlan"
import User from "../../../../../models/User"
import { cookies } from "next/headers"


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
        
        const projectdata = await WebBuilder.find({ userid: user._id }).populate("userid");
        
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

        
        // Check project is unique or not
        const name = data.name.replace(/\s+/g, '').toLowerCase();
        console.log(name);
        
        const projectname = await Project.findOne({ name: name });
        const webbuildername = await WebBuilder.findOne({ name: name });
        
        // If project name already exists
        if (projectname != null) {
            return NextResponse.json({
                message: "Project name already exists. Select a different name",
                success: false,
                projectname: "exists"
            }, { status: 409 });
        }

        if (webbuildername != null) {
            return NextResponse.json({
                message: "Web Builder name already exists. Select a different name",
                success: false,
                webbuildername: "exists"
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
        
        const project = new WebBuilder({
            name: name,
            planid: data.planid,
            userid: user._id,
            startdate: new Date(),
            projectstatus: "live",
            billstatus: "pending",
            startbilingdate: startbilingdate,
            endbilingdate: endbilingdate,
            webbuilder: data.webbuilder,
        });
        
        await project.save();
        
        const createdep = await fetch(`${process.env.DEPLOYMENT_API}/createdeployment/webbuilder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getcookie.get("token")?.value || '',
            },
            body: JSON.stringify({
                projectid: project._id,
                userid: user._id,
                name: name,
                dbname: data.dbname,
                dbuser: data.dbuser,
                dbpass:data.dbpass
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