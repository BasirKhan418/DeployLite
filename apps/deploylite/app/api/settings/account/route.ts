import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/connectdb";
import User from "../../../../../models/User";
import CheckAuth from "@/actions/CheckAuth";
import CryptoJS from "crypto-js";
import { Accountzod,AccountTogglezod } from "@/zod/settings/AccountZod";
export const POST = async (req: NextRequest) => {
    try{
    let data = await req.json();
    await ConnectDb();
    //checking if the user is authenticated or not 
    const result = await CheckAuth();
    if(!result.result){
        return NextResponse.json({message:"You are not authenticated. Please login to continue",success:false,login:false})
    }
    //if authenticated check the email and password with zod schema
    let presult = Accountzod.safeParse(data);
    if(!presult.success){
        return NextResponse.json({message:"Invalid input. Please try again with correct input or input is malformed or password is less than 5 characters long",success:false})
    }
    //if everything is correct then update the user password
    let user = await User.findOne({email:result.email});
    //user is null
    if(user==null){
        return NextResponse.json({message:"User not found",success:false})
    }
    //decrypt the password and check if the current password is correct or not
    let decrypted = CryptoJS.AES.decrypt(user.password,process.env.SECRET_KEY||"").toString(CryptoJS.enc.Utf8);
    if(decrypted!=data.currentPassword){
        return NextResponse.json({message:"Current Password is incorrect",success:false})
    }
    //encrypt the new password
    let encrypted = CryptoJS.AES.encrypt(data.password,process.env.SECRET_KEY||"").toString();
    let update=await User.findOneAndUpdate({email:result.email},{password:encrypted},{new:true});
    //if update is null
    if(update==null){
        return NextResponse.json({message:"Something went wrong please try again later",success:false})
    }
    return NextResponse.json({message:"Password has been updated successfully",success:true})
}
    catch(err){
        return NextResponse.json({message:"Something went wrong please try again later",success:false})
    }
}

export const PUT = async(req: NextRequest) => {
    try{
    await ConnectDb();
    let data = await req.json();
    //checking if the user is authenticated or not
    let result = await CheckAuth();
    if(!result.result){
        return NextResponse.json({message:"You are not authenticated. Please login to continue",success:false,login:false})
    }
    //if aurhenticated check the email and password with zod schema
    let presult = AccountTogglezod.safeParse(data);
    if(!presult.success){
        return NextResponse.json({message:"Invalid input. Please try again with correct input",success:false})
    }
    //if everything is ok then turn on the two factor authentication
    let user = await User.findOneAndUpdate({email:result.email},{twofactor:data.twofactor},{new:true});
    if(user==null){
        return NextResponse.json({message:"User not found",success:false})
    }
    //return the response based on the event
    //if the user using 0auth then return the response based on the event
    if(user.is0auth){
        return NextResponse.json({message:"You are using 0auth. You cannot turn on two factor authentication. Only for password based login",success:false})
    }
    if(data.twofactor){
        return NextResponse.json({message:"OTP based Two factor authentication has been turned on successfully",success:true,user})
    }
    return NextResponse.json({message:"OTP based Two factor authentication has been turned off successfully",success:true,user})
    }
    catch(err){
        return NextResponse.json({message:"Something went wrong please try again later",success:false})
    }
}