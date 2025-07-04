const createDatabase = async (dbname, dbuser, dbpass, dbtype, value) => {
    console.log('Creating database with parameters:', {
      dbname,
        dbuser,
        dbpass,
        dbtype,
        value
    });
    try {
      const submissionData = {
        dbname: dbname.trim(),
        dbuser: dbuser.trim(),
        dbpass: dbpass.trim(),
        dbport: "",
        dbtype: dbtype,
        planid: "68677f5f56dd1b69b4fca788",
      };

      // Prepare headers
      const headers = {
        "Content-Type": "application/json",
      };

      // Add cookie if token is provided in value
      if (value) {
        headers["Cookie"] = `token=${value}`;
      }

      const createDatabase = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/project/database`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(submissionData),
      });

      const res = await createDatabase.json();
      console.log('API Response:', res);

      if (res.success) {
        return { 
          status: "success", 
          message: res.message, 
          databaseid: res.project._id 
        };
      } else {
        return { 
          status: "error", 
          message: res.message 
        };
      }
    } catch (err) {
      return { 
        status: "error", 
        message: "Error creating database: " + err.message 
      };
    }
  };

export { createDatabase };