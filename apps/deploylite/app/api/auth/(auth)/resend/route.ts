import { NextResponse,NextRequest } from "next/server";
import Otp from "../../../../../../models/Otp";
import jwt, { JwtPayload } from 'jsonwebtoken';
import SendOtp from "@/emails/auth/SendOtp";
import ConnectDb from "../../../../../../middleware/connectdb";
import User from "../../../../../../models/User";
import axios from 'axios';
export const GET=()=>{
    return NextResponse.json({status: 'success from resend'})
}
export const POST =async(req:NextRequest)=>{
    try{
    let data = await req.json();
    let decryptdata: JwtPayload;
    await ConnectDb();
    try{
    decryptdata = jwt.verify(data.token,process.env.JWT_SECRET||"") as JwtPayload;
    }
    catch(err){
        return NextResponse.json({status: 'error',message: 'Resend endpoint error',success: false})
    }
     let user = await User.findOne({email:decryptdata.email});
        if(user==null){
            return NextResponse.json({status: 'error',message: 'User not found',success: false})
        }
         let otpdata = await Otp.findOne({email:user.email});
       if(otpdata==null){
           return NextResponse.json({status: 'error',message: 'No otp found',success: false})
       }//resend start
       if(data.status=="resend"){
       
        let token = jwt.sign({email:user.email,},process.env.JWT_SECRET||"",{expiresIn: '30m'})
        
         try{
          //sendemail
          SendOtp(user.email,token,user.name,otpdata.otp);
          return NextResponse.json({status: 'success',message: 'otp send successfully',success: true,token: token,otp:true})
         }
         catch(err){
            console.log(err)    
                return NextResponse.json({status: 'error',message: 'Otp Service is down please try agin after sometime',success: false})
         }
       }
       
       //resend ends
       //hit whatsapp and send users otp
       try {
        console.log("Sending OTP through WhatsApp...");
        console.log(user.phone);
        console.log(process.env.MESSAGE_API);
    
        const apiUrl = `${process.env.MESSAGE_API || ""}/api/otp/send`;
    
        const response = await axios.post(apiUrl, {
            phoneNumber: `91${user.phone}`,
            otp: otpdata.otp
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if (response.data.success) {
            return NextResponse.json({ status: 'success', message: 'OTP sent successfully through WhatsApp', success: true });
        } else {
            return NextResponse.json({ status: 'error', message: 'OTP send failed', success: false });
        }
    } catch (error) {
        console.error("Error sending OTP:", 
            error instanceof Error ? error.message : "Unknown error occurred");
        return NextResponse.json({ status: 'error', message: 'OTP Service is down, please try again later', success: false });
    }

  
    }
    catch(err){
        console.log(err)
        return NextResponse.json({status: 'error',message: "Resend endpoint error",success: false})
    }
}