import { getTransport, MAIL_TO, MAIL_FROM, esc, emailLayout, infoTable, messageBlock, noteBox } from '../../lib/mailer.js';

export const prerender = false;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function POST({ request }) {
  try {
    const form = await request.formData();
    if ((form.get('website') || '').toString().trim()) return json({ ok: true }); // honeypot
    const f = (k) => (form.get(k) || '').toString().trim();
    const type = f('type') === 'newsletter' ? 'newsletter' : 'contact';

    const transport = getTransport();
    if (!transport) {
      console.error('[contact] SMTP non configuré');
      return json({ ok: false, error: "Le service d'envoi n'est pas encore configuré. Réessayez plus tard ou écrivez à festival@ziffa.sn." }, 503);
    }

    if (type === 'newsletter') {
      const email = f('email');
      if (!email) return json({ ok: false, error: 'Merci d’indiquer votre email.' }, 400);
      await transport.sendMail({
        from: MAIL_FROM, to: MAIL_TO, replyTo: email,
        subject: '📰 Nouvelle inscription newsletter — ZIFFA',
        html: `<p style="font-family:sans-serif">Nouvel abonné à la newsletter :</p><p style="font-family:sans-serif;font-size:16px"><b>${esc(email)}</b></p>`,
      });
      return json({ ok: true });
    }

    // type === 'contact'
    const name = f('name');
    const email = f('email');
    const message = f('message');
    const missing = [];
    if (!name) missing.push('Nom');
    if (!email) missing.push('Email');
    if (!message) missing.push('Message');
    if (missing.length) return json({ ok: false, error: 'Champs obligatoires manquants : ' + missing.join(', ') }, 400);

    const html = emailLayout({
      barColor: '#E8B547', pillBg: '#EAF3DE', pillText: '#1A4527',
      badge: 'Nouveau message de contact',
      title: `${name} vous a écrit`,
      subtitle: 'Reçu via le formulaire de contact du site',
      preheader: message.slice(0, 90),
      content:
        infoTable([['Nom', name], ['Email', email], ['Sujet', f('subject')]]) +
        messageBlock('Message', message) +
        noteBox(`Répondez directement à cet email pour écrire à ${name}.`),
    });

    await transport.sendMail({
      from: MAIL_FROM, to: MAIL_TO, replyTo: email,
      subject: `✉️ Contact — ${f('subject') || 'Message'} (${name})`,
      html,
    });

    return json({ ok: true });
  } catch (err) {
    console.error('[contact] erreur :', err);
    return json({ ok: false, error: 'Erreur serveur. Réessayez plus tard.' }, 500);
  }
}
