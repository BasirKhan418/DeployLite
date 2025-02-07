import client from "../../client/client.js";
import  {StopTaskCommand} from "@aws-sdk/client-ecs";
const Delete=  async(req,res)=>{
    const {task,reason} = req.body;
    const input = { // StopTaskRequest
        cluster: process.env.cluster, // required
        task: task, // required
        reason: process.env.reason, // required
      };
      const command = new StopTaskCommand(input);
      const response = await client.send(command);
      return res.send(response);
}
export {Delete}