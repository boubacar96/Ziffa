import { getTransport, MAIL_TO, MAIL_FROM, esc, emailLayout, infoTable, messageBlock, noteBox } from '../../lib/mailer.js';

export const prerender = false;

const MAX_TOTAL_BYTES = 22 * 1024 * 1024; // ~22 Mo de pièces jointes max

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
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

    const attachNames = mailAttachments.map((a) => a.filename).join(', ') || 'aucune';
    const html = emailLayout({
      barColor: '#D63832', pillBg: '#FBE9E8', pillText: '#D63832',
      badge: 'Nouvelle inscription de film',
      title: `« ${f('filmTitle')} »`,
      subtitle: `Réalisé par ${f('director')} — reçu via « Inscrire un film »`,
      preheader: `${f('filmTitle')} — ${f('director')} (${f('country') || '—'})`,
      content:
        infoTable([
          ['Réalisateur', f('director')],
          ['Email', f('email')],
          ['Téléphone', f('phone')],
          ['Pays', f('country')],
          ['Année', f('productionYear')],
          ['Durée', f('duration')],
          ['Catégorie', f('category')],
          ['Langue / sous-titres', f('language')],
          ['Lien de visionnage', f('viewingLink')],
          ['Mot de passe du lien', f('viewingPassword')],
        ]) +
        messageBlock('Synopsis court', f('synopsisShort')) +
        messageBlock('Synopsis long', f('synopsisLong')) +
        messageBlock('Biographie du réalisateur', f('directorBio')) +
        noteBox(`${mailAttachments.length} pièce(s) jointe(s) : ${attachNames}`, 'attach') +
        noteBox(`Répondez directement à cet email pour écrire à ${f('director')}.`),
    });

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
