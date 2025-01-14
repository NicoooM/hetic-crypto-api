import nodemailer from "nodemailer";

export class EmailService {
  #transporter;

  constructor() {
    this.#transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.API_URL}/api/v1/auth/verify-email/${token}`;
    console.log("Send Email Verification", verificationUrl);
    // await this.#transporter.sendMail({
    //   from: process.env.SMTP_USER,
    //   to: email,
    //   subject: "Verify your email",
    //   html: `
    //   <h1>Email Verification</h1>
    //   <p>Please click the link below to verify your email:</p>
    //   <a href="${verificationUrl}">${verificationUrl}</a>
    // `,
    // });
  }
}
