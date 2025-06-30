import { DescribeTasksCommand } from "@aws-sdk/client-ecs";
import { EC2Client, DescribeNetworkInterfacesCommand } from "@aws-sdk/client-ec2";
import client from "../../client/client.js";

const Checkip = async (req, res) => {
    try {
        const { taskArn } = req.body;
        if (!taskArn) {
            return res.status(400).send({ error: "Task ARN is required" });
        }

        // Describe the ECS task
        const describeCmd = new DescribeTasksCommand({
            cluster: process.env.cluster,
            tasks: [taskArn],
        });

        let describeTaskData = await client.send(describeCmd);
        console.log("Task Data:", describeTaskData);

        // Ensure task exists
        const task = describeTaskData.tasks?.[0];
        if (!task) {
            return res.status(404).send({ error: "Task not found" });
        }

        // Log attachments to understand structure
        console.log("Task Attachments:", task.attachments);

        // Check if attachments exist and find ENI details
        const attachment = task.attachments?.find(att => att.details?.some(d => d.name === "networkInterfaceId"));
        if (!attachment) {
            return res.status(404).send({ error: "Network interface ID not found in task attachments" });
        }

        const eniDetails = attachment.details.find(detail => detail.name === "networkInterfaceId");
        const networkInterfaceId = eniDetails?.value;

        if (!networkInterfaceId) {
            return res.status(404).send({ error: "Network Interface ID is not available" });
        }

        console.log("Network Interface ID:", networkInterfaceId);

        // Describe the network interface
        const ec2Client = new EC2Client({ region: process.env.region });
        let retries = 3;
        let ec2Data;

        while (retries > 0) {
            try {
                const ec2Cmd = new DescribeNetworkInterfacesCommand({
                    NetworkInterfaceIds: [networkInterfaceId],
                });
                ec2Data = await ec2Client.send(ec2Cmd);
                break;
            } catch (error) {
                if (error.Code === "InvalidNetworkInterfaceID.NotFound") {
                    console.log(`Retrying... (${4 - retries}/3)`);
                    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before retrying
                    retries--;
                } else {
                    throw error;
                }
            }
        }

        if (!ec2Data) {
            return res.status(404).send({ error: "Network Interface not found" });
        }

        // Extract public IP
        const publicIp = ec2Data.NetworkInterfaces?.[0]?.Association?.PublicIp;
        if (!publicIp) {
            return res.status(404).send({ error: "No public IP assigned to network interface" });
        }

        console.log(`Public IP: ${publicIp}`);
        res.send({ url:publicIp, data:ec2Data ,success:true});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: error.message || "Internal Server Error" ,success:false});
    }
};

export { Checkip };
