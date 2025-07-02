import VirtualSpace from "../../../models/VirtualSpace.js";
import ioredis from "ioredis";

const CreateVirtualSpace = async (req, res) => {
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
    console.log("hitting the server for virtual space deployment creation");
    let token = req.headers.authorization;
    
    const {
        projectid,
        userid,
        passwd,
        name: projectname,
    } = req.body;
    
    try {
        console.log("Creating virtual space deployment for:", projectname);
        console.log("Virtual space config:", { projectname, passwd: "***" });
        
        let updateproject = await VirtualSpace.findOneAndUpdate(
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
            console.error("Virtual space project not found:", projectid);
            return res.status(404).json({
                success: false,
                message: "Virtual space project not found"
            });
        }
        
        console.log("Updated project:", updateproject.name);
        
        // Call deployment API for virtual space (containerized development environment)
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/virtualspace`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                projectid: projectname,
                passwd: passwd,
            }),
        });
        
        let data = await result.json();
        console.log("Virtual space deployment response:", data);
        
        if (data.success) {
            console.log("Checking IP for virtual space deployment");
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
                // Update the virtual space project with the URL and ARN
                let updateproject = await VirtualSpace.findOneAndUpdate(
                    { _id: projectid }, 
                    { 
                        url: data2.url,
                        arn: data.data.tasks[0].taskArn,
                        projectstatus: "live"
                    }
                );
                
                // Set Redis cache for the project URL
                await redisClient.set(`${projectname}`, data2.url);
                
                console.log("Virtual Space deployment completed successfully");
                return res.status(201).json({
                    success: true,
                    message: "Virtual Space Deployment Started Successfully",
                    data: {
                        projectUrl: `https://${projectname}.host.deploylite.tech`,
                        publicIp: data2.url,
                        taskArn: data.data.tasks[0].taskArn
                    }
                });
            } else {
                console.log("Error in getting IP for virtual space");
                console.log(data2);
                
                // Update project status to failed
                await VirtualSpace.findOneAndUpdate(
                    { _id: projectid }, 
                    { projectstatus: "failed" }
                );
                
                return res.status(400).json({
                    success: false,
                    message: "Error occurred during virtual space deployment phase 2 (IP assignment)"
                });
            }
        } else {
            console.log("Error in virtual space deployment");
            console.log(data);
            
            // Update project status to failed
            await VirtualSpace.findOneAndUpdate(
                { _id: projectid }, 
                { projectstatus: "failed" }
            );
            
            return res.status(400).json({
                success: false,
                message: "Error occurred during virtual space deployment"
            });
        }
        
    } catch (err) {
        console.log("Error in virtual space deployment:", err);
        
        // Update project status to failed
        try {
            await VirtualSpace.findOneAndUpdate(
                { _id: projectid }, 
                { projectstatus: "failed" }
            );
        } catch (updateError) {
            console.log("Error updating project status:", updateError);
        }
        
        return res.status(500).json({
            message: "Error in creating virtual space deployment",
            success: false,
            error: err.message
        });
    }
};

export default CreateVirtualSpace;