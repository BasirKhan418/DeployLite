import { NextResponse,NextRequest } from "next/server";
import ConnectDb from "../../../../../middleware/connectdb";
import User from "../../../../../models/User";
import CheckAuth from "@/actions/CheckAuth";
import Wallet from "../../../../../models/Wallet";
import Crypto from "crypto-js";
import { cookies } from "next/headers";
export const GET = async(req:NextRequest,res:NextResponse)=>{
    const cook =cookies()
    try{
        await ConnectDb();
    let result = CheckAuth()
    if(!result.result){
        console.log('result',result)
        console.log("not authenticated")
        console.log(cook.get('token'))
    }
    let user = await User.findOne({ email: result.email }).select('-password');
    //decrypting the github token
    let decrypttoken = Crypto.AES.decrypt(user.githubtoken,process.env.SECRET_KEY||"").toString(Crypto.enc.Utf8);
    //modifying the user object
    let data = {...user._doc,githubtoken:decrypttoken};
    
    let wallet = await Wallet.findOne({userid:user._id});
    return NextResponse.json({status: 'success',user:data,wallet,success:true})
}
catch(err){
    return NextResponse.json({
        success:false,
        message:"Something went wrong please try again after some time "
    })
}
}