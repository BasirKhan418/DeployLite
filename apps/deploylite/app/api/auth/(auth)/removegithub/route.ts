import { NextRequest, NextResponse } from "next/server";
import CheckAuth from "@/actions/CheckAuth";
import ConnectDb from "../../../../../../middleware/connectdb";
import { Octokit } from 'octokit';
import User from "../../../../../../models/User";

export const GET = async () => {
    console.log("entering");
    try {
        await ConnectDb();
        let result = await CheckAuth();
        if (!result.result) {
            console.log("auth error");
            return NextResponse.json({ message: "authentication error", success: false });
        }

        // Find user
        let user = await User.findOne({ email: result.email });
        if (user == null) {
            console.log("user not found");
            return NextResponse.json({ message: "user not found", success: false });
        }

        // Check GitHub connection
        if (!user.connectgithub) {
            return NextResponse.json({ message: "user not connected to github", success: false });
        }

        if (user.githubtoken == "") {
            return NextResponse.json({ success: false, message: "Your github account already disconnected" });
        }

        // Initialize Octokit with the user's access token
        const octokit = new Octokit({
            auth: user.githubtoken
        });

        try {
            // Use the new API endpoint to revoke the token
            await octokit.request('DELETE /applications/{client_id}/token', {
                client_id: process.env.NEXT_PUBLIC_GIT_HUB_CLIENT_ID || "",
                access_token: user.githubtoken,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            // Update user record
            let updatedUser = await User.findOneAndUpdate(
                { email: result.email },
                { connectgithub: false, githubid: "", githubtoken: "" },
                { new: true }
            );

            if (updatedUser == null) {
                return NextResponse.json({
                    message: "Cannot disconnect due to technical issue try again after sometime",
                    success: false
                });
            }

            return NextResponse.json({
                success: true,
                message: "Your github account is disconnected successfully.",
                data: updatedUser
            });

        } catch (error: any) {
            // If the token is already invalid or revoked, still update the user record
            if (error.status === 404) {
                let updatedUser = await User.findOneAndUpdate(
                    { email: result.email },
                    { connectgithub: false, githubid: "", githubtoken: "" },
                    { new: true }
                );

                return NextResponse.json({
                    message: "Your github account is already disconnected",
                    success: true,
                    data: updatedUser
                });
            }

            throw error; // Re-throw other errors to be caught by outer catch block
        }

    } catch (err) {
        console.log(err);
        return NextResponse.json({
            message: "Something went wrong try again after sometime",
            success: false
        });
    }
};