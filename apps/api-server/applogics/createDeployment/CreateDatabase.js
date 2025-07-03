import Database from "../../../models/Database.js";


const CreateDatabase = async (req, res) => {
    
    
    // analyze all the deployments strategies here and call the respective deployment strategy
    // creating a webhook
    console.log(req.body);
    console.log("hitting the server for database deployment creation");
    let token = req.headers.authorization;
    
    const {
           projectid,
            userid,
            dbname,
            dbuser,
            dbpass,
            dbport,
            dbtype,
    } = req.body;
    
    try {
        console.log("Database deployment started on api-server")
        //mysql flow deployment
        if(dbtype=="mysql"){

            //mysql started from here
// Update webbuilder project status
        let updateproject = await Database.findOneAndUpdate(
            { _id: projectid }, 
            {  
                memoryusage: 0, 
                cpuusage: 0, 
                storageusage: 0,
                projectstatus: "creating"
            }
        );
        
        if (!updateproject) {
            console.error("Database was not found:", projectid);
            return res.status(404).json({
                success: false,
                message: "Database not found"
            });
        }
        
        
        
        // Call deployment API for webbuilder (WordPress container)
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/mysql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                dbname,
                dbuser,
                dbpass,
                dbport,
                dbtype,   
            }),
        });
        
        let data = await result.json();
        console.log("Database deployment response:", data);
        
        if (data.success) {
            console.log("Checking IP for database deployment");
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
                let updateproject = await Database.findOneAndUpdate(
                    { _id: projectid }, 
                    { 
                        url: data2.url,
                        arn: data.data.tasks[0].taskArn,
                        projecturl:`mysql://${dbuser}:${dbpass}@${data2.url}:3306/${dbname}`,
                        projectstatus: "live"
                    }
                );
                
                console.log("Database deployment completed successfully");
                return res.status(201).json({
                    success: true,
                    message: "Database Deployment Started Successfully",
                    data: {
                        projecturl:`mysql://${dbuser}:${dbpass}@${data2.url}:3306/${dbname}`,
                        publicIp: data2.url,
                        taskArn: data.data.tasks[0].taskArn
                    }
                });
            } else {
                console.log("Error in getting IP for database");
                console.log(data2);
                
                // Update project status to failed
                await Database.findOneAndUpdate(
                    { _id: projectid }, 
                    { projectstatus: "failed" }
                );
                
                return res.status(400).json({
                    success: false,
                    message: "Error occurred during database deployment phase 2 (IP assignment)"
                });
            }
        } else {
            console.log("Error in database deployment");
            console.log(data);
            
            // Update project status to failed
            await Database.findOneAndUpdate(
                { _id: projectid }, 
                { projectstatus: "failed" }
            );
            
            return res.status(400).json({
                success: false,
                message: "Error occurred during database deployment"
            });
        }


            //end here

        }
        //postgresql flow deployment
        else if(dbtype=="postgresql"){

        }
        //mongodb flow deployment
        else if(dbtype=="mongodb"){
            let updateproject = await Database.findOneAndUpdate(
            { _id: projectid }, 
            {  
                memoryusage: 0, 
                cpuusage: 0, 
                storageusage: 0,
                projectstatus: "creating"
            }
        );
        
        if (!updateproject) {
            console.error("Database was not found:", projectid);
            return res.status(404).json({
                success: false,
                message: "Database not found"
            });
        }
        
        
        
        // Call deployment API for webbuilder (WordPress container)
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/mongodb`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
               
                dbname,
                dbuser,
                dbpass,
                dbport,
                dbtype,   
            }),
        });
        
        let data = await result.json();
        console.log("Database deployment response:", data);
        
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
                let updateproject = await Database.findOneAndUpdate(
                    { _id: projectid }, 
                    { 
                        url: data2.url,
                        arn: data.data.tasks[0].taskArn,
                        projecturl:`mongodb://${dbuser}:${dbpass}@${data2.url}:27017/${dbname}`,
                        projectstatus: "live"
                    }
                );
                
                console.log("Database deployment completed successfully");
                return res.status(201).json({
                    success: true,
                    message: "Database Deployment Started Successfully",
                    data: {
                        projectUrl: `mongodb://${dbuser}:${dbpass}@${data2.url}:27017/${dbname}`,
                        publicIp: data2.url,
                        taskArn: data.data.tasks[0].taskArn
                    }
                });
            } else {
                console.log("Error in getting IP for database");
                console.log(data2);
                
                // Update project status to failed
                await Database.findOneAndUpdate(
                    { _id: projectid }, 
                    { projectstatus: "failed" }
                );
                
                return res.status(400).json({
                    success: false,
                    message: "Error occurred during database deployment phase 2 (IP assignment)"
                });
            }
        } else {
            console.log("Error in databse deployment");
            console.log(data);
            
            // Update project status to failed
            await Database.findOneAndUpdate(
                { _id: projectid }, 
                { projectstatus: "failed" }
            );
            
            return res.status(400).json({
                success: false,
                message: "Error occurred during webbuilder deployment"
            });
        }

        }
        //redis flow deployment
        else if(dbtype=="redis"){
            
                 let updateproject = await Database.findOneAndUpdate(
            { _id: projectid }, 
            {  
                memoryusage: 0, 
                cpuusage: 0, 
                storageusage: 0,
                projectstatus: "creating"
            }
        );
        
        if (!updateproject) {
            console.error("Database was not found:", projectid);
            return res.status(404).json({
                success: false,
                message: "Database not found"
            });
        }
        
       
        
        // Call deployment API for webbuilder (WordPress container)
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/redis`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                dbname,
                dbuser,
                dbpass,
                dbport,
                dbtype,   
            }),
        });
        
        let data = await result.json();
        console.log("Database deployment response:", data);
        
        if (data.success) {
            console.log("Checking IP for database deployment");
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
                let updateproject = await Database.findOneAndUpdate(
                    { _id: projectid }, 
                    { 
                        url: data2.url,
                        arn: data.data.tasks[0].taskArn,
                        projecturl:`redis://:${dbpass}@${data2.url}:6379`,
                        projectstatus: "live",
                        uiurl: `http://${data2.url}:8081`
                    }
                );
                
                console.log("Database deployment completed successfully");
                return res.status(201).json({
                    success: true,
                    message: "Database Deployment Started Successfully",
                    data: {
                        projectUrl: `redis://:${dbpass}@${data2.url}:6379`,
                        publicIp: data2.url,
                        taskArn: data.data.tasks[0].taskArn
                    }
                });
            } else {
                console.log("Error in getting IP for databse ");
                console.log(data2);
                
                // Update project status to failed
                await Database.findOneAndUpdate(
                    { _id: projectid }, 
                    { projectstatus: "failed" }
                );
                
                return res.status(400).json({
                    success: false,
                    message: "Error occurred during databasedeployment phase 2 (IP assignment)"
                });
            }
        } else {
            console.log("Error in databse deployment");
            console.log(data);
            
            // Update project status to failed
            await Database.findOneAndUpdate(
                { _id: projectid }, 
                { projectstatus: "failed" }
            );
            
            return res.status(400).json({
                success: false,
                message: "Error occurred during databse deployment"
            });
        }

        }
        //qdrant flow deployment
        else if(dbtype=="qdrant"){

                       let updateproject = await Database.findOneAndUpdate(
            { _id: projectid }, 
            {  
                memoryusage: 0, 
                cpuusage: 0, 
                storageusage: 0,
                projectstatus: "creating"
            }
        );
        
        if (!updateproject) {
            console.error("Database was not found:", projectid);
            return res.status(404).json({
                success: false,
                message: "Database not found"
            });
        }
        
        
        
        // Call deployment API for webbuilder (WordPress container)
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/qdrant`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                dbname,
                dbuser,
                dbpass,
                dbport,
                dbtype,   
            }),
        });
        
        let data = await result.json();
        console.log("Database deployment response:", data);
        
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
                let updateproject = await Database.findOneAndUpdate(
                    { _id: projectid }, 
                    { 
                        url: data2.url,
                        arn: data.data.tasks[0].taskArn,
                        projecturl:`https://${data2.url}:6333`,
                        projectstatus: "live",
                        uiurl: `http://${data2.url}:6333/dashboard`
                    }
                );
                
                console.log("Database deployment completed successfully");
                return res.status(201).json({
                    success: true,
                    message: "Database Deployment Started Successfully",
                    data: {
                        projecturl:`https://${data2.url}:6333`,
                        publicIp: data2.url,
                        taskArn: data.data.tasks[0].taskArn
                    }
                });
            } else {
                console.log("Error in getting IP for webbuilder");
                console.log(data2);
                
                // Update project status to failed
                await Database.findOneAndUpdate(
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
            await Database.findOneAndUpdate(
                { _id: projectid }, 
                { projectstatus: "failed" }
            );
            
            return res.status(400).json({
                success: false,
                message: "Error occurred during webbuilder deployment"
            });
        }

        }
        else{
            return res.status(400).json({
                success: false,
                message: "Invalid database type"
            });
        }
        
        
        
    } catch (err) {
        console.log("Error in webbuilder deployment:", err);
        
        // Update project status to failed
        try {
            await Database.findOneAndUpdate(
                { _id: projectid }, 
                { projectstatus: "failed" }
            );
        } catch (updateError) {
            console.log("Error updating project status:", updateError);
        }
        
        return res.status(500).json({
            message: "Error in creating database deployment",
            success: false,
            error: err.message
        });
    }
};

export default CreateDatabase;