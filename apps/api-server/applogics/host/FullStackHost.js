import { RunTaskCommand } from "@aws-sdk/client-ecs";
import client from "../../client/client.js";
const FullStackHost = async (req, res) => {
  //task config
  const config = {
    cluster: process.env.cluster,
    task: process.env.task2,
  };
  //getting the giturl and projectid
  const { giturl, projectid, techused, installcommand,
    buildcommand,
    runcommand,
    env } = req.body;

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
          name: process.env.taskfullstackname,
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
              name: "installcommand",
              value: installcommand,
            },
            ,
            {
              name: "buildcommand",
              value: buildcommand,
            },
            ,
            {
              name: "env",
              value: env || "",
            },
            {
              name: "runcommand",
              value: runcommand || "npm run start",
            },
          ],
        },
      ],
    },
  });
  try {
    const data = await client.send(cmd);
    console.log(data);
    return res.send({ success: true, message: "Hosting started successfully", data: data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: "Error starting hosting", error: err.message });
  }
};
export { FullStackHost };
