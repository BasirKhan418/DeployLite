const CreateWebbuilder = async (name,value) => {
console.log("Creating webbuilder with name:", name, "with value:", value);
    try {
      const submissionData = {
        name: name.trim(),
        webbuilder: "wordpress",
        dbname: "admin",
        dbuser: "user@123",
        dbpass: "password@123",
        planid: "686776a056dd1b69b4fca6ec",
      };

        // Prepare headers
      const headers = {
        "Content-Type": "application/json",
      };

      // Add cookie if token is provided in value
      if (value) {
        headers["Cookie"] = `token=${value}`;
      }
      const createProject = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/project/wordpress`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(submissionData),
      });

      const res = await createProject.json();
 
      if (res.success) {
        return { status: "success", projectname: res.project.name, projectid: res.project._id, message: "Project created successfully" };
      } else {
       return { status: "error", message: res.message };
      }
    } catch (err) {
    return { status: "error", message: "Error creating project: " + err.message
    }
  }
}
export { CreateWebbuilder };