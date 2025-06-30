import client from "../../client/client.js";
import  {StopTaskCommand} from "@aws-sdk/client-ecs";
const Delete=  async(req,res)=>{
    const {task} = req.body;
    console.log("task to delete",task);
    try{
    const input = { // StopTaskRequest
        cluster: process.env.cluster, // required
        task: task, // required
        reason: process.env.reason, // required
      };
      const command = new StopTaskCommand(input);
      const response = await client.send(command);
      return res.send({success:true,message:"Task stopped successfully",data:response});
    }
    catch(err){
        console.error("Error stopping task:", err);
        return res.status(500).send({error: "Failed to stop task", details: err.message,success:false});
    }

}
export {Delete}