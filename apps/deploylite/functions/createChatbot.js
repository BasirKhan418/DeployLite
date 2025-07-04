const createChatbot = async (name, openaiapikey, googleapikey, value) => {
    console.log("Creating chatbot with name:", name, "and OpenAI API key:", openaiapikey, "and Google API key:", googleapikey, "with value:", value);
    try {
      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add cookie if token is provided in value
      if (value) {
        headers['Cookie'] = `token=${value}`;
      }

      // Create chatbot project
      const createResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/project/chatbot`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          name: name.trim(),
          planid: "6866f4677972d8f2ce2a311c",
          openaiapikey: openaiapikey.trim(),
          googleapikey: googleapikey.trim(),
        }),
      });

      const createResult = await createResponse.json();

      if (!createResult.success) {
        return { status: 'error', message: createResult.message };
      }

      return { 
        status: 'success', 
        projectname: createResult.project.name, 
        projectid: createResult.project._id, 
        message: 'Chatbot created successfully' 
      };

    } catch (error) {
      return { 
        status: 'error', 
        message: 'Error creating chatbot project: ' + error.message 
      };
    }
  };

export { createChatbot };