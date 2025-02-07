import { Octokit } from "octokit";
import Project from "../../../models/Project.js";

const createWebhook = async (req, res) => {
  try {
    const { authtoken, owner, repo, projectname, projectid } = req.body;
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!authtoken || !owner || !repo || !projectname || !projectid || !webhookUrl) {
      return res.status(400).json({
        message: "Missing required parameters",
        success: false,
      });
    }

    console.log(
      "create webhook data is :- ",
      authtoken,
      owner,
      repo,
      projectname + "-webhook"
    );

    const octokit = new Octokit({
      auth: authtoken,
    });

    // First, get all existing webhooks
    const existingHooks = await octokit.request("GET /repos/{owner}/{repo}/hooks", {
      owner,
      repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    // Find if there's an existing webhook with the same URL
    const existingHook = existingHooks.data.find(
      (hook) => hook.config.url === webhookUrl
    );

    // If found, delete the existing webhook
    if (existingHook) {
      try {
        await octokit.request("DELETE /repos/{owner}/{repo}/hooks/{hook_id}", {
          owner,
          repo,
          hook_id: existingHook.id,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        console.log("Deleted existing webhook:", existingHook.id);
      } catch (deleteErr) {
        console.log("Error deleting existing webhook:", deleteErr);
        // Continue with creation even if deletion fails
      }
    }

    // Create new webhook
    const createResponse = await octokit.request("POST /repos/{owner}/{repo}/hooks", {
      owner,
      repo,
      name: "web", // Required by GitHub API
      active: true,
      events: ["push"],
      config: {
        url: webhookUrl,
        content_type: "json",
        insecure_ssl: "0",
        secret: process.env.WEBHOOK_SECRET, // Optional: Add a secret for increased security
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    // Handle webhook creation response
    if (createResponse.status === 201) {
      try {
        // Update project with new webhook ID
        await Project.findByIdAndUpdate(
          projectid,
          { 
            hookid: createResponse.data.id,
            webhook_url: webhookUrl 
          },
          { new: true }
        );

        return res.status(200).json({
          message: existingHook 
            ? "Webhook updated successfully" 
            : "Webhook created successfully",
          success: true,
          data: createResponse.data,
        });
      } catch (dbError) {
        // If database update fails, try to delete the webhook to maintain consistency
        try {
          await octokit.request("DELETE /repos/{owner}/{repo}/hooks/{hook_id}", {
            owner,
            repo,
            hook_id: createResponse.data.id,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          });
        } catch (deleteErr) {
          console.log("Error cleaning up webhook after DB failure:", deleteErr);
        }

        throw new Error("Failed to update project database");
      }
    } else {
      throw new Error("Webhook creation failed with status: " + createResponse.status);
    }

  } catch (err) {
    console.error("Webhook operation failed:", err);
    
    // Send a more detailed error response
    return res.status(500).json({
      message: "Webhook operation failed",
      error: err.message,
      success: false,
      details: err.response?.data || "No additional details available"
    });
  }
};

export default createWebhook;