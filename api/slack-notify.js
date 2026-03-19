// api/slack-notify.js — Vercel Serverless Function
// Receives email from monzyai.com form and posts to Slack #website-signup

const FREE_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'icloud.com', 'live.com', 'aol.com', 'protonmail.com',
];

function isWorkEmail(email) {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1];
  return domain && !FREE_DOMAINS.includes(domain.toLowerCase());
}

export default async function handler(req, res) {
  // CORS — allow production origins and localhost for dev
  const allowedOrigins = [
    'https://monzyai.com',
    'https://www.monzyai.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8084',
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  // Server-side validation (mirrors frontend checks)
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (!isWorkEmail(email)) {
    return res.status(400).json({ error: 'Please provide a work email address.' });
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('SLACK_WEBHOOK_URL is not configured');
    return res.status(200).json({ ok: true });
  }

  // Build Slack Block Kit message
  const domain = email.split('@')[1];
  const timestamp = new Date().toISOString();

  const slackPayload = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '\u{1F680} New Demo Request',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Email:*\n${email}` },
          { type: 'mrkdwn', text: `*Company Domain:*\n${domain}` },
        ],
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Source:*\nmonzyai.com` },
          { type: 'mrkdwn', text: `*Submitted At:*\n${timestamp}` },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'Submitted via monzyai.com demo request form',
          },
        ],
      },
    ],
  };

  try {
    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    });

    if (!slackRes.ok) {
      console.error('Slack webhook failed:', slackRes.status, await slackRes.text());
    }
  } catch (err) {
    console.error('Slack webhook error:', err.message);
  }

  // Always return success — Slack failures are internal, never shown to user
  return res.status(200).json({ ok: true });
}
