import { NextRequest,NextResponse } from "next/server";
import CheckAuth from "@/actions/CheckAuth";
import User from "../../../../../../models/User";
import ConnectDb from "../../../../../../middleware/connectdb";
import CryptoJS from "crypto-js";
export const GET = async (req: NextRequest) => {
    
    try{
        await ConnectDb();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    let authResult = await CheckAuth();
    if(!authResult.result){
        return NextResponse.redirect(`${process.env.NEXT_URL||""}/autherror`);
    }
    if(code==null && state==null){
        return NextResponse.redirect(`${process.env.NEXT_URL||""}/githuberr`);
    }
    if(state!=process.env.NEXT_PUBLIC_STATE){
        return NextResponse.redirect(`${process.env.NEXT_URL||""}/githuberr`);
    }
    let maketoken = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"  
        },
        body: JSON.stringify({
            client_id: process.env.NEXT_PUBLIC_GIT_HUB_CLIENT_ID,   
            client_secret: process.env.GIT_HUB_CLIENT_SECRET, 
            code: code,  
            redirect_uri: process.env.NEXT_PUBLIC_GIT_HUB_REDIRECT_URI, 
            state: process.env.NEXT_PUBLIC_STATE  
        })
    })
    const data = await maketoken.json();
    console.log(data);
    //if error occurs
    if(data.error){
        return NextResponse.redirect(`${process.env.NEXT_URL||""}/githuberr`);
    }
 //save the date return to authenticating page
  //see the github user details
    let getuser = await fetch("https://api.github.com/user",{
        headers:{
            "Authorization":`Bearer ${data.access_token}`
        }
    });
    const githubuser = await getuser.json();
    console.log(githubuser);
//encrypting the github token for security reasons
let token = CryptoJS.AES.encrypt(data.access_token,process.env.SECRET_KEY||"").toString();
 let updateuser = await User.findOneAndUpdate({email:authResult.email},{connectgithub:true,githubid:githubuser.login,githubtoken:token,img:githubuser. avatar_url},{new:true});
 //HANDLING THE ERROR
 if(updateuser==null){
        return NextResponse.redirect(`${process.env.NEXT_URL||""}/githuberr`);
 }

return NextResponse.redirect(`${process.env.NEXT_URL||""}/githubauth`);
    }
    catch(err){
        return NextResponse.redirect(`${process.env.NEXT_URL||""}/githuberr`);
    }
}