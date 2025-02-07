import { NextResponse,NextRequest } from "next/server";
import Otp from "../../../../../../models/Otp";
import jwt from 'jsonwebtoken';
import SendOtp from "@/emails/auth/SendOtp";
export const GET=()=>{
    return NextResponse.json({status: 'success from resend'})
}
export const POST =async(req:NextRequest,res:NextResponse)=>{
    try{
     let data =await req.json()
     let otpdata = await Otp.findOne({email:data.email});
       if(otpdata==null){
           return NextResponse.json({status: 'error',message: 'No otp found',success: false})
       }//resend start
       if(data.status=="resend"){
       
        let token = jwt.sign({email:data.email,},process.env.JWT_SECRET||"",{expiresIn: '30m'})
        
         try{
          //sendemail
          SendOtp(data.email,token,data.name,otpdata.otp);
          return NextResponse.json({status: 'success',message: 'otp send successfully',success: true,token: token,otp:true})
         }
         catch(err){
                return NextResponse.json({status: 'error',message: 'Otp Service is down please try agin after sometime',success: false})
         }
       }
       
       //resend ends
       //hit whatsapp and send users otp
       try{
       let fetchdata = await fetch(`${process.env.NEXT_PUBLIC_MESSAGE_API||""}/api/otp/send`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({phoneNumber:data.phone,otp:otpdata.otp})
       })
         let result = await fetchdata.json()
         if(result.success){
             return NextResponse.json({status: 'success',message: 'otp send successfully through whatsapp',success: true})
         }
         else{
             return NextResponse.json({status: 'error',message: 'otp send failed',success: false})
         }
        }
        catch(err){
            return NextResponse.json({status: 'error',message: 'Otp Service is down please try agin after sometime',success: false})
        }

  
    }
    catch(err){
        return NextResponse.json({status: 'error',message: "Resend endpoint error",success: false})
    }
}