import nodemailer from 'nodemailer';
const ForgotEmail = async(email: string, token: string,name:string) => {
try{
    const transporter = await nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
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
        subject: `Forgot Your Password for DeployLite Let’s Get You Back On Track! `, // Subject line
        text: "Deploylite", // plain text body
        html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #333333;
            padding: 30px;
            text-align: center;
            color: white;
            font-size: 28px;
            font-weight: bold;
        }
        .email-body {
            padding: 30px;
            text-align: center;
        }
        .email-body p {
            color: #444444;
            font-size: 16px;
            line-height: 1.8;
        }
        .email-body p.salutation {
            font-size: 18px;
            font-weight: bold;
            color: #333333;
        }
        .reset-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 14px 24px;
            text-decoration: none;
            border-radius: 50px;
            font-size: 16px;
            margin-top: 20px;
        }
        .reset-button:hover {
            background-color: #45a049;
        }
        .divider {
            height: 1px;
            background-color: #dddddd;
            margin: 30px 0;
        }
        .info-box {
            background-color: #f1f1f1;
            border-left: 5px solid #4CAF50;
            padding: 20px;
            margin: 30px 0;
        }
        .info-box p {
            color: #555555;
            font-size: 14px;
            margin: 0;
            text-align: left;
        }
        .email-footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            background-color: #f4f4f4;
            color: #888888;
        }
        .email-footer p {
            margin: 5px 0;
        }
        .social-icons {
            margin: 20px 0;
        }
        .social-icons img {
            margin: 0 10px;
            width: 30px;
        }
        @media only screen and (max-width: 600px) {
            .email-header, .email-body, .email-footer {
                padding: 15px;
            }
            .reset-button {
                padding: 12px 20px;
                font-size: 14px;
            }
            .email-body p {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Email Header -->
        <div class="email-header">
            Password Reset Request
        </div>
        <!-- Email Body -->
        <div class="email-body">
            <p class="salutation">Hello, <strong>${name}</strong>,</p>
            <p>We received a request to reset the password for your account. Please click the button below to reset your password. If you didn't request this, you can ignore this email and your password will remain the same.</p>
            <a href="${process.env.NEXT_URL}/reset?token=${token}" class="reset-button">Reset Your Password</a>

            <div class="divider"></div>

            <div class="info-box">
                <p><strong>Security Tip:</strong> For your security, the password reset link is valid for 60 minutes. If it expires, you will need to request a new one. If you encounter any issues, feel free to contact our support team.</p>
            </div>

            <p>Thank you for using our service. We're always here to help if you need any assistance.</p>
        </div>
        <!-- Footer Section -->
        <div class="email-footer">
            <p>Follow us on our social media for updates:</p>
            <div class="social-icons">
                <a href="#"><img src="https://via.placeholder.com/30x30.png?text=F" alt="Facebook"></a>
                <a href="#"><img src="https://via.placeholder.com/30x30.png?text=T" alt="Twitter"></a>
                <a href="#"><img src="https://via.placeholder.com/30x30.png?text=I" alt="Instagram"></a>
            </div>
            <p>© 2024 DeployLite. All rights reserved.</p>
            <p>If you have any questions, please contact us at <a href="mailto:support@deploylite.tech">support@deploylite.tech</a>.</p>
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
export default ForgotEmail;