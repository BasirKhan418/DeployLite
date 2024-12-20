import { RunTaskCommand } from "@aws-sdk/client-ecs";
import client from "../../client/client.js";
const reactHost = async (req, res) => {
  //task config
  const config = {
    cluster: process.env.cluster,
    task: process.env.task,
  };
  //getting the giturl and projectid
  const { giturl, projectid } = req.body;
  console.log(giturl, projectid);
  const cmd = new RunTaskCommand({
    cluster: config.cluster,
    taskDefinition: config.task,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
          "subnet-08c0e70481d5f14fa",
          "subnet-04b5c228a84266b20",
          "subnet-0ac2e02dba43e81b3",
        ],
        securityGroups: ["sg-0e51ea82b7b88c82c"],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.taskreactname,
          environment: [
            {
              name: "GIT_URL",
              value: giturl,
            },
            {
              name: "projectid",
              value: projectid,
            },
            {
              name: "region",
              value: process.env.region,
            },
            {
              name: "accesskeyid",
              value: process.env.accesskeyid,
            },
            {
              name: "accesskeysecret",
              value: process.env.accesskeysecret,
            },
            {
              name: "bucket",
              value: "deploylitedev",
            },
          ],
        },
      ],
    },
  });
  try {
    const data = await client.send(cmd);
    console.log(data);
    return res.status(200).json({
      success:true,
      data:data,
      message:"Deployment started"
    })
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
export { reactHost };
