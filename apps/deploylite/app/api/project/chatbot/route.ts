import { NextResponse, NextRequest } from "next/server"
import ConnectDb from "../../../../../middleware/connectdb"
import CheckAuth from "@/actions/CheckAuth"
import Project from "../../../../../models/Project"
import User from "../../../../../models/User"
import { cookies } from "next/headers"
import VirtualSpace from "../../../../../models/VirtualSpace"
import WebBuilder from "../../../../../models/WebBuilder"
import ChatbotBuilder from "../../../../../models/ChatbotBuilder"

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
        
        const projectdata = await ChatbotBuilder.find({ userid: user._id }).populate("userid");
        
        if (!projectdata || projectdata.length === 0) {
            return NextResponse.json({
                success: true,
                projectdata: [],
                message: "No chatbot builder found."
            });
        }
        
        return NextResponse.json({
            success: true,
            projectdata: projectdata,
            message: "Successfully fetched"
        });
        
    } catch (err) {
        console.error("Error in GET /api/project/crud:", err);
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
        
        if (!auth.result) {
            return NextResponse.json({
                message: "User is not authenticated",
                success: false,
                autherror: true
            }, { status: 401 });
        }
        
        
        
        // Check project is unique or not
        const name = data.name.replace(/\s+/g, '').toLowerCase();
        console.log(name);
        
        const projectname = await Project.findOne({ name: name });
        const webbuilder = await WebBuilder.findOne({ name: name });
        const virtualspace = await VirtualSpace.findOne({ name: name });
        const chatbotbuilder = await ChatbotBuilder.findOne({ name: name });
        
        // If project name already exists
        if (projectname != null) {
            return NextResponse.json({
                message: "Project name already exists. Select a different name",
                success: false,
                projectname: "exists"
            }, { status: 409 });
        }
        // If webbuilder name already exists
        if (webbuilder != null) {
            return NextResponse.json({
                message: "WebBuilder name already exists. Select a different name",
                success: false,
                webbuildername: "exists"
            }, { status: 409 });
        }

        //check in virtual space
        if (virtualspace != null) {
            return NextResponse.json({
                message: "Virtual Space name already exists. Select a different name",
                success: false,
                virtualspacename: "exists"
            }, { status: 409 });
        }

        if(chatbotbuilder!=null){
            return NextResponse.json({
                message: "Chatbot Builder name already exists. Select a different name",
                success: false,
                chatbotbuildername: "exists"
            }, { status: 409 });
        }
        
        console.log(data.planid);
        
        console.log("checking user");
        const user = await User.findOne({ email: auth.email });
        console.log(user);
        
        if (user == null) {
            return NextResponse.json({
                message: "User not found",
                success: false,
                user: "notfound"
            }, { status: 404 });
        }

        //create database
const result1 = await fetch(`${process.env.DEPLOYMENT_API}/deploy/qdrant`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: getcookie.get("token")?.value || '',
            },
            body: JSON.stringify({
                dbname:"exampledb", // Replace with your database name
                dbuser:"examplepass", // Replace with your database password
                dbport: 6333, // Replace with your database port
                dbpass:"exampleuser", // Replace with your database user
               
                dbtype:"qdrant", // Replace with your database type
            }),
        });
        
        let data1 = await result1.json();

        if (data1.success) {
            console.log("Checking IP for webbuilder deployment");
            console.log("Task ARN:", data1.data.tasks[0].taskArn);
            
            // Check IP and update in the DB 
            const checkIpFunction = async () => {
                const result2 = await fetch(`${process.env.DEPLOYMENT_API}/deploy/checkip`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: getcookie.get("token")?.value || '',
                    },
                    body: JSON.stringify({
                        taskArn: data1.data.tasks[0].taskArn,
                    }),
                });
                let data2 = await result2.json();
                return data2;
            };

            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            await sleep(8000);
            console.log("Checking IP after 8 seconds");

            const data2 = await checkIpFunction();
            console.log("IP check response:", data2);
             if(data2.success){
                        console.log("creating project");
        
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
            dburl: `http://${data2.url}:6333` // Default vector DB URL
        });
        
        await project.save();
        //make an env

        const env = `
        OPENAI_API_KEY=${data.openaiapikey || ""}
        QDRANT_URL="http://${data2.url}:6333"
        QDRANT_COLLECTION_NAME_openai="unique_collection_openai"
        QDRANT_COLLECTION_NAME_google="unique_collection_google"
        GOOGLE_API_KEY=${data.googleapikey || ""}
        `
        //create a container for the project custom chatbot

         const createdep = await fetch(`${process.env.DEPLOYMENT_API}/createdeployment/chatbot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getcookie.get("token")?.value || '',
            },
            body: JSON.stringify({
                projectid: project._id,
                name:project.name,
                env: env,
            })
        });
        
        const result = await createdep.json();

        console.log(result);

        if(result.success) {
            return NextResponse.json({
                success: true,
                message: "Chatbot created successfully",
                project: project,
            }, { status: 201 });
        }
             }
             else{
                return NextResponse.json({
                    message: "Failed to create database",
                    success: false,
                    error: data2.message || "Unknown error"
                }, { status: 500 });
             }
            }

    } catch (err) {
        console.error("Error occurred while creating project:", err);
        return NextResponse.json({
            message: "Error occurred while creating project",
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
        
        const projectdelete = await Project.findOneAndDelete({ _id: data.id });
        console.log("Project to delete:", projectdelete);
        if(projectdelete !== null && projectdelete.arn !== null || projectdelete.arn !== undefined|| projectdelete.arn !== ""){ {
            console.log("inside ")
        console.log("Project not found or ARN is missing",projectdelete.arn);
         const createdep = await fetch(`${process.env.DEPLOYMENT_API}/deploy/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getcookie.get("token")?.value || '',
            },
            body: JSON.stringify({
              task:projectdelete.arn
            })
        });
    
        
        const result = await createdep.json();
        console.log(result);
          return NextResponse.json({
            success: true,
            message: "Project Deleted Successfully"
        });
    }
        if (projectdelete == null) {
            return NextResponse.json({
                success: false,
                message: "Project not found"
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            message: "Project Deleted Successfully"
        });
    }
        
    } catch (err) {
        console.error("Error deleting project:", err);
        return NextResponse.json({
            success: false,
            message: "Something went wrong please try again later!"
        }, { status: 500 });
    }
}