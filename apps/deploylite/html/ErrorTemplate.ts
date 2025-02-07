const ErrorTemplate = (errname:string)=>{
let template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification Error</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0;">

  <!-- Main container -->
  <div style="max-width: 600px; margin: 50px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center;">
    
    <!-- Branding section -->
    <h1 style="color: #0073e6; margin-bottom: 30px;">DeployLite</h1>
    
    <!-- Error Message -->
    <h2 style="color: #e74c3c; font-size: 24px;">Email Verification Failed</h2>
    <p style="color: #555; font-size: 16px; margin-bottom: 10px;">
      <!-- Place for dynamic error message -->
      <span id="error-text">An error occurred while verifying your email. Please try again.</span>
      <br/>
      <br/>
      <span id="error-text " style="color: #e74c3c; font-size: 18px;">Error: is ${errname}.</span>
    </p>

    <!-- Resend Verification Button -->
    <a href="/signup" style="display: inline-block; background-color: #e74c3c; color: white; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-size: 16px; margin-top: 20px;">Resend Verification Email</a>

  </div>

</body>
</html>

`
return template;
}
export default ErrorTemplate;