import Deployment from "../../../models/Deployment.js"
import Project from "../../../models/Project.js";
import WebBuilder from "../../../models/WebBuilder.js";
import ioredis from "ioredis";

const CreateWebbuilder = async (req, res) => {
    const redisConfig = {
        host: 'valkey-1dec9a5f-basirkhanaws-5861.c.aivencloud.com',
        port: 24291,
        username: 'default',
        password: 'AVNS__TnY6dEjpphUtR6tTl4',
        tls: {}
    };
    const redisClient = new ioredis(redisConfig);
    
    // analyze all the deployments strategies here and call the respective deployment strategy
    // creating a webhook
    console.log(req.body);
    console.log("hitting the server for webbuilder deployment creation");
    let token = req.headers.authorization;
    
    const {
        projectid,
        userid,
        name: projectname,
        dbname,
        dbuser,
        dbpass,
    } = req.body;
    
    try {
        console.log("Creating webbuilder deployment for:", projectname);
        console.log("Database config:", { dbname, dbuser, dbpass: "***" });
        
        // Update webbuilder project status
        let updateproject = await WebBuilder.findOneAndUpdate(
            { _id: projectid }, 
            { 
                projecturl: `${projectname}.host.deploylite.tech`, 
                memoryusage: 0, 
                cpuusage: 0, 
                storageusage: 0,
                projectstatus: "deploying"
            }
        );
        
        if (!updateproject) {
            console.error("WebBuilder project not found:", projectid);
            return res.status(404).json({
                success: false,
                message: "WebBuilder project not found"
            });
        }
        
        console.log("Updated project:", updateproject.name);
        
        // Call deployment API for webbuilder (WordPress container)
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/webbuilder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                projectid: projectname,
                dbname: dbname,
                dbuser: dbuser,
                dbpass: dbpass,
            }),
        });
        
        let data = await result.json();
        console.log("Webbuilder deployment response:", data);
        
        if (data.success) {
            console.log("Checking IP for webbuilder deployment");
            console.log("Task ARN:", data.data.tasks[0].taskArn);
            
            // Check IP and update in the DB 
            const checkIpFunction = async () => {
                const result2 = await fetch(`${process.env.DEPLOYMENT_API}/deploy/checkip`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify({
                        taskArn: data.data.tasks[0].taskArn,
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

            if (data2.success) {
                // Update the webbuilder project with the URL and ARN
                let updateproject = await WebBuilder.findOneAndUpdate(
                    { _id: projectid }, 
                    { 
                        url: data2.url,
                        arn: data.data.tasks[0].taskArn,
                        projectstatus: "live"
                    }
                );
                
                // Set Redis cache for the project URL
                await redisClient.set(`${projectname}`, data2.url);
                
                console.log("WebBuilder deployment completed successfully");
                return res.status(201).json({
                    success: true,
                    message: "WebBuilder Deployment Started Successfully",
                    data: {
                        projectUrl: `https://${projectname}.host.deploylite.tech`,
                        publicIp: data2.url,
                        taskArn: data.data.tasks[0].taskArn
                    }
                });
            } else {
                console.log("Error in getting IP for webbuilder");
                console.log(data2);
                
                // Update project status to failed
                await WebBuilder.findOneAndUpdate(
                    { _id: projectid }, 
                    { projectstatus: "failed" }
                );
                
                return res.status(400).json({
                    success: false,
                    message: "Error occurred during webbuilder deployment phase 2 (IP assignment)"
                });
            }
        } else {
            console.log("Error in webbuilder deployment");
            console.log(data);
            
            // Update project status to failed
            await WebBuilder.findOneAndUpdate(
                { _id: projectid }, 
                { projectstatus: "failed" }
            );
            
            return res.status(400).json({
                success: false,
                message: "Error occurred during webbuilder deployment"
            });
        }
        
    } catch (err) {
        console.log("Error in webbuilder deployment:", err);
        
        // Update project status to failed
        try {
            await WebBuilder.findOneAndUpdate(
                { _id: projectid }, 
                { projectstatus: "failed" }
            );
        } catch (updateError) {
            console.log("Error updating project status:", updateError);
        }
        
        return res.status(500).json({
            message: "Error in creating webbuilder deployment",
            success: false,
            error: err.message
        });
    }
};

export default CreateWebbuilder;