
import Deployment from "../../../models/Deployment.js"
import Project from "../../../models/Project.js";
import Webbuilder from "../../../models/Webbuilder.js";
import ioredis from "ioredis";
const CreateWebbuilder = async (req, res) => {
    const redisConfig = {
    host: 'valkey-1dec9a5f-basirkhanaws-5861.c.aivencloud.com',
    port: 24291,
    username: 'default',
    password: 'AVNS__TnY6dEjpphUtR6tTl4',
    tls: {}
};
    const redisClient = new ioredis(redisConfig);
  //analyze all the deployments startegies here and call the respective deployment strategy
  //creating a webhook
  console.log(req.body);
  console.log("hitting the server for deployment creation");
  let token = req.headers.authorization;
  const {
    projectid,
    userid,
    name: projectname,
    dbname,
    dbuser,
    dbpass,
  } = req.body;
  try {
   
        let updateproject = await Webbuilder.findOneAndUpdate({ _id: projectid }, { projecturl: `${projectname}.host.deploylite.tech`, memoryusage: 0, cpuusage: 0, storageusage: 0 })
        
        
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/webbuilder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            projectid: projectname,
            dbname: dbname,
            dbuser: dbuser,
            dbpass: dbpass,
          }),
        })
        let data = await result.json();

        console.log("data is ", data)
        if (data.success) {
          console.log("checking ip ");
          console.log(data.data.tasks[0].taskArn)
          //check ip and update in the db 
          const new_func = async () => {
            const result2 = await fetch(`${process.env.DEPLOYMENT_API}/deploy/checkip`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify({
                taskArn: data.data.tasks[0].taskArn,
              }),
            })
            let data2 = await result2.json();
            return data2;
          }

          const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

          await sleep(8000);
          console.log("checking ip after 5 seconds");

          const data2 = await new_func();
          console.log("data2 is ", data2);

          if (data2.success) {
            //update the project with the url
            let updateproject = await Webbuilder.findOneAndUpdate({ _id: projectid }, { url: data2.url ,arn: data.data.tasks[0].taskArn});
            await redisClient.set(`${projectname}`, data2.url);
            return res.status(201).json({
              success: true,
              message: "Deployment Started",
            })
          }
          else {
            console.log("error in getting ip")
            console.log(data2)
            return res.status(400).json({
              success: false,
              message: "Error occcured during deployment phase 2"
            })
          }

        }
        else {
          return res.status(400).json({
            success: false,
            message: "Error occcured during deployment"
          })
        }
      
    //end of try block
  } catch (err) {
    console.log(err);
    let project = await Project.deleteOne({ _id: projectid })
    return res.status(400).json({
      message: "Error in creating deployment",
      success: false,
    });
  }
};
export default CreateWebbuilder;
