import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    })
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending error:', error)
    throw new Error('Failed to send email')
  }
}

export function generateVerificationLink(
  baseUrl: string,
  token: string,
  type: 'verify' | 'reset'
) {
  return `${baseUrl}/auth/${type}?token=${token}`
}

export function getEmailTemplate(type: string, data: any): string {
  switch (type) {
    case 'verify-email':
      return `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2>Verify Your Email</h2>
              <p>Welcome! Please verify your email address to activate your account.</p>
              <p>
                <a href="${data.verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #b08ccf; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Verify Email
                </a>
              </p>
              <p>Or copy this link: <a href="${data.verificationLink}">${data.verificationLink}</a></p>
              <p>This link expires in 24 hours.</p>
              <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #999;">If you didn't create this account, please ignore this email.</p>
            </div>
          </body>
        </html>
      `

    case 'password-reset':
      return `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password. Click the link below to proceed:</p>
              <p>
                <a href="${data.resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #b08ccf; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Reset Password
                </a>
              </p>
              <p>Or copy this link: <a href="${data.resetLink}">${data.resetLink}</a></p>
              <p>This link expires in 1 hour.</p>
              <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #999;">If you didn't request this, please ignore this email.</p>
            </div>
          </body>
        </html>
      `

    case 'student-submission':
      return `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2>New Student Application Received</h2>
              <p>Thank you for your application! Here are your details:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f5f5f5;">
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td>
                </tr>
                <tr style="background-color: #f5f5f5;">
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${data.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">University</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${data.university}</td>
                </tr>
              </table>
              <p>We will contact you soon with more information.</p>
              <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #999;">Thank you for choosing us!</p>
            </div>
          </body>
        </html>
      `

    default:
      return '<p>Email content</p>'
  }
}
