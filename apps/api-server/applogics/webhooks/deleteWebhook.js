import { Octokit } from "octokit";

const deleteWebhook = async (req, res) => {
  //all the required parameters for creating
  let authtoken = req.body.token;
  let owner = req.body.owner;
  let repo = req.body.repo;
  let hook_id = req.body.hook_id;

  try {
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
      auth: authtoken,
    });

    let result = await octokit.request(
      "DELETE /repos/{owner}/{repo}/hooks/{hook_id}",
      {
        owner: owner,
        repo: repo,
        hook_id: hook_id,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    //returning the response`
    console.log(result);
    if (result.status == "204") {
      return res.status(200).json({
        message: "Webhook deleted successfully",
        success: true,
        data: result,
      });
    } else {
      return res.status(401).json({
        message: "Webhook deletion failed",
        success: false,
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "Error in deleting webhook",
      success: false,
    });
  }
};
export default deleteWebhook;
