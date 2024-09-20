import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/connectdb";
import Verify from "@/html/Verify";
import ErrorTemplate from "@/html/ErrorTemplate";
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from "../../../../../models/User";
export const GET = async(req:NextRequest,res:NextResponse)=>{
  
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