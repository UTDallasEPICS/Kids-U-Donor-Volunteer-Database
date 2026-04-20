import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
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
    console.log("SMTP Connection Successful");
    console.log("SMTP Config:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      hasPassword: !!process.env.SMTP_PASS,
    });
    return true;
  } catch (error) {
    console.error("Connection Failed", error);
    return false;
  }
}

verifyEmailConfig();

// Send email verification email
export async function sendVerificationEmail(to: string, token: string, firstName: string) {
  if (!to || typeof to !== "string" || !to.includes("@")) {
    throw new Error(`Invalid email address: ${to}`);
  }

  const transporter = createTransporter();

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verification/verify-email?token=${token}`;

  const message: any = {};
  message.from = `"${process.env.SMTP_FROM_NAME || "Kids-U"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`;
  message.to = String(to);
  message.subject = "Verify Your Email Address";
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
export async function send2FACode(to: string, code: string, firstName: string) {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || "Kids-U"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to: to,
    subject: "Your Two-Factor Authentication Code",
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
export async function sendPasswordResetEmail(to: string, token: string, firstName: string) {
  const transporter = createTransporter();

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verification/reset-password?token=${token}`;

  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || "Kids-U"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to: to,
    subject: "Reset Your Password",
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

type OrientationScheduleEmailInput = {
  to: string;
  firstName: string;
  volunteerPortalUrl?: string;
  expiresAt: Date;
};

type OrientationConfirmationEmailInput = {
  volunteerName: string;
  volunteerEmail: string;
  adminName: string;
  adminEmail: string;
  meetingLink: string;
  startTime: Date;
  endTime: Date;
};

function formatGoogleDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function buildGoogleCalendarLink({
  title,
  details,
  location,
  startTime,
  endTime,
}: {
  title: string;
  details: string;
  location: string;
  startTime: Date;
  endTime: Date;
}): string {
  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: title,
    details,
    location,
    dates: `${formatGoogleDate(startTime)}/${formatGoogleDate(endTime)}`,
  });
  return `${baseUrl}&${params.toString()}`;
}

export async function sendOrientationScheduleEmail({
  to,
  firstName,
  volunteerPortalUrl,
  expiresAt,
}: OrientationScheduleEmailInput) {
  const transporter = createTransporter();

  const portalUrl = volunteerPortalUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/volunteers`;
  const deadlineText = expiresAt.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || "Kids-U"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject: "Choose your orientation time",
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
        <h2>Hello ${firstName},</h2>
        <p>Thank you for requesting to volunteer at Kids University. We are excited to get you started. Prior to volunteering, you will need to attend an online orientation which will last about 30 minutes. Please let us know which of the following dates/times work best for you.</p>
        <p>Please go to the website, sign in, and choose a time slot from your <strong>Upcoming Events</strong> area.</p>
        <p>You have <strong>24 hours from this email</strong> to pick one of the available slots.</p>
        <p>If new slots are added by admins, your available choices will update automatically.</p>
        <p><a href="${portalUrl}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">Choose a Time Slot</a></p>
        <p><strong>Deadline:</strong> ${deadlineText}</p>
        <p>If you have any questions, reply to this email.</p>
      </div>
    `,
    text: `Hello ${firstName},\n\nThank you for requesting to volunteer at Kids University. We are excited to get you started. Prior to volunteering, you will need to attend an online orientation which will last about 30 minutes. Please let us know which of the following dates/times work best for you.\n\nPlease go to the website, sign in, and choose a time slot from your Upcoming Events area:\n${portalUrl}\n\nYou have 24 hours from this email to pick one of the available slots.\nIf new slots are added by admins, your available choices will update automatically.\n\nDeadline: ${deadlineText}\n\nIf you have questions, reply to this email.`,
  });
}

export async function sendOrientationConfirmationEmails({
  volunteerName,
  volunteerEmail,
  adminName,
  adminEmail,
  meetingLink,
  startTime,
  endTime,
}: OrientationConfirmationEmailInput) {
  const transporter = createTransporter();

  const title = "Kids-U Volunteer Orientation";
  const details = `Orientation confirmed with ${adminName}. Meeting link: ${meetingLink}`;
  const calendarUrl = buildGoogleCalendarLink({
    title,
    details,
    location: meetingLink,
    startTime,
    endTime,
  });

  const dateText = startTime.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const html = (recipientName: string, counterpart: string) => `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
      <h2>Hello ${recipientName},</h2>
      <p>Your orientation is confirmed with a specific admin host.</p>
      <p><strong>Date & Time:</strong> ${dateText}</p>
      <p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
      <p><strong>With:</strong> ${counterpart}</p>
      <p><a href="${calendarUrl}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">Add to Calendar</a></p>
    </div>
  `;

  const text = (recipientName: string, counterpart: string) =>
    `Hello ${recipientName},\n\nYour orientation is confirmed with a specific admin host.\nDate & Time: ${dateText}\nMeeting Link: ${meetingLink}\nWith: ${counterpart}\nCalendar: ${calendarUrl}`;

  await Promise.all([
    transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "Kids-U"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: volunteerEmail,
      subject: "Orientation confirmed",
      html: html(volunteerName, adminName),
      text: text(volunteerName, adminName),
    }),
    transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "Kids-U"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: "Orientation confirmed",
      html: html(adminName, volunteerName),
      text: text(adminName, volunteerName),
    }),
  ]);

  return { calendarUrl };
}

// generate 6-digit code
export function generate2FACode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// secure token generator
export function generateToken(): string {
  return require("crypto").randomBytes(32).toString("hex");
}
