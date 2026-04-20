import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function verifyEmailConfig() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('SMTP Connection Successful');
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      hasPassword: !!process.env.SMTP_PASS
    });
    return true;
  } catch (error) {
    console.error('Connection Failed', error);
    return false;
  }
}

verifyEmailConfig();

// Send email verification email
export async function sendVerificationEmail(
  to: string,
  token: string,
  firstName: string
) {
  
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    throw new Error(`Invalid email address: ${to}`);
  }
  
  const transporter = createTransporter();
  
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verification/verify-email?token=${token}`;

  const message: any = {};
  message.from = `"${process.env.SMTP_FROM_NAME || 'Kids-U'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`;
  message.to = String(to); 
  message.subject = 'Verify Your Email Address';
  message.text = `Hello ${firstName},\n\nThank you for registering! Please verify your email by visiting: ${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.`;
  message.html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName},</h2>
            <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EPICS Project. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const info = await transporter.sendMail(message);
  
  return info;
}

// Send 2FA code email
export async function send2FACode(
  to: string,
  code: string,
  firstName: string
) {
  const transporter = createTransporter(); 

  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'Kids-U'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to: to,
    subject: 'Your Two-Factor Authentication Code',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; background-color: white; border-radius: 8px; margin: 20px 0; color: #4F46E5; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Two-Factor Authentication</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>Your verification code is:</p>
              <div class="code">${code}</div>
              <p><strong>This code will expire in 10 minutes.</strong></p>
              <p>If you didn't request this code, please secure your account immediately.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EPICS Project. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${firstName},\n\nYour two-factor authentication code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please secure your account immediately.`,
  });

  return info;
}

// Send password reset email
export async function sendPasswordResetEmail(
  to: string,
  token: string,
  firstName: string
) {
  const transporter = createTransporter(); 
  
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verification/reset-password?token=${token}`;

  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'Kids-U'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to: to,
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                If you didn't request a password reset, please ignore this email and ensure your account is secure.
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EPICS Project. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${firstName},\n\nWe received a request to reset your password. Visit this link to create a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, please ignore this email and ensure your account is secure.`,
  });

  return info;
}

// Send rejection email for volunteer application
export async function sendApplicationRejectionEmail(
  to: string,
  firstName: string,
  rejectionReason?: string
) {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'Kids-U'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to: to,
    subject: 'Application Status Update - Kids-U Volunteer Program',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .notice { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .reason { background-color: #white; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .contact-info { margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Status Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>Thank you for your interest in volunteering with Kids-U. We appreciate the time and effort you invested in submitting your application.</p>
              
              <div class="notice">
                <p><strong>Status:</strong> Your volunteer application has been reviewed and unfortunately, we are unable to move forward at this time.</p>
              </div>

              ${rejectionReason ? `
              <div class="reason">
                <p><strong>Reason for Decision:</strong></p>
                <p>${rejectionReason}</p>
              </div>
              ` : ''}

              <p>If you believe this decision was made in error, or if you have questions about your application, please don't hesitate to reach out to us.</p>

              <div class="contact-info">
                <p><strong>Next Steps:</strong></p>
                <ul>
                  <li>You may reapply in the future if your circumstances change</li>
                  <li>For more information or to discuss further, please contact us</li>
                  <li>We encourage you to check our website for other volunteer opportunities</li>
                </ul>
              </div>

              <p>Thank you for considering Kids-U as a place to make a difference!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EPICS Project. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${firstName},\n\nThank you for your interest in volunteering with Kids-U. We appreciate the time and effort you invested in submitting your application.\n\nStatus: Your volunteer application has been reviewed and unfortunately, we are unable to move forward at this time.${rejectionReason ? `\n\nReason for Decision:\n${rejectionReason}` : ''}\n\nIf you believe this decision was made in error, or if you have questions about your application, please don't hesitate to reach out to us.\n\nThank you for considering Kids-U as a place to make a difference!\n\n&copy; ${new Date().getFullYear()} EPICS Project.`,
  });

  return info;
}

// Send approval email for volunteer application
export async function sendApplicationApprovalEmail(
  to: string,
  firstName: string
) {
  const transporter = createTransporter();
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/volunteers`;

  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'Kids-U'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to: to,
    subject: 'Application Approved - Welcome to Kids-U Volunteer Program',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .success-box { background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .next-steps { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Kids-U!</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              
              <div class="success-box">
                <p><strong>Congratulations!</strong> Your volunteer application has been approved. We're excited to have you join the Kids-U volunteer team!</p>
              </div>

              <div class="next-steps">
                <h3>Next Steps:</h3>
                <ul>
                  <li>Log in to your volunteer account to complete any remaining requirements</li>
                  <li>Schedule your orientation session</li>
                  <li>Review the volunteer code of conduct and training materials</li>
                  <li>Attend your background check appointment if required</li>
                </ul>
              </div>

              <p style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Access Your Volunteer Dashboard</a>
              </p>

              <p>If you have any questions or need assistance, please don't hesitate to reach out to our volunteer coordinator.</p>

              <p>Thank you for your commitment to making a difference in our community!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EPICS Project. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${firstName},\n\nCongratulations! Your volunteer application has been approved. We're excited to have you join the Kids-U volunteer team!\n\nNext Steps:\n- Log in to your volunteer account to complete any remaining requirements\n- Schedule your orientation session\n- Review the volunteer code of conduct and training materials\n- Attend your background check appointment if required\n\nAccess Your Volunteer Dashboard: ${dashboardUrl}\n\nIf you have any questions or need assistance, please don't hesitate to reach out to our volunteer coordinator.\n\nThank you for your commitment to making a difference in our community!\n\n&copy; ${new Date().getFullYear()} EPICS Project.`,
  });

  return info;
}

// generate 6-digit code 
export function generate2FACode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// secure token generator
export function generateToken(): string {
  return require('crypto').randomBytes(32).toString('hex');
}
