import { NextRequest,NextResponse } from "next/server"
import mongoose from 'mongoose';
import ConnectDb from '../../../../../middleware/connectdb'
import User from '../../../../../models/User'
import cryptojs from 'crypto-js'
import jwt from 'jsonwebtoken'
import SendVeriyEmail from "@/emails/auth/SendVerifyEmail";
export const GET = async()=>{
    return NextResponse.json({status: 'success'})
}
export const POST = async(req:NextRequest,res:NextResponse)=>{
try{
    //connecting to db
await ConnectDb()
let data = await req.json()
//finding user in db
let finduser = await User.findOne({email:data.email})
if(finduser!=null){
    if(!finduser.isverified){
        //creating token
        let token = jwt.sign({email:finduser.email,username:finduser.username},process.env.SECRET_KEY||"")
        //sending token with payload
        await SendVeriyEmail(finduser.email,token,finduser.name)
        return NextResponse.json({status: 'error',message: 'Please verify your email for accessing your account',success: false,verify:false})
    }
    return NextResponse.json({status: 'error',message: 'Already have an account with this email',success: false,verify:true})
}
//else user not found & create an fresh account 
let password = cryptojs.AES.encrypt(data.password,process.env.SECRET_KEY||"").toString()
let usernamepre = data.name.split(" ")[0];
let username = usernamepre+Math.floor(Math.random()*1000)
let user = new User({
    name:data.name,
    email:data.email,
    password:password,
    username:username
})
await user.save();
 //creating token
 let token = jwt.sign({email:user.email,username:user.username},process.env.SECRET_KEY||"")
 //sending token with payload
 await SendVeriyEmail(user.email,token,user.name)
return NextResponse.json({status: 'success',message: 'User created successfully. Please Verify your account to continue',success: true})
}
catch(err:any){
    return NextResponse.json({status: 'error',message: err.message,success: false})
}
}