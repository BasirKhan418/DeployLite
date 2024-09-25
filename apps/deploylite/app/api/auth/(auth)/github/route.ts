import { NextRequest,NextResponse } from "next/server";
import CheckAuth from "@/actions/CheckAuth";
import User from "../../../../../../models/User";
import ConnectDb from "../../../../../../middleware/connectdb";
export const GET = async (req: NextRequest,res:NextResponse) => {
    
    try{
        await ConnectDb();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    let res = CheckAuth();
    if(!res.result){
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
            "Accept": "application/json"  // Ensures you get the response in JSON format
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

 let updateuser = await User.findOneAndUpdate({email:res.email},{connectgithub:true,githubid:githubuser.login,githubtoken:data.access_token,img:githubuser. avatar_url},{new:true});
 if(updateuser==null){
        return NextResponse.redirect(`${process.env.NEXT_URL||""}/githuberr`);
 }

return NextResponse.redirect(`${process.env.NEXT_URL||""}/githubauth`);
    }
    catch(err){
        console.log(err);
    }
}