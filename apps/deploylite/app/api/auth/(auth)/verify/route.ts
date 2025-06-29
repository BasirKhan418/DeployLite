import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../../middleware/connectdb";
import Verify from "@/html/Verify";
import ErrorTemplate from "@/html/ErrorTemplate";
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from "../../../../../../models/User";
import SendVeriyEmail from "@/emails/auth/SendVerifyEmail";
export const GET = async(req:NextRequest)=>{
  
    try{
        let token = req.url.split("token=")[1];
        await ConnectDb()
        let decoded:any= jwt.verify(token,process.env.SECRET_KEY||"")  
        if(decoded){
         let findand = await User.findOneAndUpdate({email:decoded.email},{isverified:true})
        }
        return new NextResponse(Verify(), {
            headers: {
              'Content-Type': 'text/html',
            },
          });
    }
    catch(err:any){
        return new NextResponse(ErrorTemplate("Token Malformed or Auth service is down . Contact at support@deploylite.tech .Detailed Error for support team: - "+" "+err), {
            headers: {
              'Content-Type': 'text/html',
            },
          });
    }
}
export const POST = async(req:NextRequest)=>{

  let data = await req.json()
  console.log(data)
  //checking status of request
  if(data.status === "resend"){
  try{
    await ConnectDb()
    //implement rate limiting here for security otherwise attacker can send multiple requests
    //imp
    //decoding token value
    let decodedvalue:any= jwt.verify(data.token,process.env.SECRET_KEY||"") 
    console.log(decodedvalue)
    if(decodedvalue){
      //creating a new token
      await SendVeriyEmail(decodedvalue.email,data.token,decodedvalue.username)
      return NextResponse.json({success:true,message:"Verification Email Sent Successfully"}) 
    }
    return NextResponse.json({success:false,message:"Invalid Token"})
  }
  catch(err){
   return NextResponse.json({success:false,message:"Something went wrong please try again later"+err})
  }
}
//if status is verify then verify the user
else if(data.status === "verify"){
  console.log("iam in veroify toekn is " , data.token)
  await ConnectDb()
  try{
    let decoded:any= jwt.verify(data.token,process.env.SECRET_KEY||"")
    console.log(decoded)
    if(decoded){
      let findand = await User.findOne({email:decoded.email,isverified:true})
      //if user is verified then return success message
      if(findand!=null){
        return NextResponse.json({success:true,message:"User Verified Successfully"})
      }
      //if user is not verified then return error message
      return NextResponse.json({success:false,message:"We have sent you a verification email. Please verify your email to continue."})
    }
    //if token is invalid then return error message
    return NextResponse.json({success:false,message:"Invalid Token"})
  }
  catch(err){
    return NextResponse.json({success:false,message:"Something went wrong please try again later"+err})
  }
}
return NextResponse.json({success:false,message:"Invalid Request"})
}