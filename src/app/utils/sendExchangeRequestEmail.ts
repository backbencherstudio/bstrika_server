import nodemailer from 'nodemailer';
import config from '../config';

export const sendExchangeRequestEmail = async (to: string[]) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    // port: 587, 
    port: 465,
    secure: true,
    auth: {
      user: config.sender_email,
      pass: config.email_pass,
    },
  });
  const recipientEmails = to.join(',');
  await transporter.sendMail({
    from: config.sender_email,
    to: recipientEmails,
    subject: 'A new exchange request',
    text: '',
    html: `
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); overflow: hidden; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3366cc 0%, #4285f4 100%); padding: 30px 40px; text-align: center;">
        <div style="background: rgba(255,255,255,0.1); width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <div style="color: white; font-size: 30px;">📩</div>
        </div>
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            A new exchange request has been made on Ollivu
        </h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px; background: linear-gradient(to bottom, #ffffff, #f8f9ff);">
        
        <div style="margin-bottom: 25px;">
            <h2 style="color: #2c3e50; font-size: 20px; margin: 0 0 10px; font-weight: 600;">Hi there,</h2>
            <p style="color: #3366cc; font-size: 16px; margin: 0; font-weight: 500;">
                Good news! A new exchange request is waiting for you.
            </p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #3366cc;">
            <h3 style="color: #2c3e50; font-size: 18px; margin: 0 0 20px; font-weight: 600;">
                Here's how to find and review it <strong style="color: #3366cc;">in your Ollivu dashboard</strong>:
            </h3>
            
            <div style="margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; display: flex; align-items: flex-start;">
                <div style="background: linear-gradient(135deg, #3366cc, #4285f4); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; font-size: 14px; flex-shrink: 0;">1</div>
                <p style="margin: 0; color: #444; font-size: 15px; line-height: 1.5;">
                    If you're not already there, please log in to your Ollivu account and go to your dashboard.
                </p>
            </div>
            
            <div style="margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; display: flex; align-items: flex-start;">
                <div style="background: linear-gradient(135deg, #3366cc, #4285f4); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; font-size: 14px; flex-shrink: 0;">2</div>
                <p style="margin: 0; color: #444; font-size: 15px; line-height: 1.5;">
                    Once you're in your dashboard, look for the <strong style="color: #3366cc;">"Message"</strong> option in the menu (usually on the left side) and click on it.
                </p>
            </div>
            
            <div style="padding: 12px; background: white; border-radius: 8px; display: flex; align-items: flex-start;">
                <div style="background: linear-gradient(135deg, #3366cc, #4285f4); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; font-size: 14px; flex-shrink: 0;">3</div>
                <p style="margin: 0; color: #444; font-size: 15px; line-height: 1.5;">
                    In the "Message" section, click on the <strong style="color: #3366cc;">"Requests"</strong> tab.
                </p>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #f0fff0 100%); border-radius: 10px; padding: 20px; margin: 25px 0; border-left: 4px solid #28a745;">
            <p style="margin: 0; color: #2c3e50; font-size: 15px; line-height: 1.6;">
                You'll find the new exchange request listed in the "Requests" area. Please take a look and respond when you can.
            </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
            <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 500;">
                Regards,<br>
                <span style="color: #3366cc; font-weight: 600;">Ollivu Team</span>
            </p>
        </div>
        
    </div>
</div>
    ` ,
  });
};
