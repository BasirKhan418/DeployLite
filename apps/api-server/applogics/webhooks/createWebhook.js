import { Octokit } from "octokit";
import Project from "../../../models/Project.js";

const createWebhook = async (req, res) => {
  try {
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    //all the required parameters for creating
    let authtoken = req.body.authtoken;
    let owner = req.body.owner;
    let repo = req.body.repo;
    let projectname = req.body.projectname + "-webhook";
    let projectid = req.body.projectid;
    //creating a new instance of octokit
    console.log(
      "create web hook data is :- ",
      authtoken,
      owner,
      repo,
      projectname
    );
    const octokit = new Octokit({
      auth: authtoken,
    });
    //creating a webhook
    let data = await octokit.request("POST /repos/{owner}/{repo}/hooks", {
      owner: owner,
      repo: repo,
      active: true,
      events: ["push"],
      config: {
        url: process.env.WEBHOOK_URL,
        content_type: "json",
        insecure_ssl: "0",
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    //returning the response`
    //update the hookid
    if (data.status == "201") {
      //saving the webhook details in the database
      let update = await Project.updateOne(
        { _id: projectid },
        { hookid: data.data.id }
      );
      return res.status(200).json({
        message: "Webhook created successfully",
        success: true,
        data: data,
      });
    } else {
      return res.status(401).json({
        message: "Webhook creation failed",
        success: false,
      });
    }
    //end of the function
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Webhook creation failed",
      error: err,
      success: false,
    });
  }
};
export default createWebhook;
