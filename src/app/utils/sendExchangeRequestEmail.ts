import nodemailer from 'nodemailer';
import config from '../config';

export const sendExchangeRequestEmail = async (to: string[]) => {    
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    // port: 587, 
    port: 465, 
    secure: true,
    auth: {
      user: config.sender_email ,
      pass: config.email_pass , 
    },
  });
  const recipientEmails = to.join(',');
  await transporter.sendMail({
    from: config.sender_email,
    to : recipientEmails, 
    subject: 'A new exchange request come', 
    text: '', 
    html : `<div style="max-width: 500px; margin: 0 auto; padding: 25px; font-family: 'Arial', sans-serif; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.1); border-top: 5px solid #3366cc; background: linear-gradient(to bottom, #ffffff, #f9f9f9);">
  <div style="text-align: center;">
    <h2 style="color: #3366cc; margin: 0 0 20px; font-size: 22px;">Check your dashboard a new exchange request come </h2>  
    
  </div>
</div>` ,
  });
};
