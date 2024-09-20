import {DescribeTasksCommand} from "@aws-sdk/client-ecs"
import { EC2Client, DescribeNetworkInterfacesCommand} from '@aws-sdk/client-ec2';
import client from "../../client/client.js"
const Checkip = async(req,res)=>{
    const {taskArn} = req.body;
    const describeCmd = new DescribeTasksCommand({
        cluster: process.env.cluster,
        tasks: [taskArn],
      });
      let describeTaskData = await client.send(describeCmd);
      console.log(describeTaskData);
      const eniDetails = describeTaskData.tasks[0].attachments[0].details.find(detail => detail.name === 'networkInterfaceId');
      console.log(eniDetails);
    const networkInterfaceId = eniDetails.value;
    console.log(networkInterfaceId);

    // Use EC2 SDK to get the public IP address
    const ec2Client = new EC2Client({ region: process.env.region });
    const ec2Cmd = new DescribeNetworkInterfacesCommand({
      NetworkInterfaceIds: [networkInterfaceId],
    });
    const ec2Data = await ec2Client.send(ec2Cmd);
    console.log(ec2Data);
    const publicIp = ec2Data.NetworkInterfaces[0].Association.PublicIp;

    console.log(`Public IP: ${publicIp}`);
    res.send({ publicIp,ec2Data });
      
}
export {Checkip}