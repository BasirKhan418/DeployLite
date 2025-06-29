import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/connectdb";
import User from "../../../../../models/User";
import Notification from "../../../../../models/Notification";
import CheckAuth from "@/actions/CheckAuth";
export const GET = async()=>{
    try{
        await ConnectDb();
    let result = await CheckAuth(); // Added await here
    if(!result.result){
        return NextResponse.json({message:"You are not authenticated. Please login to continue",success:false,login:false})
    }
    let Notifications = await Notification.findOne({ email: result.email });
    return NextResponse.json({status: 'success',data:Notifications,success:true})
}
catch(err){
    return NextResponse.json({
        success:false,
        message:"Something went wrong please try again after some time "
    })
}
}
//post request to create a new notification
export const POST = async(req:NextRequest)=>{
    try{
     await ConnectDb();
        let data = await req.json();
        let result = await CheckAuth(); // Added await here
        if(!result.result){
            return NextResponse.json({message:"You are not authenticated. Please login to continue",success:false,login:false})
        }
        let notdata = await Notification.findOne({email:result.email});
        //if notification not created
        if(notdata==null){
            let data = await User.findOne({email:result.email});
            let newnot = new Notification({
                email:result.email,
                userid:data._id,
            })
            await newnot.save();
            return NextResponse.json({message:"Notification subscribe successfully",success:true})
        
        }
        //if notification already exists
        let newnotdata = await Notification.findOneAndUpdate({email:result.email},{deployment:data.deployment,buildfailure:data.buildfailure,emailnotification:data.emailnotification,securityalerts:data.securityalerts,inapp:data.inapp},{new:true});
        console.log(newnotdata)
        console.log(data)
        return NextResponse.json({message:"Notification updated successfully",success:true})

    }
    catch(err){
        return NextResponse.json({
            success:false,
            message:"Something went wrong please try again after some time "
        })
    }
}