const { onRequest } = require("firebase-functions/v2/https");
const { Resend } = require("resend");
const cors = require("cors")({ origin: true });
const { defineSecret } = require("firebase-functions/params");

// 🔑 link the secrets
const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const FROM_EMAIL = defineSecret("FROM_EMAIL");
const TO_EMAIL = defineSecret("TO_EMAIL");

exports.sendEmail = onRequest(
  { secrets: [RESEND_API_KEY, FROM_EMAIL, TO_EMAIL] }, // <--- add here
  async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      const { name, email, message } = req.body || {};
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing fields" });
      }

      try {
        const resend = new Resend(RESEND_API_KEY.value());

        await resend.emails.send({
          from: FROM_EMAIL.value(),
          to: TO_EMAIL.value(),
          reply_to: email,
          subject: `Portfolio Contact — ${name}`,
          html: `
            <h2>New message from your portfolio</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p style="white-space:pre-wrap"><strong>Message:</strong><br>${escapeHtml(message)}</p>
          `,
        });

        res.json({ ok: true });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send email" });
      }
    });
  }
);

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}
