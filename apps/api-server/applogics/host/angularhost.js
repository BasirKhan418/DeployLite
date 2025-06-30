import { RunTaskCommand } from "@aws-sdk/client-ecs";
import client from "../../client/client.js";
const angularHost = async (req, res) => {
  //task config
  let varablec = 1;
  console.log("react hosting started calling ", varablec++);
  const config = {
    cluster: process.env.cluster,
    task: process.env.task4,
  };
  //getting the giturl and projectid
  const { giturl, projectid, techused, installcommand,
    buildcommand,
    buildfolder,env } = req.body;

  console.log(giturl, projectid,env);
  const cmd = new RunTaskCommand({
    cluster: config.cluster,
    taskDefinition: config.task,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
          "subnet-0f778bd1773b9fecd", "subnet-00a124fa13c6797c9", "subnet-0581f546c68a5ad8d"
        ],
        securityGroups: ["sg-09cd52a2ed850a619"],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.taskangularname,
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
              name: "techused",
              value: techused,
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
              value: "deploylite.tech.prod",
            },
            {
              name: "installcommand",
              value: installcommand ,
            },
             {
              name: "buildcommand",
              value: buildcommand ,
            },
             {
              name: "buildfolder",
              value: buildfolder ,
            },
            {
              name: "env",
              value: env
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
      success: true,
      data: data,
      message: "Deployment started"
    })
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
export { angularHost };
