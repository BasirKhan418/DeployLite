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
  } = req.body;
  try {
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
        let depdata = await Deployment.findOneAndUpdate({
          projectid:projectid
        },{status:"started",deploymentdate:new Date(),commit_message:"Deployment Created By Deploylite",author_name:"DeployLite"})
        let updateproject = await Project.findOneAndUpdate({_id:projectid},{projecturl:`${projectname}.cloud.deploylite.tech`,memoryusage:0,cpuusage:0,storageusage:0})
        //start deployment for react
        console.log("react deployment started")
        const result = await fetch(`${process.env.DEPLOYMENT_API}/deploy/react`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            projectid:projectname,
            giturl:url
          }),
        })
        let data = await result.json();
        if(data.success){
        
          return res.status(201).json({
            success:true,
            message:"Deployment Started",
          })
        }
        else{
          return res.status(400).json({
            success:false,
            message:"Error occcured during deployment"
          })
        }
        
      } else if (techused == "Next.js" || techused == "Node.js") {
        //start deployment
      } else if (techused == "Angular") {
        //start deployment for angular
      } else if (techused == "Vue.js") {
        //start deployment for vue.js
      } else if (techused == "Flask") {
        //start deployment for flask
      } else if (techused == "Django") {
        //start deployment for django
      } else if (techused == "HTML,CSS,JS") {
        console.log("html css js deployment started")
        return res.status(201).json({
       success:true,message:"done html css deployment" })
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
        let project = await Project.deleteOne({_id:projectid})
        return res.status(400).json({
          message: "Invalid tech stack no deployments supported",
          success: false,
        });
      }
    } else {
      let project = await Project.deleteOne({_id:projectid})
      return res.status(401).json({
        message: "Webhook creation failed",
        success: false,
      });
    }
    //end of try block
  } catch (err) {
    console.log(err);
    let project = await Project.deleteOne({_id:projectid})
    return res.status(400).json({
      message: "Error in creating deployment",
      success: false,
    });
  }
};
export default CreateDeployment;
