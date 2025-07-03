
import Deployment from "../../../models/Deployment.js"
import Project from "../../../models/Project.js";
const CreateDeployment = async (req, res) => {
  //analyze all the deployments startegies here and call the respective deployment strategy
  //creating a webhook
  console.log(req.body);
  console.log("hitting the server for deployment creation");
  let token = req.headers.authorization;
  const {
    projectid,
    userid,
    repourl,
    repobranch,
    techused,
    buildcommand,
    startcommand,
    rootfolder,
    outputfolder,
    installcommand,
    name: projectname,
    authtoken,
    env,
  } = req.body;
  try {
    console.log("env is ",env)
    const url = repourl.split("/");
    const owner = url[url.length - 2].toLowerCase();
    const oldrepo = url[url.length - 1];
    const repo = oldrepo.split(".")[0].toLowerCase();
    console.log(owner, repo);
    console.log(projectname);

    const createwebhook = await fetch(
      `${process.env.DEPLOYMENT_API}/webhook/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          authtoken,
          owner,
          repo,
          projectname,
          projectid,
        }),
      }
    );
    const webhookdata = await createwebhook.json();
    if (webhookdata.success) {
      const oldurl = repourl.split("/");
      const owner = oldurl[oldurl.length - 2];
      const oldrepo = oldurl[oldurl.length - 1];
      const url = `https://${authtoken}@github.com/${owner}/${oldrepo}`
      console.log(url);

      //analyze all the deployments startegies here and call the respective deployment strategy
      if (techused == "React" || techused == "Vite") {
        console.log("react deployment started");
        let depdata = await Deployment.findOneAndUpdate({
          projectid: projectid
        }, { status: "started", deploymentdate: new Date(), commit_message: "Deployment Created By Deploylite", author_name: "DeployLite" })
        let updateproject = await Project.findOneAndUpdate({ _id: projectid }, { projecturl: `${projectname}.cloud.deploylite.tech`, memoryusage: 0, cpuusage: 0, storageusage: 0 })
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/react`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            projectid: projectname,
            giturl: url,
            techused: techused,
            installcommand: installcommand,
            buildcommand: buildcommand,
            buildfolder: outputfolder,
            env: env || "",
          }),
        })
        console.log("tech used is ", techused);
        let data = await result.json();
        if (data.success) {

          return res.status(201).json({
            success: true,
            message: "Deployment Started",
          })
        }
        else {
          return res.status(400).json({
            success: false,
            message: "Error occcured during deployment"
          })
        }

      } else if (techused == "Next.js" || techused == "Node.js") {
        let depdata = await Deployment.findOneAndUpdate({
          projectid: projectid
        }, { status: "started", deploymentdate: new Date(), commit_message: "Deployment Created By Deploylite", author_name: "DeployLite" })
        let updateproject = await Project.findOneAndUpdate({ _id: projectid }, { projecturl: `${projectname}.host.deploylite.tech`, memoryusage: 0, cpuusage: 0, storageusage: 0 })
        //start deployment for react
        console.log("nextjs deployment started")
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/fullstack`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            projectid: projectname,
            giturl: url,
            techused: techused,
            installcommand: installcommand,
            buildcommand: buildcommand,
            buildfolder: outputfolder,
            env: env || "",
            runcommand: startcommand || "npm run start",
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
            let updateproject = await Project.findOneAndUpdate({ _id: projectid }, { url: data2.url ,arn: data.data.tasks[0].taskArn});
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
      } else if (techused == "Angular") {
        console.log("angular deployment started");
        let depdata = await Deployment.findOneAndUpdate({
          projectid: projectid
        }, { status: "started", deploymentdate: new Date(), commit_message: "Deployment Created By Deploylite", author_name: "DeployLite" })
        let updateproject = await Project.findOneAndUpdate({ _id: projectid }, { projecturl: `${projectname}.cloud.deploylite.tech`, memoryusage: 0, cpuusage: 0, storageusage: 0 })
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/angular`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            projectid: projectname,
            giturl: url,
            techused: techused,
            installcommand: installcommand,
            buildcommand: buildcommand,
            buildfolder: outputfolder,
            env: env || "",
          }),
        })
        console.log("tech used is ", techused);
        let data = await result.json();
        if (data.success) {

          return res.status(201).json({
            success: true,
            message: "Deployment Started",
          })
        }
        else {
          return res.status(400).json({
            success: false,
            message: "Error occcured during deployment"
          })
        }
      } else if (techused == "Vue.js") {
            console.log("vue.js deployment started");
        let depdata = await Deployment.findOneAndUpdate({
          projectid: projectid
        }, { status: "started", deploymentdate: new Date(), commit_message: "Deployment Created By Deploylite", author_name: "DeployLite" })
        let updateproject = await Project.findOneAndUpdate({ _id: projectid }, { projecturl: `${projectname}.cloud.deploylite.tech`, memoryusage: 0, cpuusage: 0, storageusage: 0 })
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/react`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            projectid: projectname,
            giturl: url,
            techused: techused,
            installcommand: installcommand,
            buildcommand: buildcommand,
            buildfolder: outputfolder,
            env: env || "",
          }),
        })
        console.log("tech used is ", techused);
        let data = await result.json();
        if (data.success) {

          return res.status(201).json({
            success: true,
            message: "Deployment Started",
          })
        }
        else {
          return res.status(400).json({
            success: false,
            message: "Error occcured during deployment"
          })
        }
      } else if (techused == "Flask") {
        //start deployment for flask
      } else if (techused == "Django") {
        //start deployment for django
      } else if (techused == "HTML,CSS,JS") {
      console.log("frontend deployment started");
        let depdata = await Deployment.findOneAndUpdate({
          projectid: projectid
        }, { status: "started", deploymentdate: new Date(), commit_message: "Deployment Created By Deploylite", author_name: "DeployLite" })
        let updateproject = await Project.findOneAndUpdate({ _id: projectid }, { projecturl: `${projectname}.cloud.deploylite.tech`, memoryusage: 0, cpuusage: 0, storageusage: 0 })
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/frontend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            projectid: projectname,
            giturl: url,
            techused: techused,
          }),
        })
        console.log("tech used is ", techused);
        let data = await result.json();
        if (data.success) {

          return res.status(201).json({
            success: true,
            message: "Deployment Started",
          })
        }
        else {
          return res.status(400).json({
            success: false,
            message: "Error occcured during deployment"
          })
        }
        //START DEPLOYMENT FROM HERE
      } else if (techused == "Springboot") {
        //start deployment for springboot
      } else if (techused == "Serverlet") {
        //start deployment from here
      } else if (techused == "Nuxt.js") {
        //start deployment from here
      } else if (techused == "PHP") {
        //start deployment from here
      } else {
        let project = await Project.deleteOne({ _id: projectid })
        return res.status(400).json({
          message: "Invalid tech stack no deployments supported",
          success: false,
        });
      }
    } else {
      let project = await Project.deleteOne({ _id: projectid })
      return res.status(401).json({
        message: "Webhook creation failed",
        success: false,
      });
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
export default CreateDeployment;
