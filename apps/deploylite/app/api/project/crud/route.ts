import { NextResponse, NextRequest } from "next/server"
import ConnectDb from "../../../../../middleware/connectdb"
import CheckAuth from "@/actions/CheckAuth"
import Project from "../../../../../models/Project"
import { CreateprojectSchema } from "@/zod/project/CreateprojectZod"
import PricingPlan from "../../../../../models/PricingPlan"
import User from "../../../../../models/User"
export const GET = () => {
    return NextResponse.json({
        messsgae: "all crud is up and running"
    })
}
//for creating a new project.
export const POST = async (req: NextRequest) => {
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
        //fire the deployment 
        return NextResponse.json({
            message: "Project Created",
            success: true,
            project: project});

    }
    catch (err) {
        console.log(err)
        return NextResponse.json({
            message: "error occured while creating project",
            error: err,
            success: false,
        })
    }
}