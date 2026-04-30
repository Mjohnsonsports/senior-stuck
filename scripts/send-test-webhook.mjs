import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // Strip wrapping quotes if present.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET (set it in .env.local).');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const findArg = (name) => {
    const idx = args.indexOf(name);
    if (idx === -1) return null;
    return args[idx + 1] ?? null;
  };

  const toEmail = findArg('--email') || args[0] || 'test@example.com';
  const port = findArg('--port') || process.env.PORT || '3000';
  let url =
    findArg('--url') ||
    (args.find((a) => a.startsWith('http://') || a.startsWith('https://')) ?? null) ||
    `http://127.0.0.1:${port}/api/webhook`;

  // Allow passing just an origin like http://localhost:3001
  if (!url.includes('/api/webhook')) {
    url = url.replace(/\/+$/, '') + '/api/webhook';
  }

  const event = {
    id: `evt_test_${Date.now()}`,
    object: 'event',
    api_version: '2026-01-28.clover',
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    type: 'checkout.session.completed',
    data: {
      object: {
        id: `cs_test_local_${Date.now()}`,
        object: 'checkout.session',
        customer_details: { email: toEmail },
        customer_email: null,
        metadata: {},
        subscription: null,
      },
    },
  };

  const payload = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`, 'utf8')
    .digest('hex');
  const stripeSignature = `t=${timestamp},v1=${signature}`;

  console.log('POST', url);
  console.log('Simulating event:', event.type, 'email:', toEmail);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': stripeSignature,
      },
      body: payload,
    });

    const text = await res.text();
    console.log('Response:', res.status, text);
  } catch (err) {
    console.error('Request failed. Is `npm run dev` running on this URL/port?', url);
    throw err;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
