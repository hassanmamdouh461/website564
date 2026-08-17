/**
 * Tailwind build config. The site used the CDN script (cdn.tailwindcss.com),
 * which ships a 400 KB JIT compiler that blocks rendering and generates the CSS
 * in the browser on every visit. This config drives a one-off build into
 * tailwind.css instead, so the pages ship only the classes they actually use.
 *
 * Rebuild after changing markup:
 *   npm install --no-save tailwindcss@3.4.17
 *   ./node_modules/.bin/tailwindcss -i tailwind.src.css -o tailwind.css --minify
 *
 * Call the local binary, NOT `npx tailwindcss`: this machine has a global
 * @tailwindcss/cli v4 that npx picks first, and v4 ignores this v3-style config
 * (it produced a 6.5 KB file missing every utility the markup needs).
 *
 * Keep the theme tokens identical to what the CDN config declared, or the
 * rendered colours and fonts will shift.
 */
module.exports = {
  content: ['./index.html', './ar.html', './404.html'],
  theme: {
    extend: {
      colors: {
        espresso: '#3D0A17',
        cream: '#FAF6F0',
        caramel: '#EAD5C1',
      },
      fontFamily: {
        // index.html and ar.html declared slightly different stacks; Cairo is
        // included in both heading stacks so Arabic headings never fall back to
        // a generic serif.
        heading: ['"Playfair Display"', '"Cairo"', 'serif'],
        body: ['"Cairo"', '"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
