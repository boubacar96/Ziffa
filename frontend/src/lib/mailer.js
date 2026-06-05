import nodemailer from 'nodemailer';

// Transport SMTP construit depuis les variables d'environnement.
// Renvoie null si le SMTP n'est pas configuré (l'endpoint répond alors proprement).
export function getTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true', // true = port 465
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

export const MAIL_TO = process.env.MAIL_TO || 'festival@ziffa.sn';
export const MAIL_FROM = process.env.MAIL_FROM || 'ZIFFA <no-reply@ziffa.sn>';
