/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import fs from 'fs';
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

export const sendEmailToUser = async (
  to: string[],
  sub: string,
  message: string,
  file: any
) => {
  const accessToken = await getAccessToken();

  let attachment = undefined;

  if (file && fs.existsSync(file.path)) {
    const fileBuffer = fs.readFileSync(file.path);
    const base64Content = fileBuffer.toString('base64');

    attachment = [
      {
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: file.originalname,
        contentBytes: base64Content,
      },
    ];
  }

  const response = await axios.post(
    `https://graph.microsoft.com/v1.0/users/${appConfig.senderEmail}/sendMail`,
    {
      message: {
        subject: sub,
        body: {
          contentType: 'HTML',
          content: message,
        },
        toRecipients: to.map(email => ({
          emailAddress: { address: email },
        })),
        attachments: attachment || [],
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

  console.log('✅ Email sent via Microsoft Graph API');
  return response.data;
};


















// /* eslint-disable @typescript-eslint/no-explicit-any */
// import nodemailer from 'nodemailer';
// import config from '../config';

// export const sendEmailToUser = async (to: string[], sub: string, message: string, file : any) => {

//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465, 
//     secure: true, 
//     auth: {
//       user: config.sender_email,
//       pass: config.email_pass ,  
//     },
//   });
  
//   const recipientEmails = to.join(',');
  
//   await transporter.sendMail({
//     from: config.sender_email,
//     to: recipientEmails,
//     subject: sub,
//     text: '', 
//     html: message,
//     attachments: file ? [{ 
//       filename: file.originalname,
//       path: file.path
//     }] : [],
//   });

// };
