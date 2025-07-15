import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "smtp.mailgun.org";
const port = Number(process.env.SMTP_PORT) || 587;
const user = process.env.SMTP_USER; // postmaster@domain.com
const pass = process.env.SMTP_PASS;

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465 false for other ports
  auth: user && pass ? { user, pass } : undefined,
});

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  phone?: string | undefined;
  message: string;
}) => {
  const html = `<p><strong>Name:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Phone:</strong> ${data.phone || "-"}</p>
<p><strong>Message:</strong><br/>${data.message}</p>`;

  await transporter.sendMail({
    from: user || "noreply@learningoo.dev",
    to: "info@bartoszsergot.com",
    subject: "New Learningoo Contact Form Submission",
    html,
  });
};
