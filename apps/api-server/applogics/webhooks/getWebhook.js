import axios from 'axios';

const getWebhook = async (req, res) => {
  try {
    // Validate GitHub event header
    const githubEvent = req.headers['x-github-event'];
    if (!githubEvent) {
      console.error('Missing X-GitHub-Event header');
      return res.status(400).json({
        success: false,
        message: 'Missing GitHub event header'
      });
    }

    // Validate payload
    const payload = req.body;
    if (!payload || !payload.repository) {
      console.error('Invalid webhook payload structure');
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook payload'
      });
    }

    // Extract relevant information with optional chaining
    const repoInfo = {
      name: payload.repository?.name,
      cloneUrl: payload.repository?.clone_url,
      committer: payload.head_commit?.committer?.name || 'Unknown',
      commitMessage: payload.head_commit?.message || 'No message provided'
    };

    // Structured logging
    console.log({
      event: 'GitHub Webhook Received',
      type: githubEvent,
      repository: {
        name: repoInfo.name,
        cloneUrl: repoInfo.cloneUrl
      },
      commit: {
        author: repoInfo.committer,
        message: repoInfo.commitMessage
      },
      timestamp: new Date().toISOString()
    });
    let reep = await axios.post('https://api.deploylite.tech/rebuild',{
            repourl:repoInfo.cloneUrl,
    });
    if(reep.data.success==true){
        return res.status(200).json({message:"Project rebuild initiated successfully",success:true});
    }

    // TODO: Add queue system implementation here
    // await queueDeployment(repoInfo);

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        event: githubEvent,
        repository: repoInfo.name
      }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error processing webhook',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default getWebhook;