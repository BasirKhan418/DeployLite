import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../../middleware/connectdb";
import User from "../../../../../../models/User";
import Otp from "../../../../../../models/Otp";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
export const POST = async(req:NextRequest)=>{
    try{
     await ConnectDb();
     const cookie = cookies();
        let data = await req.json();
        console.log(data)
        //checking the token is valid or not
        try{
            let token:any = jwt.verify(data.token,process.env.JWT_SECRET||"");
            console.log(token);
            //checking the otp code
            let otp = await Otp.findOne({email:token.email,otp:data.otp});
            if(otp==null){
                return NextResponse.json({status: 'error',message: 'Invalid Otp code',success: false})
            }
            //deleting the otp code
            let deleteotp = await Otp.findByIdAndDelete(otp._id);
            //creating the token on behalf of user 
            let logintoken = jwt.sign({email:token.email,username:token.username},process.env.SECRET_KEY||"",{expiresIn: '7d'});
            
            const response = NextResponse.json({status: 'success',message: 'Login success',success: true});
            response.cookies.set('token', logintoken, {
                httpOnly: true,
                expires: new Date(Date.now() + 1000*60*60*24*7)
            });
            return response;
        }
        catch(err){
            return NextResponse.json({status: 'error',message: 'Invalid token or Otp code is expired.',success: false})
        }
    }
    catch(err:any){
        return NextResponse.json({status: 'error',message: 'Something went wrong please try again later',success: false})
    }
}