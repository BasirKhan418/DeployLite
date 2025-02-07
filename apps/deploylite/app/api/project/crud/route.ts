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
export const GET = async(req:NextRequest,res:NextResponse) => {
    const { searchParams } = new URL(req.url);
    try{
     await ConnectDb();
     let checkres = CheckAuth();
     //checking for proper authentication
     if(!checkres.result){
        return NextResponse.json({
            success:false,
            message:"Authentication failed please try again later!"
        })
     }
     //check the entry and return it;
     let projectdata = await Project.find({userid:searchParams.get("id")}).populate("userid");
     if(projectdata==null){
        return NextResponse.json({
            success:false,
            message:"No Projects found."
        })
     }
     return NextResponse.json({
        success:true,
        projectdata:projectdata,
        message:"Successfully fetched"
    })
    }
    catch(err){
        return NextResponse.json({
            success:false,
            message:"Some thing went wrong please try again later!"
        })
    }
}
//for creating a new project.
export const POST = async (req: NextRequest) => {
    const getcookie = cookies();
    try {
        await ConnectDb();
        let data = await req.json()
        const auth = await CheckAuth();
        //checking if user is authenticated or not.
        if (!auth.result) {
            return NextResponse.json({
                message: "User is not authenticated",
                success: false,
                autherror: true
            })
        }
        //sanitize user payload
        const santizepayload = CreateprojectSchema.safeParse(data);
        //checking if payload is valid or not.
        console.log(data)
        if(!santizepayload.success){
            return NextResponse.json({
                message: "Invalid Payload tampering detected",
                success: false,
                error: santizepayload.error,
            })
        }
        //check project is unique or not
        let name = data.name.replace(/\s+/g, '').toLowerCase();
        console.log(name);
        let projectname = await Project.findOne({name:name});
        //if project name already exists
        if(projectname!=null){
            return NextResponse.json({
                message:"Project name already exists. Select a different name",
                success:false,
                projectname:"exists"
            })
        }
        //checks pricing plan exists or not
        console.log(data.planid)
        let checkplan = await PricingPlan.findOne({_id:data.planid});
        if(checkplan==null){
            return NextResponse.json({
                message:"Pricing Plan does not exists. Pricing plan may be deleted or invalid",
                success:false,
                planid:"invalid"
            })
        }
        //check if user has access to the plan
        console.log("checking user")
        let user = await User.findOne({email:auth.email});
        console.log(user)
        if(user==null){
            return NextResponse.json({
                message:"User not found",
                success:false,
                user:"notfound"
            })
        }

        //if every thing is ok then continue
        console.log("creating project")
        //setting date
        const startbilingdate = new Date(); // Today's date and current time
        const endbilingdate = new Date(startbilingdate); // Clone startbilingdate to preserve the date
        
        // Set endbilingdate to midnight (12:00 AM) of the next day
        endbilingdate.setDate(startbilingdate.getDate() + 1); // Move to the next day
        endbilingdate.setHours(0, 0, 0, 0); // Set time to 12:00 AM (start of the day)
        
        console.log('Start Billing Date (Today, local time):', startbilingdate.toLocaleString());
        console.log('End Billing Date (Next day, 12:00 AM local time):', endbilingdate.toLocaleString());
        
        //creating project
        let project = new Project({
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
            billstatus:"pending",
            startbilingdate: startbilingdate,
            endbilingdate: endbilingdate,
        });
        await project.save();
        //create a deployment schema
        let Deploymentdata = new Deployment({
            userid:user._id,
            projectid:project._id,
            status:"creating",
            deploymentdate:new Date(),
        })
        await Deploymentdata.save();
        let decryptgithubauth = CryptoJS.AES.decrypt(user.githubtoken, process.env.SECRET_KEY||"").toString(CryptoJS.enc.Utf8);
        //firing some api toi better handle the deployment
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
                authtoken:decryptgithubauth,
            })
        });
        const result = await createdep.json();
        console.log(result);
        
        if(result.success){
            return NextResponse.json({
                message: "Project Created & Deployment Started",
                success: true,
                project: project});
        }
        else{
            return NextResponse.json({
                message: `Project creation failed: Reason-`+result.message,
                success: false,
                project: project});
        }

    }
    catch (err) {
        console.log("error occured while creating project")
        console.log(err)
        return NextResponse.json({
            message: "error occured while creating project",
            error: err,
            success: false,
        })
    }
}
//delete project data

export const DELETE = async(req:NextRequest,res:NextResponse) => {
    try{
    let data = await req.json();
    await ConnectDb();
    const auth = await CheckAuth();
        //checking if user is authenticated or not.
        if (!auth.result) {
            return NextResponse.json({
                message: "User is not authenticated",
                success: false,
                autherror: true
            })
        }
        let projectdelete = await Project.findOneAndDelete({_id:data.id});
        if(projectdelete==null){
            return NextResponse.json({
                success:false,
                message:"Project not found"
            })
        }
        return NextResponse.json({
            success:true,
            message:"Project Deleted Successfully"
        });
    }
    catch(err){
        return NextResponse.json({success:false,message:"Some thing went wrong please try again later!"})
    }
}