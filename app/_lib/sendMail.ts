"use server";

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  auth: {
    user: 'wyattmohammad1371017@gmail.com',
    pass: 'tpyy wnfr fhcp agqw',
  },
})


export async function sendMail({ to, replyTo, subject, html
}: {
  to: string,
  replyTo: string,
  subject: string,
  html: string
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    replyTo,
    subject,
    html
  })
}