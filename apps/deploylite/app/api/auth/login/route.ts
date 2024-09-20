import { NextRequest,NextResponse } from "next/server"
import mongoose from 'mongoose';
import ConnectDb from '../../../../../middleware/connectdb'
import User from '../../../../../models/User'
import cryptojs from 'crypto-js'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
export const GET = async()=>{
    return NextResponse.json({status: 'success'})
}
export const POST = async(req:NextRequest,res:NextResponse)=>{
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
let token = jwt.sign({email:finduser.email,username:finduser.username},process.env.SECRET_KEY||"")
cookie.set('token',token,{httpOnly:true,expires: new Date(Date.now() + 1000*60*60*24*7)});
return NextResponse.json({status: 'success',message: 'Login success',success: true,token: token})
}
catch(err:any){
    return NextResponse.json({status: 'error',message: err.message,success: false})
}
}