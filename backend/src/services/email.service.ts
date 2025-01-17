import nodemailer from "nodemailer";

export class EmailService {
  #transporter;

  constructor() {
    this.#transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      secure: false,
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    try {
      await this.#transporter.sendMail({
        from: "no-reply@example.com",
        to: email,
        subject: "Verify your email",
        html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
      });
    } catch (error) {
      throw new Error(`Failed to send verification email => ${error}`);
    }
  }
}
