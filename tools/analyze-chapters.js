const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'products', 'courses', 'lessons');
const files = [];

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory() && f !== 'diagrams') walk(p);
    else if (f.startsWith('chapter-') && f.endsWith('.html')) files.push(p);
  }
}

walk(root);

const issues = [];
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const rel = path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/');
  const checks = {
    deeper: /Deeper Dive/.test(html),
    advanced: />Advanced</.test(html) || />Advanced Concepts</.test(html),
    vocabCss: /\.vocab \{/.test(html),
    vocabClick: /scrollToVocabulary/.test(html),
    vocabTable: /id="vocabulary"/.test(html),
    vocabTableClass: /class="vocab-table/.test(html),
    howItWorks: /id="how-it-works"/.test(html),
  };
  const missing = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) issues.push({ rel, missing });
}

console.log('Total:', files.length);
console.log('Need work:', issues.length);
issues.forEach((i) => console.log(i.rel, '->', i.missing.join(', ')));
