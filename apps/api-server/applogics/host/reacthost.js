import {RunTaskCommand} from "@aws-sdk/client-ecs"
import client from "../../client/client.js";
const reactHost = async(req,res)=>{
    //task config
    const config = {
        cluster:process.env.cluster,
        task:process.env.task,
    }
    //getting the giturl and projectid
        const {giturl,projectid} = req.body;
        console.log(giturl,projectid)
        const cmd = new RunTaskCommand({
            cluster:config.cluster,
            taskDefinition:config.task,
            launchType:"FARGATE",
            count:1,
            networkConfiguration:{
                awsvpcConfiguration:{
                    assignPublicIp:"ENABLED",
                    subnets:["subnet-079c7ec844809a1d9","subnet-01824b495ec29703a"],
                    securityGroups:["sg-0f5760f6bf8ba3a11"]
                }
            },
            overrides:{
                containerOverrides:[
                    {
                        name:process.env.taskreactname,
                        environment:[
                            {
                                name:"GIT_URL",
                                value:giturl
                            },
                            {
                                name:"projectid",
                                value:projectid
                            },{
                                name:"region",
                                value:process.env.region
                            },{
                                name:"accesskeyid",
                                value:process.env.accesskeyid
                            },{
                                name:"accesskeysecret",
                                value:process.env.accesskeysecret
                            },{
                                name:"bucket",
                                value:"deploylite"
                            }
                        ]
                    }
                ]
            }
        })
        try{
       const data = await client.send(cmd);
       console.log(data);
       return res.send(data);
       
        }
        catch(err){
            console.log(err);
            res.status(500).send("Something went wrong");
        }
}
export {reactHost}