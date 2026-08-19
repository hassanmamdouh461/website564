// Pre-commit sanity check: every inline <script> must parse as JS and every
// application/ld+json block must parse as JSON. Run: node validate.js
const fs = require('fs');
const path = require('path');

// Paths resolve against the repo root, not the caller's working directory, so
// this runs the same from the root or from inside tools/.
const root = path.join(__dirname, '..');
const at = (p) => path.join(root, p);

const files = ['index.html', 'ar.html', '404.html'];
let failures = 0;

function blocks(html) {
  const out = [];
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) out.push({ attrs: m[1], body: m[2], index: m.index });
  return out;
}

function lineOf(html, index) {
  return html.slice(0, index).split('\n').length;
}

for (const file of files) {
  const html = fs.readFileSync(at(file), 'utf8');
  let js = 0, ld = 0;

  for (const b of blocks(html)) {
    const line = lineOf(html, b.index);
    if (/\bsrc\s*=/.test(b.attrs)) continue;

    if (/application\/ld\+json/i.test(b.attrs)) {
      ld++;
      try {
        JSON.parse(b.body);
      } catch (e) {
        failures++;
        console.log(`FAIL ${file}:${line} JSON-LD — ${e.message}`);
      }
    } else {
      js++;
      try {
        new Function(b.body);
      } catch (e) {
        failures++;
        console.log(`FAIL ${file}:${line} script — ${e.message}`);
      }
    }
  }

  // Section id balance: each <section id> must have a matching </section>.
  // Comments are stripped first so prose mentioning <section> does not count.
  const stripped = html.replace(/<!--[\s\S]*?-->/g, '');
  const openSections = (stripped.match(/<section\b/g) || []).length;
  const closeSections = (stripped.match(/<\/section\s*>/g) || []).length;
  if (openSections !== closeSections) {
    failures++;
    console.log(`FAIL ${file} — <section> ${openSections} vs </section> ${closeSections}`);
  }

  console.log(`${file}: ${js} scripts OK, ${ld} JSON-LD OK, ${openSections} sections balanced`);
}

// Standalone JSON files must parse too.
for (const file of ['manifest.json', 'tools/paccinos-data.json']) {
  try {
    JSON.parse(fs.readFileSync(at(file), 'utf8'));
    console.log(`${file}: valid JSON`);
  } catch (e) {
    failures++;
    console.log(`FAIL ${file} — ${e.message}`);
  }
}

if (failures) {
  console.log(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll checks passed.');
