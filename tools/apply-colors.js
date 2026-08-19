const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// ==================== 1. COLORS ====================
h = h.replace(/espresso: '#3B1F2B'/, "espresso: '#3D0A17'");
h = h.replace(/cream: '#F5EFE9'/, "cream: '#FAF6F0'");
h = h.replace(/caramel: '#C9782C'/, "caramel: '#EAD5C1'");

// ==================== 2. CSS VARIABLES ====================
const cssVars = `<style>
    :root {
      /* Brand Color Palette */
      --color-primary: #5C1425;
      --color-primary-dark: #3D0A17;
      --color-accent: #EAD5C1;
      --color-accent-hover: #F5E4D3;
      --color-bg-light: #FAF6F0;
      --color-bg-dark: #2B0610;
      --color-text-light: #EAD5C1;
      --color-text-dark: #2B0610;
      --border-cream: rgba(234, 213, 193, 0.3);
      --shadow-subtle: 0 10px 30px rgba(61, 10, 23, 0.15);
    }

    body {
      background-color: var(--color-primary);
      color: var(--color-text-light);
      font-family: 'Cairo', 'Inter', system-ui, sans-serif;
    }

    /* ================== REVEAL ANIMATIONS ================== */
    .reveal { opacity: 0; transform: translateY(2.5rem); transition: opacity 0.8s ease, transform 0.8s ease; will-change: opacity, transform; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: 0.1s; }
    .reveal-delay-2 { transition-delay: 0.2s; }
    .reveal-delay-3 { transition-delay: 0.3s; }

    /* ================== COMPONENTS ================== */
    header { background-color: var(--color-primary); }

    .btn-primary {
      background-color: var(--color-primary); color: var(--color-accent);
      border: 1.5px solid var(--color-accent); padding: 12px 24px;
      border-radius: 8px; transition: all 0.3s ease; font-weight: 600;
    }
    .btn-primary:hover {
      background-color: var(--color-accent); color: var(--color-primary-dark);
      transform: translateY(-2px); box-shadow: var(--shadow-subtle);
    }

    .menu-dots { flex: 1 1 auto; border-bottom: 2px dotted var(--border-cream); margin: 0 0.75rem; transform: translateY(-0.35rem); }

    .floating-btn {
      position: fixed; bottom: 24px; left: 24px;
      width: 60px; height: 60px; border-radius: 50%;
      background: #25D366; color: white; display: flex;
      align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
      transition: all 0.3s ease; z-index: 9999; text-decoration: none;
    }
    .floating-btn:hover { transform: scale(1.1); box-shadow: 0 8px 30px rgba(37, 211, 102, 0.6); background: #128C7E; }

    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--color-primary-dark); }
    ::-webkit-scrollbar-thumb { background: var(--color-accent); border-radius: 4px; }
  </style>`;

h = h.replace(/<style>[\s\S]*?<\/style>/, cssVars);

// ==================== 3. REMOVE STATS + BIO FROM ABOUT ====================
const aboutMatch = h.match(/<section id="about"[\s\S]*?<\/section>/);
if (aboutMatch) {
  const newAbout = aboutMatch[0]
    .replace(/<!-- Bio from Instagram -->[\s\S]*?<p[^>]*>[\s\S]*?<\/p>/, '<!-- Bio removed by user request -->')
    .replace(/<!-- Stats -->[\s\S]*?<div class="reveal reveal-delay-2[^>]*>[\s\S]*?<\/div>/, '');
  h = h.replace(aboutMatch[0], newAbout);
}

fs.writeFileSync('index.html', h, 'utf8');
console.log('Done. Colors:', ['5C1425','3D0A17','EAD5C1','FAF6F0'].filter(c => h.includes(c)));
