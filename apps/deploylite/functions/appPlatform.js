const appplatform = async (name, env, value) => {
    console.log("Creating app platform project with name:", name, "env:", env);
    try {
      const data = {
        name: name,
        type: "frontend",
        repourl: "https://github.com/BasirKhan418/React-bolierplate-code.git",
        repobranch: "main",
        techused: "Vite",
        buildcommand: "npm run build",
        rootfolder: "/",
        outputfolder: "dist",
        startcommand: "npm run start",
        installcommand: "npm install",
        env: env,
        planid: "686776a056dd1b69b4fca6e6",
      };

      // Prepare headers
      const headers = {
        "Content-Type": "application/json"
      };

      // Add cookie if token is provided in value
      if (value) {
        headers["Cookie"] = `token=${value}`;
      }

      const createproject = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/project/crud`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(data),
      });

      const res = await createproject.json();

      console.log('API Response:', res);

      if (res.success) {
        return {
          status: "success", 
          projectname: res.projectname, 
          projectid: res.projectid,
          message: "Project created successfully"
        };
      } else {
        return {
          status: "error", 
          message: res.message
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: "error", 
        message: "Error creating project: " + err.message
      };
    }
  };

  export { appplatform };