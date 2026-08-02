import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function envoyerEmail(destinataire, sujet, texte) {
  try {
    await transporter.sendMail({
      from: `"G-Room" <${process.env.EMAIL_USER}>`,
      to: destinataire,
      subject: sujet,
      text: texte,
    });
  } catch (err) {
    console.error("Erreur envoi email:", err.message);
  }
}
