import { getTransport, MAIL_TO, MAIL_FROM, headerSafe } from '../../lib/mailer.js';
import { checkRateLimit, clientIp } from '../../lib/ratelimit.js';

export const prerender = false;

const MAX_TOTAL_BYTES = 25 * 1024 * 1024; // ~25 Mo de pièces jointes max

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...extraHeaders } });
}
function esc(s) {
  return String(s || '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

// Définition des 3 branches : champs texte + fichiers, avec libellés et obligation.
const BRANCHES = {
  press: {
    label: 'Presse / Press',
    fields: [
      ['p_function', 'Fonction / Occupation', true],
      ['p_firstName', 'Prénom', true],
      ['p_lastName', 'Nom de famille', true],
      ['p_profession', 'Profession', false],
      ['p_address', 'Adresse', false],
      ['p_whatsapp', 'WhatsApp', false],
      ['p_email', 'Email', true],
      ['p_city', 'Ville', false],
      ['p_country', 'Pays', true],
      ['p_media', 'Média', true],
      ['p_orgName', "Nom de l'organe de presse", true],
      ['p_orgAddress', "Adresse de l'organe", false],
      ['p_orgWhatsapp', 'WhatsApp (organe)', false],
      ['p_orgEmail', 'Email (organe)', true],
      ['p_orgCity', 'Ville (organe)', false],
      ['p_orgCountry', 'Pays (organe)', false],
    ],
    files: [
      ['p_card', 'Carte professionnelle', true, false],
      ['p_idPhoto', "Photo d'identité", true, false],
    ],
    emailField: 'p_email',
    titleField: (f) => `${f('p_firstName')} ${f('p_lastName')}`.trim(),
  },
  festival: {
    label: 'Représentant de festival / Festival representative',
    fields: [
      ['f_function', 'Fonction / Occupation', true],
      ['f_firstName', 'Prénom (représentant)', true],
      ['f_lastName', 'Nom de famille (représentant)', true],
      ['f_profession', 'Profession', false],
      ['f_address', 'Adresse', false],
      ['f_whatsapp', 'WhatsApp', false],
      ['f_email', 'Email', true],
      ['f_city', 'Ville', false],
      ['f_country', 'Pays', false],
      ['f_festName', 'Nom du festival', true],
      ['f_festAddress', 'Adresse du festival', false],
      ['f_festWhatsapp', 'WhatsApp (festival)', false],
      ['f_festEmail', 'Email (festival)', false],
      ['f_festCity', 'Ville (festival)', false],
      ['f_festCountry', 'Pays (festival)', false],
      ['f_dirFirstName', 'Prénom du responsable du festival', true],
      ['f_dirLastName', 'Nom du responsable du festival', true],
      ['f_dirEmail', 'Email du responsable du festival', false],
    ],
    files: [['f_idPhoto', "Photo d'identité", true, false]],
    emailField: 'f_email',
    titleField: (f) => `${f('f_firstName')} ${f('f_lastName')} — ${f('f_festName')}`.trim(),
  },
  trades: {
    label: 'Métiers du cinéma / Film trades',
    fields: [
      ['t_function', 'Fonction / Occupation', true],
      ['t_firstName', 'Prénom', true],
      ['t_lastName', 'Nom de famille', true],
      ['t_countryOrigin', "Pays d'origine", true],
      ['t_otherNationality', 'Autre nationalité', true],
      ['t_profession', 'Profession', true],
      ['t_address', 'Adresse personnelle', false],
      ['t_whatsapp', 'WhatsApp', false],
      ['t_email', 'Email', true],
      ['t_city', 'Ville', false],
      ['t_country', 'Pays', false],
      ['t_prodName', 'Société de production — nom', true],
      ['t_prodAddress', 'Société de production — adresse', false],
      ['t_prodWhatsapp', 'Société de production — WhatsApp', false],
      ['t_prodEmail', 'Société de production — email', false],
      ['t_prodCity', 'Société de production — ville', false],
      ['t_prodCountry', 'Société de production — pays', false],
      ['t_distName', 'Société de distribution — nom', true],
      ['t_distAddress', 'Société de distribution — adresse', false],
      ['t_distWhatsapp', 'Société de distribution — WhatsApp', false],
      ['t_distEmail', 'Société de distribution — email', false],
      ['t_distCity', 'Société de distribution — ville', false],
      ['t_distCountry', 'Société de distribution — pays', false],
    ],
    files: [
      ['t_idPhoto', "Photo d'identité", true, false],
      ['t_biofilmo', 'Biofilmographie (PDF/Word)', true, false],
    ],
    emailField: 't_email',
    titleField: (f) => `${f('t_firstName')} ${f('t_lastName')} (${f('t_profession')})`.trim(),
  },
};

export async function POST({ request, clientAddress }) {
  try {
    const rl = checkRateLimit(clientIp(request, clientAddress));
    if (!rl.ok) return json({ ok: false, error: 'Trop de tentatives. Réessayez dans quelques minutes.' }, 429, { 'Retry-After': String(rl.retryAfter) });

    const form = await request.formData();
    if ((form.get('website') || '').toString().trim()) return json({ ok: true }); // honeypot

    const f = (k) => (form.get(k) || '').toString().trim();
    const option = f('option');
    const branch = BRANCHES[option];
    if (!branch) return json({ ok: false, error: "Merci de choisir une option d'accréditation." }, 400);

    // Champs texte obligatoires
    const missing = branch.fields.filter(([name, , req]) => req && !f(name)).map(([, label]) => label);

    // Fichiers
    const mailAttachments = [];
    let total = 0;
    for (const [name, label, req] of branch.files) {
      const file = form.get(name);
      if (file && typeof file === 'object' && file.size) {
        total += file.size;
        mailAttachments.push({ filename: file.name, content: Buffer.from(await file.arrayBuffer()) });
      } else if (req) {
        missing.push(label);
      }
    }

    if (missing.length) return json({ ok: false, error: 'Champs obligatoires manquants : ' + missing.join(', ') }, 400);
    if (total > MAX_TOTAL_BYTES) {
      return json({ ok: false, error: 'Les fichiers joints dépassent 25 Mo. Réduisez leur poids.' }, 400);
    }

    const transport = getTransport();
    if (!transport) {
      console.error('[accreditation] SMTP non configuré');
      return json({ ok: false, error: "Le service d'envoi n'est pas encore configuré. Réessayez plus tard ou écrivez à festival@ziffa.sn." }, 503);
    }

    const row = (label, val) => (val ? `<tr><td style="padding:6px 12px;color:#6b7280">${esc(label)}</td><td style="padding:6px 12px;color:#1e293b"><b>${esc(val)}</b></td></tr>` : '');
    const html = `
      <h2 style="font-family:sans-serif;color:#1A4527">Nouvelle demande d'accréditation — ZIFFA</h2>
      <p style="font-family:sans-serif;font-size:14px"><b>Catégorie :</b> ${esc(branch.label)}</p>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        ${branch.fields.map(([name, label]) => row(label, f(name))).join('')}
      </table>
      <p style="font-family:sans-serif;font-size:13px;color:#6b7280">Pièces jointes : ${mailAttachments.map((a) => esc(a.filename)).join(', ') || 'aucune'}</p>
    `;

    await transport.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: headerSafe(f(branch.emailField)) || undefined,
      subject: headerSafe(`🎟️ Accréditation ${branch.label} — ${branch.titleField(f) || 'demande'}`),
      html,
      attachments: mailAttachments,
    });

    return json({ ok: true });
  } catch (err) {
    console.error('[accreditation] erreur :', err);
    return json({ ok: false, error: 'Erreur serveur. Réessayez plus tard.' }, 500);
  }
}
