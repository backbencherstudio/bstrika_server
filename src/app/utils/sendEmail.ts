import axios from 'axios';
import { appConfig } from '../config';

const getAccessToken = async () => {
  const tokenUrl = `https://login.microsoftonline.com/${appConfig.tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams({
    client_id: appConfig.clientId,
    scope: 'https://graph.microsoft.com/.default',
    client_secret: appConfig.clientSecret,
    grant_type: 'client_credentials',
  });

  const response = await axios.post(tokenUrl, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data.access_token;
};

export const sendEmail = async (to: string, otp: string) => {
  const accessToken = await getAccessToken();
  const year = new Date().getFullYear();

  const emailBodyHtml = `
    <div style="max-width: 500px; margin: 0 auto; padding: 25px; font-family: 'Arial', sans-serif; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.1); border-top: 5px solid #3366cc; background: linear-gradient(to bottom, #ffffff, #f9f9f9);">
      <div style="text-align: center;">
        <h2 style="color: #3366cc; margin: 0 0 20px; font-size: 22px;">Your Verification Code</h2>
        <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Please use the OTP code below to verify your account:</p>
        <div style="background-color: #f0f5ff; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #3366cc;">
          <p style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #3366cc; margin: 0;">${otp}</p>
        </div>
        <p style="color: #777; font-size: 14px; margin-top: 25px;">If you don't need this code, please ignore this email.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 13px; margin: 0;">© ${year} Ollivu. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  const response = await axios.post(
    `https://graph.microsoft.com/v1.0/users/${appConfig.senderEmail}/sendMail`,
    {
      message: {
        subject: 'Set your OTP',
        body: {
          contentType: 'HTML',
          content: emailBodyHtml,
        },
        toRecipients: [{ emailAddress: { address: to } }],
      },
      saveToSentItems: false,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('✅ OTP email sent via Graph API');
  return response.data;
};











// import nodemailer from 'nodemailer';
// import config from '../config';

// export const sendEmail = async (to: string, otp: string) => {    
  
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com.',
//     // port: 587, 
//     port: 465, 
//     secure: true,
//     auth: {
//       user: config.sender_email ,
//       pass: config.email_pass , 
//     },
//   });
//   const year = new Date().getFullYear();

//   await transporter.sendMail({
//     from: config.sender_email,
//     to, 
//     subject: 'Set your OTP', 
//     text: '', 
//     html : `<div style="max-width: 500px; margin: 0 auto; padding: 25px; font-family: 'Arial', sans-serif; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.1); border-top: 5px solid #3366cc; background: linear-gradient(to bottom, #ffffff, #f9f9f9);">
//   <div style="text-align: center;">
//     <h2 style="color: #3366cc; margin: 0 0 20px; font-size: 22px;">Your Verification Code</h2>
//     <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Please use the OTP code below to verify your account:</p>
//     <div style="background-color: #f0f5ff; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #3366cc;">
//       <p style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #3366cc; margin: 0;">${otp}</p>
//     </div>
//     <p style="color: #777; font-size: 14px; margin-top: 25px;">If you don't need this code, please ignore this email.</p>
//     <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
//       <p style="color: #999; font-size: 13px; margin: 0;">© ${year} Ollivu . All rights reserved.</p>
//     </div>
//   </div>
// </div>` ,
//   });
// };
