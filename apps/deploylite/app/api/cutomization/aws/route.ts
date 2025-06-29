import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/connectdb";
import Aws from "../../../../../models/Aws";
import CheckAuth from "@/actions/CheckAuth";
import User from "../../../../../models/User";
import CryptoJS from "crypto-js";
import { CreateSchema } from "@/zod/aws/CreateSchema";
export const GET = async () => {
    try {
        await ConnectDb();
        const result = await CheckAuth();
        if (!result.result) {
            return NextResponse.json({ message: "Authentication failed please login again", success: false })
        }
        const aws = await Aws.findOne({ email: result.email });
        if (aws == null) {
            return NextResponse.json({ success: true, message: "You don't have any aws account connected", aws: false })
        }
        else {
            let awskey = CryptoJS.AES.decrypt(aws.awskey,process.env.JWT_SECRET||"").toString(CryptoJS.enc.Utf8);
            let awssecret = CryptoJS.AES.decrypt(aws.awssecret,process.env.JWT_SECRET||"").toString(CryptoJS.enc.Utf8);
            console.log(awskey,awssecret);
            let newaws = {...aws._doc,awskey,awssecret};
            return NextResponse.json({ success: true, message: "Aws account connected", aws: true, data: newaws })
        }
    }
    catch (err) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong please try again after some time"
        })
    }
}
//post for connecting aws account
export const POST = async (req: NextRequest) => {
    try {
        await ConnectDb();
        let data = await req.json();
        const result = await CheckAuth();
        if (!result.result) {
            return NextResponse.json({ success: false, message: 'authentication failed please login again' })
        }
        //checking if user have aws account or not
        let checkaws = await Aws.findOne({ email: result.email });
        if (checkaws != null) {
            return NextResponse.json({ success: false, message: "You already have an aws account connected" })
        }
        //validating the input with zod
        let zodparse = CreateSchema.safeParse(data);
        if(!zodparse.success){
            return NextResponse.json({success:false,message:"Validation failed invalid input",error:zodparse.error})
        }
        //getting the user details
        let user = await User.findOne({ email: result.email });
        let awscreate = await Aws.create({
            userid: user._id,
            email: user.email,
            awskey: CryptoJS.AES.encrypt(data.awskey, process.env.JWT_SECRET || "").toString(),
            awssecret: CryptoJS.AES.encrypt(data.awssecret, process.env.JWT_SECRET || "").toString(),
            region: data.region,
            vpcid: data.vpcid,
            subnetid1: data.subnetid1,
            subnetid2: data.subnetid2,
            subnetid3: data.subnetid3,
            securitygroupid: data.securitygroupid,
            s3bucket: data.s3bucket,
        })
        let aws = await awscreate.save();
        return NextResponse.json({ success: true, message: "Aws account connected successfully", data: aws })
    }
    catch (err) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong please try again after some time"
        })
    }

}
//update aws configuration
export const PUT = async (req: NextRequest) => {
    try{
await ConnectDb();
let data = await req.json();
let result = await CheckAuth();
if(!result.result){
    return NextResponse.json({success:false,message:"Authentication failed please login again"})
}
let aws = await Aws.findOne({email:result.email});
if(aws==null){
    return NextResponse.json({success:false,message:"You don't have any aws account connected"})
}
//forupdating the input
if(data.status=="updateinput"){
let zodparse = CreateSchema.safeParse(data);
if(!zodparse.success){
    return NextResponse.json({success:false,message:"Validation failed invalid input",error:zodparse.error})
}
let awsupdate = await Aws.findOneAndUpdate({email:result.email},{
    awskey: CryptoJS.AES.encrypt(data.awskey, process.env.JWT_SECRET||"").toString(),
    awssecret: CryptoJS.AES.encrypt(data.awssecret, process.env.JWT_SECRET||"").toString(),
    region: data.region,
    vpcid: data.vpcid,
    subnetid1: data.subnetid1,
    subnetid2: data.subnetid2,
    subnetid3: data.subnetid3,
    securitygroupid: data.securitygroupid,
    s3bucket: data.s3bucket,
},{new:true});
let awskey = CryptoJS.AES.decrypt(awsupdate.awskey,process.env.JWT_SECRET||"").toString(CryptoJS.enc.Utf8);
let awssecret = CryptoJS.AES.decrypt(awsupdate.awssecret,process.env.JWT_SECRET||"").toString(CryptoJS.enc.Utf8);
let newDATA = {...awsupdate._doc,awskey,awssecret};
console.log(newDATA);
return NextResponse.json({success:true,message:"Aws account updated successfully",data:newDATA})
}
//for updating the services
else{
let awsupdate = await Aws.findOneAndUpdate({email:result.email},data,{new:true});
return NextResponse.json({success:true,message:"Your aws services updated successfully",data:awsupdate})
}
    }
    catch(err){
        return NextResponse.json({
            success:false,
            message:"Something went wrong please try again after some time"
        })
    }

}
//delete handler for disconnecting aws account
export const DELETE = async () => {
    try{
     await ConnectDb();
     let result = await CheckAuth();
     if(!result.result){
         return NextResponse.json({success:false,message:"Authentication failed please login again"})
     }
     let aws = await Aws.findOneAndDelete({email:result.email});
     return NextResponse.json({success:true,message:"Aws account disconnected successfully"})
    }
    catch(err){
        return NextResponse.json({
            success:false,
            message:"Something went wrong please try again after some time"
        })
    }
}