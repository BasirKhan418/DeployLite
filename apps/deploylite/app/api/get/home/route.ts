import { NextResponse, NextRequest } from "next/server";
import ConnectDb from "../../../../../middleware/connectdb";
import User from "../../../../../models/User";
import CheckAuth from "@/actions/CheckAuth";
import Wallet from "../../../../../models/Wallet";
import Crypto from "crypto-js";

export const GET = async (req: NextRequest) => {
    try {
        // Connect to database
        await ConnectDb();
        console.log('Home API: Database connected');

        // Check authentication
        const authResult = await CheckAuth();
        console.log('Home API: Auth result:', { 
            result: authResult.result, 
            email: authResult.email,
            error: authResult.error 
        });

        if (!authResult.result) {
            console.log('Home API: Authentication failed:', authResult.error);
            return NextResponse.json({
                success: false,
                message: "Authentication failed. Please login again.",
                error: authResult.error || "Authentication required"
            }, { status: 401 });
        }

        // Find user
        const user = await User.findOne({ email: authResult.email }).select('-password');
        if (!user) {
            console.log('Home API: User not found for email:', authResult.email);
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        console.log('Home API: User found:', user.email);

       
        let decrypttoken: string | null = null;
        if (user.githubtoken && user.githubtoken !== "") {
            try {
                decrypttoken = Crypto.AES.decrypt(user.githubtoken, process.env.SECRET_KEY || "").toString(Crypto.enc.Utf8);
            } catch (decryptError) {
                console.log('Home API: GitHub token decryption failed');
                decrypttoken = null;
            }
        }

        // Prepare user data
        const userData = {
            ...user._doc,
            githubtoken: decrypttoken
        };

        // Find or create wallet
        let wallet = await Wallet.findOne({ userid: user._id });
        if (!wallet) {
            console.log('Home API: Creating new wallet for user');
            wallet = new Wallet({
                userid: user._id,
                balance: Number(process.env.WALLET_BALANCE) || 0,
                transactions: [{
                    amount: Number(process.env.WALLET_BALANCE) || 0,
                    description: "Signup Bonus Credited",
                    type: "credit",
                    date: new Date()
                }]
            });
            await wallet.save();
            console.log('Home API: New wallet created with balance:', wallet.balance);
        } else {
            console.log('Home API: Existing wallet found with balance:', wallet.balance);
        }

        // Ensure transactions is an array
        if (!wallet.transactions) {
            wallet.transactions = [];
        }

        // Ensure balance is a number
        if (typeof wallet.balance !== 'number') {
            wallet.balance = Number(wallet.balance) || 0;
        }

        console.log('Home API: Returning data:', {
            userEmail: userData.email,
            walletBalance: wallet.balance,
            transactionCount: wallet.transactions.length
        });

        return NextResponse.json({
            status: 'success',
            user: userData,
            wallet: wallet,
            success: true
        });

    } catch (err: any) {
        console.error("Home API: Error occurred:", err);
        return NextResponse.json({
            success: false,
            message: "Something went wrong please try again after some time",
            error: err.message
        }, { status: 500 });
    }
};