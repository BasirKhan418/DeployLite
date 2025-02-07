import nodemailer from 'nodemailer';
const SendOtp = async(email: string, token: string,name:string,otpcode:number) => {
try{
    const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER_NAME,
            pass: process.env.EMAIL_PASSWORD,
        }
      });
      //SENDING ACTUAL EMAIL
      const info = await transporter.sendMail({
        from: 'support@deploylite.tech', // sender address (correct format)
        to: `${email}`, // list of receivers
        subject: `Your DeployLite Login Code: ${otpcode} `, // Subject line
        text: "Deploylite", // plain text body
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <style>
    body {
      font-family: 'Helvetica', Arial, sans-serif;
      background-color: #f0f4f8;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 10px 0;
    }
    .header img {
      max-width: 160px;
    }
    .header h1 {
      font-size: 28px;
      margin: 20px 0;
      color: #4a90e2;
      font-weight: bold;
    }
    .subheader {
      font-size: 18px;
      color: #777;
      margin-bottom: 20px;
    }
    .content {
      padding: 0 30px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
      margin: 15px 0;
    }
    .otp-box {
      display: inline-block;
      padding: 15px 25px;
      font-size: 28px;
      letter-spacing: 6px;
      border-radius: 10px;
      background-color: #f0f8ff;
      color: #333;
      border: 2px solid #4a90e2;
      margin: 20px 0;
    }
    .cta-button {
      display: inline-block;
      padding: 15px 30px;
      background-color: #4a90e2;
      color: #ffffff;
      border-radius: 8px;
      text-decoration: none;
      font-size: 18px;
      margin-top: 25px;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #357abd;
    }
    .info-box {
      padding: 15px;
      background-color: #e9f7ff;
      border-radius: 8px;
      margin: 30px 0;
      font-size: 14px;
      color: #333;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #888;
      background-color: #f7f7f7;
      border-top: 1px solid #ddd;
      margin-top: 30px;
      border-radius: 0 0 12px 12px;
    }
    .footer a {
      color: #4a90e2;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .container {
        padding: 15px;
      }
      .otp-box {
        font-size: 22px;
        letter-spacing: 3px;
      }
      .cta-button {
        font-size: 16px;
        padding: 12px 20px;
      }
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <img src="https://your-logo-url.com" alt="DeployLite Logo">
      <h1>Secure Login Verification</h1>
      <p class="subheader">Access your DeployLite account in seconds</p>
    </div>

    <div class="content">
      <p>Hello ${name},</p>
      <p>We received a request to log in to your DeployLite account. Use the one-time password (OTP) below to complete your login process.</p>

      <div class="otp-box">${otpcode}</div>

      <p>The OTP is valid for the next <strong>10 minutes</strong>. Please use it as soon as possible.</p>
      <p>If you did not request this, kindly ignore this email or <a href="mailto:support@deploylite.tech">contact our support team</a> immediately.</p>

      <a href="${process.env.NEXT_URL}/otp?token=${token}" class="cta-button">Login to DeployLite</a>
      
      <div class="info-box">
        <p>Need help? Check out our <a href="#">Help Center</a> or reach us at <a href="mailto:support@deploylite.com">support@deploylite.com</a>.</p>
      </div>
    </div>

    <div class="footer">
      <p>&copy; 2024 DeployLite. All rights reserved.</p>
      <p>Follow us on <a href="#">Twitter</a> | <a href="#">LinkedIn</a></p>
    </div>
  </div>

</body>
</html>

        `,
    });
}
catch(err:any){
    return {status: 'error',message: err.message,success: false}
}
}
export default SendOtp;