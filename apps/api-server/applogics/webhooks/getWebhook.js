const getWebhook = async (req, res) => {
  console.log("web hook k is running");
  const event = req.headers["x-github-event"];
  const payload = req.body;
  console.log(event);
  console.log(".....before payload.....");
  console.log("Normal URL:- ", payload.repository.html_url);
  console.log("GIT URL:- ", payload.repository.clone_url);
  console.log("COMMIT MESSAGE IS :- ", payload.head_commit.message);
  console.log("COMMIT AUTHOR IS :- ", payload.head_commit.committer.name);
  console.log(
    "COMMIT AUTHOR EMAIL IS :- ",
    payload.head_commit.committer.email
  );
  console.log(".....after payload.....");

  //add queue system push all deployments into a queueu and then run them one by one
  return res.status(200).json({
    message: "Webhook received",
    success: true,
  });
};
export default getWebhook;
