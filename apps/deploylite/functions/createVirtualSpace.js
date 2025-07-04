const CreateVirtualSpace = async (name,password,value) => {
    console.log("Creating virtual space with name:", name, "and password:", password, "with value:", value);
    try {


      const submissionData = {
        name: name.trim(),
        password: password.trim(),
        planid: "6866f4677972d8f2ce2a3123",
      };
  // Prepare headers
      const headers = {
        "Content-Type": "application/json",
      };

      // Add cookie if token is provided in value
      if (value) {
        headers["Cookie"] = `token=${value}`;
      }
      const createProject = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/project/virtualspace`, {
        headers:headers,
        method: "POST",
        body: JSON.stringify(submissionData),
      });

      const res = await createProject.json();
      console.log('API Response:', res);
 
      if (res.success) {
        return { status: "success", projectname: res.project.name, projectid: res.project._id, message: "Virtual space created successfully" };
      } else {
 
        return { status: "error", message: res.message };
      }
    } catch (err) {
    return { status: "error", message: "Error creating virtual space: " + err.message
    }
  }
}
export { CreateVirtualSpace };