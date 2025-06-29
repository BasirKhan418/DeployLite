import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/connectdb";
import User from "../../../../../models/User";
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import { Forget ,Reset} from "@/zod/auth/Forget";
import ForgotEmail from "@/emails/auth/ForgotEmail";
export const POST = async(req:NextRequest)=>{
try{
let data = await req.json();
await ConnectDb();
//checking req status
if(data.status=="forgot"){
//=checking if email is valid
const result = Forget.safeParse({email:data.email});
if(!result.success){
    return NextResponse.json({status: 'error',message: 'Invalid email',success: false})
}
//checking if email exists or not on the db
const user = await User.findOne({email:data.email})
if(user==null){
    return NextResponse.json({status: 'error',message: 'User not found with this email',success: false})
}
//creating token
const token = jwt.sign({email:data.email,name:user.name},process.env.JWT_SECRET||"",{expiresIn: '1h'});
//Sending email through our email service
await ForgotEmail(user.email,token,user.name);
//returning success message
return NextResponse.json({status: 'success',message: 'Password reseting email sending successfully!. Check your email and reset your password',success: true})

}
//else if status is reset
else if(data.status=="reset"){
    //checking if token and password is valid or not 
    const result = Reset.safeParse({password:data.password});
    if(!result.success){
        return NextResponse.json({status: 'error',message: 'Passwords should be 6 characters long .',success: false})
    }
    //decrypting token
    try{
    let tokendata:any = jwt.verify(data.token,process.env.JWT_SECRET||"");
    //encrypting password
    let encryptpass = CryptoJS.AES.encrypt(data.password,process.env.SECRET_KEY||"").toString()
    //updating password
    let upuser = await User.findOneAndUpdate({email:tokendata.email},{password:encryptpass})
    //checking if it is actually updated or not 
    if(upuser==null){
        return NextResponse.json({status: 'error',message: 'User not found with this email',success: false})
    }
    return NextResponse.json({status: 'success',message: 'Password reset successfully.Redirecting to the login page..',success: true})
    }
    catch(err){
        console.log(err)
        return NextResponse.json({status: 'error',message: 'Invalid token or token expires . If it send before 1hr please resend it and reset your password',success: false})
    }
}
//else return bad request
return NextResponse.json({status: 'error',message: 'Bad Request',success: false})
}
catch(err:any){
    return NextResponse.json({status: 'error',message: err.message,success: false})
}
}