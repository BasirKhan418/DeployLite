import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/connectdb";
import PricingPlan from "../../../../../models/PricingPlan";
export const GET = async()=>{
    return NextResponse.json({message:"hello how are you i am from pricing plans every thing is up and running"})
}
export const POST = async(req:NextRequest)=>{
    try{
     let data = await req.json();
        await ConnectDb();
        //checking for the auth 
        //later changed it into proper admin access
        if(data.pin!=process.env.PIN){
        return NextResponse.json({
            message:"Invalid Pin",
            status:401,
            success:false
        })
        }
        //if every thing is ok then continue
        let plan = new PricingPlan(data);
        await plan.save();
        return NextResponse.json({
            message:"Pricing Plan Added",
            status:200,
            success:true
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