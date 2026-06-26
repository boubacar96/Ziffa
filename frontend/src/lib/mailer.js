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

// ---------------------------------------------------------------------------
// Modèle d'email de marque ZIFFA (HTML « bulletproof » : tableaux + styles en
// ligne + polices web-safe → rendu correct dans Gmail, Outlook, webmail o2switch).
// Partagé par les formulaires (contact, inscription film).
// ---------------------------------------------------------------------------

/** Échappe le HTML d'une valeur insérée dans un email. */
export function esc(s) {
  return String(s || '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

/**
 * Neutralise les retours à la ligne dans une valeur destinée à un en-tête email
 * (subject, replyTo). Défense en profondeur contre l'injection d'en-tête —
 * nodemailer encode déjà les en-têtes, mais on retire les CR/LF par sécurité.
 */
export function headerSafe(s) {
  return String(s || '').replace(/[\r\n]+/g, ' ').trim();
}

/**
 * Enveloppe un contenu dans l'habillage de marque ZIFFA.
 * @param {object} o
 * @param {string} o.barColor   couleur de la bande d'accent sous l'en-tête
 * @param {string} o.pillBg     fond du badge
 * @param {string} o.pillText   texte du badge
 * @param {string} o.badge      libellé du badge (texte)
 * @param {string} o.title      titre principal (texte)
 * @param {string} o.subtitle   sous-titre (texte)
 * @param {string} o.preheader  texte d'aperçu masqué (inbox)
 * @param {string} o.content    HTML déjà construit (infoTable / messageBlock / noteBox)
 */
export function emailLayout({ barColor = '#E8B547', pillBg = '#EAF3DE', pillText = '#1A4527', badge = '', title = '', subtitle = '', preheader = '', content = '' }) {
  return `<div style="background:#f4f6f3;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f4f6f3;font-size:1px;line-height:1px;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e7e2d6;border-radius:12px;border-collapse:separate;overflow:hidden;">
    <tr><td style="padding:0;">
      <div style="background:#1A4527;padding:22px 26px;">
        <div style="font-size:26px;font-weight:bold;letter-spacing:1px;color:#ffffff;line-height:1;">ZIFFA<span style="color:#E8B547;">.</span></div>
        <div style="font-size:11px;letter-spacing:1.5px;color:#a9c6b2;margin-top:6px;">ZIGUINCHOR INTERNATIONAL FILM FESTIVAL &amp; ANIMATION</div>
      </div>
      <div style="height:4px;line-height:4px;font-size:0;background:${barColor};">&nbsp;</div>
      <div style="padding:24px 26px;">
        <div style="display:inline-block;background:${pillBg};color:${pillText};font-size:11px;font-weight:bold;letter-spacing:.5px;padding:5px 12px;border-radius:50px;">${esc(badge)}</div>
        <div style="font-size:19px;color:#1A4527;font-weight:bold;margin:16px 0 4px;">${esc(title)}</div>
        ${subtitle ? `<div style="font-size:13px;color:#6b7280;margin-bottom:18px;">${esc(subtitle)}</div>` : '<div style="margin-bottom:18px;"></div>'}
        ${content}
      </div>
      <div style="background:#f4f6f3;border-top:1px solid #e7e2d6;padding:14px 26px;font-size:11px;color:#9ca3af;line-height:1.6;">
        ZIFFA &middot; festival@ziffa.sn &middot; ziffa.sn<br>Email automatique envoyé depuis le site du festival.
      </div>
    </td></tr>
  </table>
</div>`;
}

/** Tableau label / valeur. rows = [[label, value], …] ; les lignes vides sont ignorées. */
export function infoTable(rows) {
  const body = rows
    .filter(([, v]) => v)
    .map(([l, v]) => `<tr><td style="padding:9px 0;color:#6b7280;width:150px;border-bottom:1px solid #eef0ec;vertical-align:top;">${esc(l)}</td><td style="padding:9px 0;color:#1e293b;font-weight:bold;border-bottom:1px solid #eef0ec;">${esc(v)}</td></tr>`)
    .join('');
  return body ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">${body}</table>` : '';
}

/** Bloc « titre + texte » (message, synopsis, bio…), filet d'accent jaune. */
export function messageBlock(label, text) {
  if (!text) return '';
  return `<div style="font-size:12px;font-weight:bold;color:#1A4527;letter-spacing:.5px;margin:22px 0 8px;">${esc(label).toUpperCase()}</div>
  <div style="background:#f7f8f5;border-left:3px solid #E8B547;padding:14px 16px;font-size:14px;color:#1e293b;line-height:1.65;white-space:pre-wrap;">${esc(text)}</div>`;
}

/** Encart d'information (vert = « répondre », gris = « pièces jointes »). */
export function noteBox(text, kind = 'reply') {
  const neutral = kind === 'attach';
  const style = neutral
    ? 'background:#f4f6f3;border:1px solid #e7e2d6;color:#1e293b;'
    : 'background:#EAF3DE;color:#1A4527;';
  return `<div style="margin-top:18px;padding:12px 14px;border-radius:8px;font-size:13px;${style}">${esc(text)}</div>`;
}
