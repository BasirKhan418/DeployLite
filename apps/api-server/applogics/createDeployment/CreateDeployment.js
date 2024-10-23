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
      //analyze all the deployments startegies here and call the respective deployment strategy
      if (techused == "React" || techused == "Vite") {
        //start deployment for react
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
        return res.status(400).json({
          message: "Invalid tech stack no deployments supported",
          success: false,
        });
      }
    } else {
      return res.status(401).json({
        message: "Webhook creation failed",
        success: false,
      });
    }
    //end of try block
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Error in creating deployment",
      success: false,
    });
  }
};
export default CreateDeployment;
