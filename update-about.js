const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// ========== 1. UPDATE ABOUT SECTION ==========
const oldAbout = h.match(/<section id="about"[\s\S]*?<\/section>/);
if (oldAbout) {
  const newAbout = `<section id="about" class="bg-espresso text-white py-24 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="reveal font-heading text-4xl md:text-5xl font-bold mb-4">عن باتشينوس</h2>
      <div class="reveal w-20 h-1 bg-caramel mx-auto mb-10 rounded-full"></div>

      <!-- Bio from Instagram -->
      <p class="reveal reveal-delay-1 text-lg md:text-xl text-cream/90 leading-relaxed mb-6">
        "Crafted To Be Remembered ✨" — مطعم إيطالي ومقهى في قلب المنيا.<br>
        باتشينوس عشرة من ٢٠١٠، بنقدم قهوة مختصة وأكل إيطالي بجودة عالية.
      </p>

      <!-- Stats -->
      <div class="reveal reveal-delay-2 grid grid-cols-2 gap-8 max-w-lg mx-auto my-10">
        <div class="text-caramel">
          <p class="font-heading text-4xl font-bold">5K+</p>
          <p class="text-cream/70 text-sm mt-1">متابع على إنستجرام</p>
        </div>
        <div class="text-caramel">
          <p class="font-heading text-4xl font-bold">2</p>
          <p class="text-cream/70 text-sm mt-1">فرع في المنيا</p>
        </div>
      </div>

      <!-- Branches -->
      <div class="reveal reveal-delay-3 grid gap-6 md:grid-cols-2 text-right mt-10">
        <div class="bg-white/5 rounded-xl p-6 border border-white/10">
          <p class="text-caramel font-semibold mb-2">📍 فرع طه حسين</p>
          <p class="text-cream/80 text-sm leading-relaxed">شارع طه حسين (أمام وابور النور)<br>ديليفري: <a href="tel:01007811378" class="text-caramel hover:underline" dir="ltr">01007811378</a></p>
        </div>
        <div class="bg-white/5 rounded-xl p-6 border border-white/10">
          <p class="text-caramel font-semibold mb-2">📍 فرع المنيا الجديدة</p>
          <p class="text-cream/80 text-sm leading-relaxed">الحي الثالث — مول كورنر بلازا<br>ديليفري: <a href="tel:01033777117" class="text-caramel hover:underline" dir="ltr">01033777117</a></p>
        </div>
      </div>

      <a href="https://www.instagram.com/paccino_s" target="_blank" rel="noopener"
         class="reveal reveal-delay-3 inline-block mt-10 bg-caramel text-espresso font-semibold px-8 py-3.5 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-md">
        تابعنا على إنستجرام @paccino_s
      </a>
    </div>
  </section>`;
  h = h.replace(oldAbout[0], newAbout);
}

fs.writeFileSync('index.html', h, 'utf8');
console.log('About updated:', h.includes('عن باتشينوس'), '| 5K+:', h.includes('5K+'), '| 2 branches:', h.includes('فرع المنيا الجديدة'));
console.log('IG links count:', (h.match(/instagram\.com\/paccino_s/g) || []).length);
