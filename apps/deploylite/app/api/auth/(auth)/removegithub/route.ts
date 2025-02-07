import { NextRequest,NextResponse } from "next/server";
import CheckAuth from "@/actions/CheckAuth";
import ConnectDb from "../../../../../../middleware/connectdb";
import {Octokit} from 'octokit';
import { createOAuthAppAuth } from "@octokit/auth-oauth-app"
import User from "../../../../../../models/User";

export const GET = async (req: NextRequest,res:NextResponse) => {
console.log("entering");
    try{
await ConnectDb();
let result = CheckAuth();
if(!result.result){
    console.log("auth error");
    return NextResponse.json({message:"authentication error",success:false});
}
//if authentication passed
let user = await User.findOne({email:result.email});
if(user==null){
    console.log("user not found");
    return NextResponse.json({message:"user not found",success:false});
}
//cheking user is connected to github
if(!user.connectgithub){
    return NextResponse.json({message:"user not connected to github",success:false});
}
//if user is connected to github then make api call
if(user.githubtoken==""){
    return NextResponse.json({success:false,message:"Your github account already disconnected"})
}
const octokit = new Octokit({
    authStrategy: createOAuthAppAuth,
    auth:{
      clientType: 'oauth-app',
      clientId: process.env.NEXT_PUBLIC_GIT_HUB_CLIENT_ID,
      clientSecret: process.env.GIT_HUB_CLIENT_SECRET,
    }
  })

  let gitres = await octokit.request('DELETE /applications/{client_id}/grant', {
    client_id: process.env.NEXT_PUBLIC_GIT_HUB_CLIENT_ID||"",
    access_token: user.githubtoken,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  if(gitres.status==204){
   let user = await User.findOneAndUpdate({email:result.email},{connectgithub:false,githubid:"",githubtoken:""},{new:true})
   if(user==null){
    return NextResponse.json({message:"Cannot Disconnect due to technical issue try again after sometime",success:false})
   }
   return NextResponse.json({success:true,message:"Your github account is diconnected successfully.",data:user})
  }
  let useri = await User.findOneAndUpdate({email:result.email},{connectgithub:false,githubid:"",githubtoken:""},{new:true})
  return NextResponse.json({message:"Your github account already disconnected ",success:false,data:useri})

    }
    catch(err){
        console.log(err)
        return NextResponse.json({message:"Something went wrong try again after sometime",success:false})
        
    }
    
}