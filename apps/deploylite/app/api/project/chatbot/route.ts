import { NextResponse, NextRequest } from "next/server"
import ConnectDb from "../../../../../middleware/connectdb"
import CheckAuth from "@/actions/CheckAuth"
import ChatbotBuilder from "../../../../../models/ChatbotBuilder"
import VirtualSpace from "../../../../../models/VirtualSpace"
import WebBuilder from "../../../../../models/WebBuilder"
import Project from "../../../../../models/Project"
import PricingPlan from "../../../../../models/PricingPlan"
import User from "../../../../../models/User"
import { cookies } from "next/headers"

export const GET = async () => {
    try {
        await ConnectDb();
        
        const checkres = await CheckAuth();
        
        if (!checkres.result) {
            return NextResponse.json({
                success: false,
                message: "Authentication failed please try again later!"
            }, { status: 401 });
        }
        
        const user = await User.findOne({ email: checkres.email });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        
        const projectdata = await ChatbotBuilder.find({ userid: user._id }).populate("userid").populate("planid");
        
        if (!projectdata || projectdata.length === 0) {
            return NextResponse.json({
                success: true,
                projectdata: [],
                message: "No Chatbots found."
            });
        }
        
        return NextResponse.json({
            success: true,
            projectdata: projectdata,
            message: "Successfully fetched"
        });
        
    } catch (err) {
        console.error("Error in GET /api/project/chatbot:", err);
        return NextResponse.json({
            success: false,
            message: "Something went wrong please try again later!"
        }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    const getcookie = await cookies();
    
    try {
        await ConnectDb();
        const data = await req.json();
        const auth = await CheckAuth();
        
        console.log("Received chatbot data:", data); 
        
        if (!auth.result) {
            return NextResponse.json({
                message: "User is not authenticated",
                success: false,
                autherror: true
            }, { status: 401 });
        }

        // Validate required fields
        if (!data.name) {
            return NextResponse.json({
                message: "Chatbot name is required",
                success: false,
            }, { status: 400 });
        }

        if (!data.planid) {
            return NextResponse.json({
                message: "Plan ID is required",
                success: false,
            }, { status: 400 });
        }

        if (!data.env) {
            return NextResponse.json({
                message: "Environment configuration is required",
                success: false,
            }, { status: 400 });
        }
        
        // Process name (remove spaces and convert to lowercase)
        const name = data.name.replace(/\s+/g, '').toLowerCase();
        console.log("Processed name:", name);
        
        // Check for name conflicts across all project types
        const [projectname, webbuildername, virtualspacename, chatbotname] = await Promise.all([
            Project.findOne({ name: name }),
            WebBuilder.findOne({ name: name }),
            VirtualSpace.findOne({ name: name }),
            ChatbotBuilder.findOne({ name: name })
        ]);
        
        if (projectname != null) {
            return NextResponse.json({
                message: "Project name already exists. Select a different name",
                success: false,
                projectname: "exists"
            }, { status: 409 });
        }

        if (webbuildername != null) {
            return NextResponse.json({
                message: "Web Builder name already exists. Select a different name",
                success: false,
                webbuildername: "exists"
            }, { status: 409 });
        }

        if (virtualspacename != null) {
            return NextResponse.json({
                message: "Virtual Space name already exists. Select a different name",
                success: false,
                virtualspacename: "exists"
            }, { status: 409 });
        }

        if (chatbotname != null) {
            return NextResponse.json({
                message: "Chatbot name already exists. Select a different name",
                success: false,
                chatbotname: "exists"
            }, { status: 409 });
        }
        
        console.log("Checking plan:", data.planid);
        const checkplan = await PricingPlan.findOne({ _id: data.planid });
        
        if (checkplan == null) {
            return NextResponse.json({
                message: "Pricing Plan does not exist. Pricing plan may be deleted or invalid",
                success: false,
                planid: "invalid"
            }, { status: 400 });
        }
        
        console.log("checking user");
        const user = await User.findOne({ email: auth.email });
        console.log("User found:", user ? "Yes" : "No");
        
        if (user == null) {
            return NextResponse.json({
                message: "User not found",
                success: false,
                user: "notfound"
            }, { status: 404 });
        }

        console.log("creating chatbot project");
        
        const startbilingdate = new Date(); 
        const endbilingdate = new Date(startbilingdate); 
        
        endbilingdate.setDate(startbilingdate.getDate() + 1); 
        endbilingdate.setHours(0, 0, 0, 0); 
        
        console.log('Start Billing Date (Today, local time):', startbilingdate.toLocaleString());
        console.log('End Billing Date (Next day, 12:00 AM local time):', endbilingdate.toLocaleString());
        
        const project = new ChatbotBuilder({
            name: name,
            planid: data.planid,
            userid: user._id,
            startdate: new Date(),
            projectstatus: "creating",
            billstatus: "pending",
            startbilingdate: startbilingdate,
            endbilingdate: endbilingdate,
            knowledgebase: [],
            dburl: `` // Default vector DB URL
        });
        
        console.log("Project object before save:", project);
        
        await project.save();
        
        console.log("Project saved successfully:", project._id);
        
        // Call deployment API for chatbot
        const createdep = await fetch(`${process.env.DEPLOYMENT_API}/createdeployment/chatbot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getcookie.get("token")?.value || '',
            },
            body: JSON.stringify({
                projectid: project._id,
                userid: user._id,
                name: name,
                env: data.env,
            })
        });
        
        const result = await createdep.json();
        console.log("Deployment API response:", result);
        
        if (result.success) {
            return NextResponse.json({
                message: "Chatbot Created & Deployment Started",
                success: true,
                project: project
            });
        } else {
            return NextResponse.json({
                message: `Chatbot creation failed: Reason - ${result.message}`,
                success: false,
                project: project
            }, { status: 500 });
        }

    } catch (err) {
        console.error("Error occurred while creating chatbot:", err);
        return NextResponse.json({
            message: "Error occurred while creating chatbot",
            error: err instanceof Error ? err.message : "Unknown error",
            success: false,
        }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
         const getcookie = await cookies();
        const data = await req.json();
        await ConnectDb();
        
        const auth = await CheckAuth();
        
        if (!auth.result) {
            return NextResponse.json({
                message: "User is not authenticated",
                success: false,
                autherror: true
            }, { status: 401 });
        }
        
        const projectdelete = await ChatbotBuilder.findOneAndDelete({ _id: data.id });
        console.log("Chatbot to delete:", projectdelete);
        
        if(projectdelete !== null && (projectdelete.arn !== null && projectdelete.arn !== undefined && projectdelete.arn !== "")) {
            console.log("Stopping ECS task with ARN:", projectdelete.arn);
            
            const createdep = await fetch(`${process.env.DEPLOYMENT_API}/deploy/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getcookie.get("token")?.value || '',
                },
                body: JSON.stringify({
                  task: projectdelete.arn
                })
            });
        
            const result = await createdep.json();
            console.log("Delete task result:", result);
        }
        
        if (projectdelete == null) {
            return NextResponse.json({
                success: false,
                message: "Chatbot not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            message: "Chatbot Deleted Successfully"
        });
        
    } catch (err) {
        console.error("Error deleting chatbot:", err);
        return NextResponse.json({
            success: false,
            message: "Something went wrong please try again later!"
        }, { status: 500 });
    }
}