import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail({ email, otp, type }) {
  const isVerification = type === 'verify_email';
  
  const subject = isVerification 
    ? 'Verify Your Email - Noah\'s Ark Shop' 
    : 'Password Reset Code';

  const expiryMinutes = isVerification ? 10 : 15;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Noah\'s Ark Shop <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>${isVerification ? 'Verify Your Email' : 'Reset Your Password'}</h2>
          
          <p>Hi there,</p>
          
          <p>${isVerification 
            ? 'Thanks for signing up! Here\'s your verification code:' 
            : 'Here\'s your password reset code:'
          }</p>
          
          <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px;">${otp}</span>
          </div>
          
          <p style="color: #666;">This code expires in ${expiryMinutes} minutes.</p>
          
          ${!isVerification ? '<p style="color: #999;">If you didn\'t request this, ignore this email.</p>' : ''}
          
          <p>Thanks,<br>Noah\'s Ark Shop</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send email');
    }

    console.log(`Email sent to ${email}`);
    return data;
    
  } catch (error) {
    console.error('Email failed:', error);
    throw error;
  }
}