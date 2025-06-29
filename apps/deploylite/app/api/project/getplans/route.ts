import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/connectdb";
import PricingPlan from "../../../../../models/PricingPlan";
import CheckAuth from "@/actions/CheckAuth";
export const GET = async()=>{
    try{
    await ConnectDb();
    ///checking for the auth
    let auth = await CheckAuth();
    if(auth.result==false){
        return NextResponse.json({
            message:"Unauthorized Access",
            status:401,
            success:false
        })
    }

    let plans = await PricingPlan.find({});
    if(plans==null){
        return NextResponse.json({
            message:"No Plans Found",
            status:404,
            success:false
        })

    }
    return NextResponse.json({
        message:"All Plans",
        status:200,
        success:true,
        data:plans
    })

    }
    catch(err:any){
        return NextResponse.json({
            message:err.message,
            status:500,
            success:false
        })
    }
}