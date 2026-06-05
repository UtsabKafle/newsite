/**
 * Remove trailing auto-generated Deeper Dive/Advanced template blocks
 * when the chapter already has substantive custom h3 sections.
 */
const fs = require('fs');
const path = require('path');

const LESSONS_DIR = path.join(__dirname, '..', 'products', 'courses', 'lessons');
const GENERIC_DEEPER_MARKER = "let's connect the pieces.";

function walk(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory() && f !== 'diagrams') files.push(...walk(p));
    else if (f.startsWith('chapter-') && f.endsWith('.html')) files.push(p);
  }
  return files;
}

function cleanup(html) {
  const sectionRegex = /(<section[^>]+id="how-it-works"[\s\S]*?<div class="glass-panel[^"]*">)([\s\S]*?)(<\/div>\s*<\/section>)/i;
  const match = html.match(sectionRegex);
  if (!match) return html;

  let inner = match[2];
  if (!inner.includes(GENERIC_DEEPER_MARKER)) return html;

  const markerIndex = inner.indexOf(GENERIC_DEEPER_MARKER);
  const beforeMarker = inner.slice(0, markerIndex);
  const customH3Count = (beforeMarker.match(/<h3/gi) || []).length;

  // Chapter already has labelled or multiple custom subsections — drop auto-generated tail
  const hasLabelledDeeper = /Deeper Dive/.test(beforeMarker);
  if (customH3Count >= 2 || hasLabelledDeeper) {
    const genericStart = beforeMarker.lastIndexOf('<h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Deeper Dive</h3>');
    if (genericStart !== -1) {
      inner = inner.slice(0, genericStart).trimEnd();
    }
  }

  inner = inner.replace(/what is a ([^?]+)\? involves/gi, '$1 involves');
  inner = inner.replace(/what is ([^?]+)\? involves/gi, '$1 involves');

  return html.replace(sectionRegex, `${match[1]}${inner}${match[3]}`);
}

let count = 0;
for (const file of walk(LESSONS_DIR)) {
  const original = fs.readFileSync(file, 'utf8');
  const updated = cleanup(original);
  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8');
    count++;
    console.log('Fixed:', path.relative(LESSONS_DIR, file));
  }
}
console.log(`Cleaned ${count} files.`);
