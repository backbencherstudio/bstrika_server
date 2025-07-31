/* eslint-disable @typescript-eslint/no-explicit-any */
// serviceDoneMain
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

export const serviceDoneEmail = async (to: string, serviceName: any, email: string, name: string) => {
  const accessToken = await getAccessToken();
  const year = new Date().getFullYear();

  const emailBodyHtml = `
    <div style="font-family: 'Open Sans', sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(90deg, #4a90e2, #007aff); padding: 20px;">
          <h2 style="color: white; margin: 0; font-size: 24px;">🎉 Project Completed Successfully!</h2>
        </div>

        <div style="padding: 25px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi this is <strong>${name}</strong>,</p>

          <p style="font-size: 15px; line-height: 1.6;">
            I'm thrilled to inform you that your <strong>${serviceName}</strong> project has been successfully completed.
            Thank you for the trust and opportunity to work with you.
          </p>

          <div style="background-color: #f0f5ff; border-left: 4px solid #4a90e2; padding: 15px; margin: 25px 0; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px;">
              If you have any feedback or need further assistance, feel free to reply to this email: 
              <a href="mailto:${email}" style="color: #007aff;">${email}</a>
            </p>
          </div>

          <p style="font-size: 14px; color: #555;">
            Looking forward to collaborating with you again in the future!
          </p>

          <p style="margin-top: 30px; font-size: 14px;">Best regards, <br/><strong>Ollivu Team</strong></p>
        </div>

        <div style="background-color: #fafafa; padding: 15px; text-align: center; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">© ${year} Ollivu. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  const response = await axios.post(
    `https://graph.microsoft.com/v1.0/users/${appConfig.senderEmail}/sendMail`,
    {
      message: {
        subject: `🎯 Project Completion Notice: ${serviceName}`,
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
  
  return response.data;
};
