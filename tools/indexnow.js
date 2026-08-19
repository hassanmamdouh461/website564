// Ping IndexNow so Bing, Yandex, Seznam and Naver re-crawl within minutes rather
// than on their own schedule. Google does not participate in IndexNow — for
// Google the equivalent lever is Request Indexing in Search Console, which is a
// manual step.
//
// Usage: node tools/indexnow.js
//
// The key file must stay published at the site root; IndexNow fetches it to
// prove we control the domain, and submissions are rejected without it.

const https = require('https');

const KEY = '359f423304deeb68bb86305c4be273b9';
const HOST = 'pacinos.engaz.tech';
const URLS = [
  'https://pacinos.engaz.tech/',
  'https://pacinos.engaz.tech/ar.html',
  'https://pacinos.engaz.tech/index.html',
];

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: URLS,
});

// api.indexnow.org fans out to every participating engine, but pinging Bing and
// Yandex directly is a cheap belt-and-braces.
const endpoints = ['api.indexnow.org', 'www.bing.com', 'yandex.com'];

for (const host of endpoints) {
  const req = https.request(
    {
      host,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: 20000,
    },
    (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        // 200 accepted, 202 accepted pending key validation.
        const verdict = res.statusCode === 200 || res.statusCode === 202 ? 'accepted' : 'check';
        console.log(host.padEnd(20), res.statusCode, verdict, body.slice(0, 120).trim());
      });
    }
  );
  req.on('timeout', () => { console.log(host.padEnd(20), 'timeout'); req.destroy(); });
  req.on('error', (e) => console.log(host.padEnd(20), 'error', e.message));
  req.write(payload);
  req.end();
}
