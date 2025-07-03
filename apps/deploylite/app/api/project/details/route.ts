import { NextResponse, NextRequest } from "next/server"
import ConnectDb from "../../../../../middleware/connectdb"
import CheckAuth from "@/actions/CheckAuth"
import Project from "../../../../../models/Project"
import { CreateprojectSchema } from "@/zod/project/CreateprojectZod"
import PricingPlan from "../../../../../models/PricingPlan"
import User from "../../../../../models/User"
import Deployment from "../../../../../models/Deployment"
import { cookies } from "next/headers"
import CryptoJS from "crypto-js"
export const GET = async(req:NextRequest) => {
    const { searchParams } = new URL(req.url);
    try{
     await ConnectDb();
     let checkres = await CheckAuth();
     //checking for proper authentication
     if(!checkres.result){
        return NextResponse.json({
            success:false,
            message:"Authentication failed please try again later!"
        })
     }
     //check the entry and return it;
     let projectdata = await Project.findOne({_id:searchParams.get("id")}).populate("planid");
     let deployment = await Deployment.find({projectid:searchParams.get("id")});
     if(projectdata==null){
        return NextResponse.json({
            success:false,
            message:"We cant fetched your data right now. Try again after sometime."
        })
     }
     return NextResponse.json({
        success:true,
        projectdata,
        deployment,
        message:"Successfully fetched"
    })
    }
    catch(err){
        return NextResponse.json({
            success:false,
            message:"Some thing went wrong please try again later!"
        })
    }
}
  