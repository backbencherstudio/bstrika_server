// /* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */

import nodemailer from 'nodemailer';
import config from '../config';

const getStatusStyles = (subject: string) => {
  if (subject.toLowerCase().includes("suspend")) {
    return { bgColor: "#fff8e1", borderColor: "#fbbc04" }; // yellow
  }
  if (subject.toLowerCase().includes("safe")) {
    return { bgColor: "#e6f4ea", borderColor: "#34a853" }; // green
  }
  return { bgColor: "#ffecec", borderColor: "#f44336" }; // red (default for blocked or others)
};

export const notificationMain = async (to: string, sub: string, message: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.sender_email,
      pass: config.email_pass,
    },
  }); 

  const { bgColor, borderColor } = getStatusStyles(sub);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 5px; overflow: hidden;">
      <!-- Header -->
      <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
        <div style="font-size: 22px; font-weight: bold;">ACCOUNT NOTIFICATION</div>
      </div>
      
      <!-- Content -->
      <div style="padding: 30px; background-color: #fff;">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">Account Status Update</div>
        
        <!-- Alert Message -->
        <div style="background-color: ${bgColor}; border-left: 4px solid ${borderColor}; padding: 15px; margin-bottom: 20px;">
          ${message}
        </div>    
      </div>
      
      <!-- Footer -->
     <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        © 2025 Ollivu. All rights reserved.<br>
        This is an automated notification. Please do not reply to this email.<br>
        If you have any questions, email <a href="mailto:ollivu16@gmail.com" style="color: #3366cc; text-decoration: none;">ollivu16@gmail.com</a>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: config.sender_email,
    to,
    subject: sub,
    html: htmlContent,
  });
};
