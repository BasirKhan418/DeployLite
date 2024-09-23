import { NextResponse,NextRequest } from "next/server";
import ConnectDb from "../../../../../middleware/connectdb";
import User from "../../../../../models/User";
import CheckAuth from "@/actions/CheckAuth";
import Wallet from "../../../../../models/Wallet";
export const GET = async(req:NextRequest,res:NextResponse)=>{
    try{
        await ConnectDb();
    let result = CheckAuth()
    if(!result.result){
        return NextResponse.redirect(`${process.env.NEXT_URL}/login`)
    }
    let user = await User.findOne({ email: result.email }).select('-password');
    let wallet = await Wallet.findOne({userid:user._id});
    return NextResponse.json({status: 'success',user,wallet,success:true})
}
catch(err){
    return NextResponse.json({
        success:false,
        message:"Something went wrong please try again after some time "
    })
}
}