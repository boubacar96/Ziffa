import { getTransport, MAIL_TO, MAIL_FROM } from '../../lib/mailer.js';

export const prerender = false;

const MAX_TOTAL_BYTES = 22 * 1024 * 1024; // ~22 Mo de pièces jointes max

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
function esc(s) {
  return String(s || '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

export async function POST({ request }) {
  try {
    const form = await request.formData();

    // Honeypot anti-spam : champ caché qui doit rester vide.
    if ((form.get('website') || '').toString().trim()) return json({ ok: true });

    const f = (k) => (form.get(k) || '').toString().trim();

    const required = ['filmTitle', 'director', 'email', 'viewingLink', 'synopsisShort', 'synopsisLong', 'directorBio'];
    const missing = required.filter((k) => !f(k));
    if (missing.length) return json({ ok: false, error: 'Champs obligatoires manquants : ' + missing.join(', ') }, 400);

    if (f('directorBio').split(/\s+/).filter(Boolean).length > 500) {
      return json({ ok: false, error: 'La biographie du réalisateur dépasse 500 mots.' }, 400);
    }

    // Pièces jointes : fiche technique, affiche, photos (min. 2)
    const attachments = [];
    let total = 0;
    const addFile = (file) => {
      if (file && typeof file === 'object' && file.size) {
        total += file.size;
        attachments.push(file);
      }
    };
    addFile(form.get('technicalSheet'));
    addFile(form.get('poster'));
    const photos = form.getAll('photos').filter((x) => x && typeof x === 'object' && x.size);
    photos.forEach(addFile);

    if (photos.length < 2) return json({ ok: false, error: 'Merci de joindre au moins 2 photos du film.' }, 400);
    if (total > MAX_TOTAL_BYTES) {
      return json({ ok: false, error: 'Les fichiers joints dépassent 22 Mo. Réduisez le poids des images ou partagez-les via le lien de visionnage.' }, 400);
    }

    const mailAttachments = [];
    for (const file of attachments) {
      mailAttachments.push({ filename: file.name, content: Buffer.from(await file.arrayBuffer()) });
    }

    const transport = getTransport();
    if (!transport) {
      console.error('[film-submission] SMTP non configuré (variables SMTP_*)');
      return json({ ok: false, error: "Le service d'envoi n'est pas encore configuré. Réessayez plus tard ou écrivez à festival@ziffa.sn." }, 503);
    }

    const row = (label, val) => `<tr><td style="padding:6px 12px;color:#6b7280">${esc(label)}</td><td style="padding:6px 12px;color:#1e293b"><b>${esc(val) || '—'}</b></td></tr>`;
    const html = `
      <h2 style="font-family:sans-serif;color:#1A4527">Nouvelle inscription de film — ZIFFA</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        ${row('Titre du film', f('filmTitle'))}
        ${row('Réalisateur', f('director'))}
        ${row('Email', f('email'))}
        ${row('Téléphone', f('phone'))}
        ${row('Pays', f('country'))}
        ${row('Année', f('productionYear'))}
        ${row('Durée', f('duration'))}
        ${row('Catégorie', f('category'))}
        ${row('Langue / sous-titres', f('language'))}
        ${row('Lien de visionnage', f('viewingLink'))}
        ${row('Mot de passe du lien', f('viewingPassword'))}
      </table>
      <h3 style="font-family:sans-serif;color:#1A4527">Synopsis court</h3>
      <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${esc(f('synopsisShort'))}</p>
      <h3 style="font-family:sans-serif;color:#1A4527">Synopsis long</h3>
      <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${esc(f('synopsisLong'))}</p>
      <h3 style="font-family:sans-serif;color:#1A4527">Biographie du réalisateur</h3>
      <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${esc(f('directorBio'))}</p>
      <p style="font-family:sans-serif;font-size:13px;color:#6b7280">Pièces jointes : ${mailAttachments.map((a) => esc(a.filename)).join(', ') || 'aucune'}</p>
    `;

    await transport.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: f('email'),
      subject: `🎬 Inscription film — ${f('filmTitle')} (${f('director')})`,
      html,
      attachments: mailAttachments,
    });

    return json({ ok: true });
  } catch (err) {
    console.error('[film-submission] erreur :', err);
    return json({ ok: false, error: 'Erreur serveur. Réessayez plus tard.' }, 500);
  }
}
