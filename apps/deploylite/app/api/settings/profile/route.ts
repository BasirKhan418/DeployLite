import { NextRequest,NextResponse } from "next/server";
import CheckAuth from "@/actions/CheckAuth";
import User from "../../../../../models/User";
import ConnectDb from "../../../../../middleware/connectdb";
import { Profilezod } from "@/zod/settings/Profilezod";
export const POST = async (req: NextRequest) => {
    try{
        await ConnectDb();  
        let data = await req.json();
     const result = await CheckAuth();

     // If user is not authenticated redirect to login page
     if(!result.result){
        //make sure to redirect to get 
        console.log(`${process.env.NEXT_URL}/login`)
         return NextResponse.json({message:"You are not authenticated. Please login to continue",success:false,login:false})
     }
     //sanitize or validate the userinput

     const pdata = Profilezod.safeParse(data);
     if(!pdata.success){
         return NextResponse.json({message:"Invalid input. Please try again with correct input",success:false})
     }

        // If user is authenticated return the user data
        let user = await User.findOneAndUpdate({email:data.email},{name:data.name,username:data.username,bio:data.bio,phone:data.phone},{new:true});
        // If user is not found return user not found
        if(user==null){
            return NextResponse.json({message:"User not found to update",success:false})
        }
        // If user is found return the user data
        return NextResponse.json({message:"Your profile has been updated successfully",success:true,user})

    }
    catch(e){
        return NextResponse.json({message:"Something went wrong please try again later",success:false})
    }
}