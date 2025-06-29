import { NextRequest,NextResponse } from "next/server"
import mongoose from 'mongoose';
import ConnectDb from '../../../../../../middleware/connectdb'
import User from '../../../../../../models/User'
import cryptojs from 'crypto-js'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import Otp from '../../../../../../models/Otp'
import SendOtp from "@/emails/auth/SendOtp";
import { isGenerator } from "framer-motion";
export const GET = async()=>{
    return NextResponse.json({status: 'success'})
}
export const POST = async(req:NextRequest)=>{
    const cookie = cookies()
try{
await ConnectDb()
let data = await req.json()
let finduser = await User.findOne({email:data.email})
//if user not found
if(finduser==null){
    return NextResponse.json({status: 'error',message: 'Account does not exist with this email',success: false})
}
//if user found but not verified
if(!finduser.isverified){
return NextResponse.json({status: 'error',message: 'Please verify your email for accessing your account',success: false,verify:false})
}

//if user found and verified
let descrypted = cryptojs.AES.decrypt(finduser.password,process.env.SECRET_KEY||"").toString(cryptojs.enc.Utf8)
if(descrypted!=data.password){
    return NextResponse.json({status: 'error',message: 'Password is incorrect',success: false})
}
//if twofactor authentication is enabled
if(data.score<=70){
    console.log("suspicious detected use two factor")
    let otp = await Otp.findOne({userid:finduser._id})
    if(otp!=null){
        let deleteotp = await Otp.findByIdAndDelete(otp._id);
    }
    let otpcode = Math.floor(1000 + Math.random() * 9000);
    let newotp = new Otp({
        userid: finduser._id,
        otp: otpcode,
        email: finduser.email,
    })
    let saveotp = await newotp.save()
    //make a token
    let token = jwt.sign({email:finduser.email,username:finduser.username},process.env.JWT_SECRET||"",{expiresIn: '30m'})
    
     try{
      //sendemail
      SendOtp(finduser.email,token,finduser.name,otpcode);
      return NextResponse.json({status: 'success',message: 'Otp has been sent to your email. Suscpicious activity detected two step enabled',success: true,token: token,otp:true})
     }
     catch(err){
            return NextResponse.json({status: 'error',message: 'Otp Service is down please try agin after sometime',success: false})
     }
}
if(finduser.twofactor){
    let otp = await Otp.findOne({userid:finduser._id})
    if(otp!=null){
        let deleteotp = await Otp.findByIdAndDelete(otp._id);
    }
    let otpcode = Math.floor(1000 + Math.random() * 9000);
    let newotp = new Otp({
        userid: finduser._id,
        otp: otpcode,
        email: finduser.email,
    })
    let saveotp = await newotp.save()
    //make a token
    let token = jwt.sign({email:finduser.email,username:finduser.username},process.env.JWT_SECRET||"",{expiresIn: '30m'})
    
     try{
      //sendemail
      SendOtp(finduser.email,token,finduser.name,otpcode);
      return NextResponse.json({status: 'success',message: 'Otp has been sent to your email',success: true,token: token,otp:true})
     }
     catch(err){
            return NextResponse.json({status: 'error',message: 'Otp Service is down please try agin after sometime',success: false})
     }
}

//if twofactor authentication is not enabled
let token = jwt.sign({email:finduser.email,username:finduser.username},process.env.SECRET_KEY||"",{expiresIn: '7d'})

const cookiesObj = await cookies();
cookiesObj.set('token', token, {
  httpOnly: true, 
  expires: new Date(Date.now() + 1000*60*60*24*7)
});

return NextResponse.json({status: 'success',message: 'Login success',success: true,token: token,otp:false})
}
catch(err:any){
    return NextResponse.json({status: 'error',message: err.message,success: false})
}
}