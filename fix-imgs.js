const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// === Better, varied Unsplash images matching Paccino's vibe (green/olive cafe) ===
const betterImgs = [
  // Hero: dark moody cafe
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=85',
  // Latte art with warm tones
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  // Pasta
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
  // Pizza
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
  // Coffee cup on wooden table
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  // Croissant (pastry)
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
  // Cafe interior with plants (matches green theme)
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
  // Espresso shot being pulled
  'https://images.unsplash.com/photo-1572470177720-826a08fe4d07?auto=format&fit=crop&w=800&q=80',
  // Barista pouring
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
  // Dessert/cake with coffee
  'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80'
];

// Replace ALL Facebook CDN images with high-quality Unsplash
const fbRe = /https:\/\/scontent-mrs[^"'\s)]+/g;
let count = 0;
h = h.replace(fbRe, () => betterImgs[count++ % betterImgs.length]);

// Fix the photos array: ensure each image is used once for gallery and cards, cycle for rest
// Cards: first 3 = signature picks, next 6 = gallery
const sigUrls = betterImgs.slice(1, 4);   // latte, pasta, pizza
const galleryUrls = betterImgs.slice(4, 10); // coffee, pastry, interior, espresso, barista, dessert

// Set signature card images explicitly (in order: latte, pasta, pizza)
const sigSectionRe = /(<article class="reveal reveal-delay-[^"]+ bg-white[^"]*">\s*<img src=")[^"]*(" alt="[^"]*"[^>]*>)/g;
let sigIdx = 0;
h = h.replace(sigSectionRe, (m, p1, p2) => {
  const alt = p2.match(/alt="([^"]*)"/)[1];
  let img = '';
  if (alt.includes('لاتيه')) img = sigUrls[0];
  else if (alt.includes('باستا')) img = sigUrls[1];
  else if (alt.includes('بيتزا')) img = sigUrls[2];
  return img ? (p1 + img + p2) : m;
});

// Set gallery images explicitly (6 unique)
const galleryRe = /(src=")[^"]*(" alt="Paccino's" loading="lazy"\s*class="reveal)/g;
let galIdx = 0;
h = h.replace(galleryRe, (m, p1, p2) => p1 + galleryUrls[galIdx++ % galleryUrls.length] + p2);

// Update data file
fs.writeFileSync('paccinos-data.json', JSON.stringify({
  ...JSON.parse(fs.readFileSync('paccinos-data.json', 'utf8')),
  photos: betterImgs
}, null, 2), 'utf8');

fs.writeFileSync('index.html', h, 'utf8');
const fbLeft = (h.match(/scontent/g) || []).length;
const unspCount = (h.match(/images\.unsplash/g) || []).length;
console.log('FB CDN left:', fbLeft, '| Unsplash used:', unspCount);
console.log('Hero img:', h.match(/src="(https:\/\/[^"]*1501339847302[^"]*)/)?.[1]?.slice(0, 60) + '...');
