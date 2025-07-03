import { NextResponse, NextRequest } from "next/server"
import ConnectDb from "../../../../../middleware/connectdb"
import CheckAuth from "@/actions/CheckAuth"
import PricingPlan from "../../../../../models/PricingPlan"
import User from "../../../../../models/User"
import { cookies } from "next/headers"
import CryptoJS from "crypto-js"
import Database from "../../../../../models/Database"
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
        
        const projectdata = await Database.find({ userid: user._id }).populate("userid");
        
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
        
        const project = new Database({
            dbname: data.dbname,
            dbuser: data.dbuser,
            dbpass: data.dbpass,
            dbport: data.dbport,
            dbtype: data.dbtype,
            planid: data.planid,
            userid: user._id,
            startdate: new Date(),
            projectstatus: "creating",
            billstatus: "pending",
            startbilingdate: startbilingdate,
            endbilingdate: endbilingdate,
        });
        
        await project.save();
        
        if (!user.githubtoken) {
            return NextResponse.json({
                message: "GitHub token not found. Please connect your GitHub account.",
                success: false,
            }, { status: 400 });
        }
        
        const decryptgithubauth = CryptoJS.AES.decrypt(user.githubtoken, process.env.SECRET_KEY || "").toString(CryptoJS.enc.Utf8);
        
        const createdep = await fetch(`${process.env.DEPLOYMENT_API}/createdeployment/database`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getcookie.get("token")?.value || '',
            },
            body: JSON.stringify({
            projectid: project._id,
            userid: user._id,
            dbname: data.dbname,
            dbuser: data.dbuser,
            dbpass: data.dbpass,
            dbport: data.dbport,
            dbtype: data.dbtype,
            })
        });
        
        const result = await createdep.json();
        console.log(result);
        
        if (result.success) {
            return NextResponse.json({
                message: "Database Created & Deployment Started",
                success: true,
                project: project
            });
        } else {
            return NextResponse.json({
                message: `Database creation failed: Reason - ${result.message}`,
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
        
        const projectdelete = await Database.findOneAndDelete({ _id: data.id });
        console.log("database to delete:", projectdelete);
        if(projectdelete !== null && projectdelete.arn !== null || projectdelete.arn !== undefined|| projectdelete.arn !== ""){ {
            console.log("inside ")
        console.log("database not found or ARN is missing",projectdelete.arn);
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
            message: "Database Deleted Successfully"
        });
    }
        if (projectdelete == null) {
            return NextResponse.json({
                success: false,
                message: "Dtabase not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            message: "Database Deleted Successfully"
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