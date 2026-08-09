import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "sanonsteve1@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || "";
const MAIL_TO = process.env.MAIL_TO || SMTP_USER;
const MAIL_FROM =
  process.env.MAIL_FROM || `HARMONYA MEDICAL <${SMTP_USER}>`;

function getTransporter() {
  if (!SMTP_PASS) {
    throw new Error("SMTP_PASS_missing");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendContactNotification(input: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  locale?: string;
}) {
  const transporter = getTransporter();
  const subjectLabels: Record<string, string> = {
    partnership: "Partenariat",
    services: "Services",
    products: "Produits",
    training: "Formation",
    other: "Autre",
  };

  const subjectLabel = subjectLabels[input.subject] || input.subject;

  await transporter.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    replyTo: input.email,
    subject: `[Contact HARMONYA] ${subjectLabel} — ${input.name}`,
    text: [
      "Nouveau message via le formulaire de contact",
      "",
      `Nom : ${input.name}`,
      `Email : ${input.email}`,
      `Téléphone : ${input.phone || "—"}`,
      `Organisation : ${input.company || "—"}`,
      `Sujet : ${subjectLabel}`,
      `Langue : ${input.locale || "—"}`,
      "",
      "Message :",
      input.message,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#071a3d">
        <h2 style="margin:0 0 12px">Nouveau message — HARMONYA MEDICAL</h2>
        <p><strong>Nom :</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(input.email)}</p>
        <p><strong>Téléphone :</strong> ${escapeHtml(input.phone || "—")}</p>
        <p><strong>Organisation :</strong> ${escapeHtml(input.company || "—")}</p>
        <p><strong>Sujet :</strong> ${escapeHtml(subjectLabel)}</p>
        <p><strong>Langue :</strong> ${escapeHtml(input.locale || "—")}</p>
        <hr style="border:none;border-top:1px solid #dce3ee;margin:16px 0" />
        <p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
      </div>
    `,
  });
}

export async function sendNewsletterNotification(input: {
  email: string;
  locale?: string;
}) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    replyTo: input.email,
    subject: `[Newsletter HARMONYA] Nouvelle inscription — ${input.email}`,
    text: [
      "Nouvelle inscription newsletter",
      "",
      `Email : ${input.email}`,
      `Langue : ${input.locale || "—"}`,
      `Date : ${new Date().toISOString()}`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#071a3d">
        <h2 style="margin:0 0 12px">Nouvelle inscription newsletter</h2>
        <p><strong>Email :</strong> ${escapeHtml(input.email)}</p>
        <p><strong>Langue :</strong> ${escapeHtml(input.locale || "—")}</p>
      </div>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
