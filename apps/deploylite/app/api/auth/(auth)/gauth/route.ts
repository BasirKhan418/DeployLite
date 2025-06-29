import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "../../../../../../middleware/connectdb";
import User from "../../../../../../models/User";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import Wallet from "../../../../../../models/Wallet";
import Notification from "../../../../../../models/Notification";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const cook = await cookies();
    console.log("google hitting");
    const code = searchParams.get('code');
    console.log(code)
    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    
    if (!code) {
        return NextResponse.json({ error: "Authorization code not provided", success: "false" });
    }

    try {
        await ConnectDb();

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id,
            client_secret,
            redirect_uri,
            grant_type: 'authorization_code',
        });

        const { access_token } = tokenResponse.data;
        console.log("access token is ", access_token)

        // Get user info using the access token
        const userInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
        
        const userInfo = userInfoResponse.data;
        console.log("userinfo is", userInfo);
        let checkuser: any = await User.findOne({ email: userInfo.email });
        
        //check if user already exists
        if (checkuser != null) {
            let checkuser2 = await User.findOne({ email: userInfo.email, is0auth: true });
            if (checkuser2 != null) {
                //creating token
                let token = jwt.sign({ email: checkuser2.email, name: checkuser2.name, username: checkuser2.username }, process.env.SECRET_KEY || "");
                //  setting cookie
                cook.set("reason", "login", { maxAge: 180 })
                cook.set("username", checkuser2.username, { maxAge: 180 })
                cook.set("email", checkuser2.email, { maxAge: 180 })
                cook.set("token", token, { httpOnly: true, path: "/", expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });

                return NextResponse.redirect(`${process.env.NEXT_URL || ""}/authsuccess`);
            }
            else {
                cook.set("msg", "User already exists with these credentials. Please log in with your credentials. OAuth is not allowed.", { path: "/", expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1) });
                return NextResponse.redirect(`${process.env.NEXT_URL || ""}/autherror`);
            }
        }
        
        //create an account 
        let username = userInfo.email.split("@")[0] + Math.floor(Math.random() * 1000);
        let user = new User({
            name: userInfo.name,
            email: userInfo.email,
            img: userInfo.picture,
            is0auth: true,
            username: username,
            authtoken: access_token
        })
        await user.save();
        
        let wallet = new Wallet({
            userid: user._id,
            balance: process.env.WALLET_BALANCE || 0,
            transactions: [{ amount: process.env.WALLET_BALANCE || 0, description: "Signup Bonous Credited", type: "credit", date: new Date() }]
        })
        await wallet.save();
        
        //create notification
        let newnot = new Notification({
            userid: user._id,
            email: user.email,
        })
        await newnot.save();
        
        //creating token
        let token = jwt.sign({ email: userInfo.email, name: userInfo.name, username: username }, process.env.SECRET_KEY || "");
        // setting cookies
        cook.set("token", token, { httpOnly: true, path: "/", expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
        cook.set("reason", "create", { maxAge: 180 })
        cook.set("username", username, { maxAge: 180 })
        cook.set("email", userInfo.email, { maxAge: 180 })

        return NextResponse.redirect(`${process.env.NEXT_URL || ""}/authsuccess`);
    } catch (error) {
        const cook = await cookies();
        cook.set("msg", "Error during token exchange or user info retrieval", { path: "/", expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1) });
        return NextResponse.redirect(`${process.env.NEXT_URL || ""}/autherror`);
    }
}