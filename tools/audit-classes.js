// One-off audit: every Tailwind class used in the markup must exist in the
// built stylesheet, otherwise dropping the CDN would silently change the design.
// Classes defined in each page's own <style> block are not Tailwind's job, so
// they are resolved against that inline CSS instead.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const at = (p) => path.join(root, p);

const css = fs.readFileSync(at('tailwind.css'), 'utf8');

// Tailwind escapes these characters when it emits selectors.
function escapeClass(c) {
  return c.replace(/[.:/[\]()%,#!]/g, (m) => '\\' + m);
}

// Classes that carry no styling at all — they exist purely as JS query hooks.
const JS_HOOKS = new Set(['typewriter']);

let missingTotal = 0;
for (const f of ['index.html', 'ar.html']) {
  const html = fs.readFileSync(at(f), 'utf8');
  const inlineCss = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');

  const used = new Set();
  for (const m of html.matchAll(/class="([^"]+)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c) used.add(c);
  }

  const missing = [];
  for (const c of used) {
    if (JS_HOOKS.has(c)) continue;
    if (css.includes('.' + escapeClass(c))) continue;
    if (inlineCss.includes('.' + c)) continue;
    missing.push(c);
  }

  console.log(f, '| classes used:', used.size, '| unresolved:', missing.length);
  if (missing.length) console.log('  ' + missing.sort().join('\n  '));
  missingTotal += missing.length;
}

if (missingTotal) process.exit(1);
console.log('\nEvery class resolves to either the Tailwind build or the page CSS.');
