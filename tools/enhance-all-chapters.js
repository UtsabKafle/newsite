/**
 * Standardize all course chapters to match Module 1 Chapter 1 structure:
 * - How It Works / Deeper Dive / Advanced sections
 * - Vocabulary table with vocab-table class and row IDs
 * - Blue clickable vocab terms linking to vocabulary table
 */
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const LESSONS_DIR = path.join(BASE_DIR, 'products', 'courses', 'lessons');

const VOCAB_STYLES = `
    .vocab-table th {
      background: rgba(9, 89, 200, 0.12);
      font-weight: 600;
      text-align: left;
      padding: 0.75rem 1rem;
    }
    .vocab-table td {
      padding: 0.75rem 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .vocab-table tr:hover td {
      background: rgba(9, 89, 200, 0.04);
    }
    .vocab { color: #3b82f6; font-weight: 500; }`;

function termToId(term) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getTermRegexPattern(term) {
  const escaped = term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  let bodyPattern;
  const lower = term.toLowerCase();
  if (lower.endsWith('y')) {
    bodyPattern = `${escaped.slice(0, -1)}(y|ies|y's)`;
  } else if (/[sxz]$/.test(lower) || lower.endsWith('ch') || lower.endsWith('sh')) {
    bodyPattern = `${escaped}(es|'s)?`;
  } else {
    bodyPattern = `${escaped}(s|'s)?`;
  }
  return `(?<=^|\\W)(${bodyPattern})(?=$|\\W)`;
}

function extractTitle(html) {
  const m = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  return m ? m[1].trim() : 'this topic';
}

function cleanTopic(title) {
  let t = title.replace(/\?+$/, '').trim();
  t = t.replace(/^what is\s+/i, '').replace(/^introduction to\s+/i, '').replace(/^understanding\s+/i, '');
  return t || title.replace(/\?+$/, '').trim();
}

function extractTermsFromVocabSection(html) {
  const sectionMatch = html.match(/<section[^>]+id="vocabulary"[\s\S]*?<\/section>/i);
  if (!sectionMatch) return [];
  const tableMatch = sectionMatch[0].match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return [];

  const terms = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let row;
  while ((row = rowRegex.exec(tableMatch[1])) !== null) {
    if (/<th/i.test(row[1])) continue;
    const cells = row[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
    if (!cells || cells.length < 2) continue;
    const term = cells[0].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (term && !/^example term$/i.test(term)) terms.push(term);
  }
  return terms;
}

function fixVocabTable(html) {
  const sectionRegex = /(<section[^>]+id="vocabulary"[\s\S]*?)(<table)([^>]*)(>)([\s\S]*?)(<\/table>)([\s\S]*?<\/section>)/i;
  const match = html.match(sectionRegex);
  if (!match) return { html, terms: [] };

  const tableBody = match[5];
  const terms = [];
  const rows = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let row;
  while ((row = rowRegex.exec(tableBody)) !== null) {
    if (/<th/i.test(row[1])) {
      rows.push(row[0]);
      continue;
    }
    const cells = row[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
    if (!cells || cells.length < 2) continue;
    let term = cells[0].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const definition = cells[1].replace(/^<td[^>]*>/i, '').replace(/<\/td>$/i, '').trim();
    if (!term || /^example term$/i.test(term)) continue;
    terms.push(term);
    const wordId = termToId(term);
    rows.push(
      `<tr id="vocab-${wordId}"><td><span class="vocab">${term}</span></td><td>${definition}</td></tr>`
    );
  }

  if (!terms.length) return { html, terms: [] };

  const newTable = `${match[2]} class="vocab-table w-full text-sm"${match[4]}\n                <thead>\n                  <tr>\n                    <th class="text-theme">Term</th>\n                    <th class="text-theme">Definition</th>\n                  </tr>\n                </thead>\n                <tbody class="text-theme-muted">\n                  ${rows.filter((r) => !/<th/i.test(r)).join('\n                  ')}\n                </tbody>\n              ${match[6]}`;

  const newSection = `${match[1]}${newTable}${match[7]}`;
  html = html.replace(sectionRegex, newSection);
  return { html, terms };
}

function ensureVocabStyles(html) {
  if (html.includes('.vocab {') && html.includes('.vocab-table th')) return html;
  const styleBlock = VOCAB_STYLES;
  if (html.includes('</style>')) {
    if (!html.includes('.vocab {')) {
      html = html.replace('</style>', `${styleBlock}\n  </style>`);
    } else if (!html.includes('.vocab-table th')) {
      html = html.replace(
        '.vocab { color: #3b82f6; font-weight: 500; }',
        styleBlock.trim()
      );
    }
  } else if (html.includes('</head>')) {
    html = html.replace('</head>', `  <style>${styleBlock}\n  </style>\n</head>`);
  }
  return html;
}

function buildDeeperDive(title, terms) {
  const topic = cleanTopic(title);
  const t = terms.slice(0, 4);
  const a = t[0] || 'the main idea';
  const b = t[1] || 'related parts';
  const c = t[2] || 'the system';
  return `
            <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Deeper Dive</h3>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              Now that you understand the basics of ${topic.toLowerCase()}, let's connect the pieces. ${a} is one of the most important ideas in this chapter. It works together with ${b} to make the whole system run smoothly.
            </p>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              Think of ${c} like a team where every member has a specific job. When one part sends information, another part receives it, checks it, and passes it along. This step-by-step teamwork is what makes technology reliable, even when many devices are involved.
            </p>
            <div class="mt-5 p-4 rounded-xl bg-brand-500/[0.03] border border-brand-500/10">
              <p class="text-sm font-semibold text-brand-200 mb-2">Key Insight</p>
              <p class="text-sm text-theme-muted">Understanding how ${a} and ${b} connect helps you explain ${topic.toLowerCase()} to a friend using your own words — not just memorizing definitions.</p>
            </div>`;
}

function buildAdvanced(title, terms) {
  const topic = cleanTopic(title);
  const t = terms.slice(0, 4);
  const a = t[0] || 'core components';
  const b = t[1] || 'data flow';
  const c = t[2] || 'system design';
  return `
            <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Advanced</h3>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              At a deeper level, ${topic.toLowerCase()} involves rules and patterns that engineers use worldwide. ${a} follows standards so different brands and devices can still work together. That is why your phone, school laptop, and game console can all connect to the same network or use the same apps.
            </p>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              ${b} does not happen in a straight line. Systems often use backup paths, error checking, and retries so information arrives correctly. When something fails, smart ${c} design helps the system recover instead of shutting down completely.
            </p>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              Scientists and engineers keep improving these systems every year — making them faster, safer, and more energy-efficient. The ideas you learn in this chapter are the same building blocks used in real data centers, robots, apps, and websites around the world.
            </p>`;
}

function restructureHowItWorks(html, title, terms) {
  const sectionRegex = /(<section[^>]+id="how-it-works"[\s\S]*?<div class="glass-panel[^"]*">)([\s\S]*?)(<\/div>\s*<\/section>)/i;
  const match = html.match(sectionRegex);
  if (!match) return html;

  let inner = match[2];

  // Normalize heading labels
  inner = inner.replace(
    /<h3([^>]*)>\s*Level\s*2[^<]*<\/h3>/gi,
    '<h3$1>Deeper Dive</h3>'
  );
  inner = inner.replace(
    /<h3([^>]*)>\s*Level\s*3[^<]*<\/h3>/gi,
    '<h3$1>Advanced</h3>'
  );
  inner = inner.replace(
    /<h3([^>]*)>\s*Packets for Intermediate Learners\s*<\/h3>/gi,
    '<h3$1>Deeper Dive</h3>'
  );
  inner = inner.replace(
    /<h3([^>]*)>\s*Packet Switching: A Technical Deep Dive\s*<\/h3>/gi,
    '<h3$1>Advanced</h3>'
  );
  inner = inner.replace(
    /<h3([^>]*)>\s*Advanced Concepts\s*<\/h3>/gi,
    '<h3$1>Advanced</h3>'
  );
  inner = inner.replace(
    /<h3([^>]*)>\s*Advanced System Health[^<]*<\/h3>/gi,
    '<h3$1>Advanced</h3>'
  );

  const hasDeeper = /Deeper Dive/.test(inner);
  const hasAdvanced = />Advanced</.test(inner);

  // Label content after <hr> separators as Deeper Dive / Advanced
  if (!hasDeeper && /<hr/i.test(inner)) {
    let hrCount = 0;
    inner = inner.replace(/<hr[^>]*>/gi, (hr) => {
      hrCount++;
      if (hrCount === 1) {
        return `${hr}\n            <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Deeper Dive</h3>`;
      }
      if (hrCount === 2 && !hasAdvanced) {
        return `${hr}\n            <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Advanced</h3>`;
      }
      return hr;
    });
  }

  const h3Count = (inner.match(/<h3/gi) || []).length;
  const hasRichContent = inner.length > 2800 && h3Count >= 2;

  // Rename first non-Deeper/Advanced h3 block to Deeper Dive when content exists but label is missing
  if (!/Deeper Dive/.test(inner) && h3Count >= 1) {
    inner = inner.replace(
      /<h3([^>]*)>(?!Deeper Dive|Advanced)([^<]+)<\/h3>/i,
      '<h3$1>Deeper Dive</h3>'
    );
  }

  // If still missing Deeper Dive and section is not already rich, append generated section
  if (!/Deeper Dive/.test(inner) && !hasRichContent) {
    inner = inner.trimEnd() + buildDeeperDive(title, terms);
  }

  // If missing Advanced, append generated section
  if (!/>Advanced</.test(inner)) {
    inner = inner.trimEnd() + buildAdvanced(title, terms);
  }

  const newSection = `${match[1]}${inner}${match[3]}`;
  return html.replace(sectionRegex, newSection);
}

function linkVocabulary(html, terms) {
  if (!terms.length) return html;

  html = html.replace(/<span class="vocab[^>]*>([^<]+)<\/span>/g, '$1');
  const sorted = [...terms].sort((a, b) => b.length - a.length);

  if (!html.includes('.vocab {')) {
    html = ensureVocabStyles(html);
  }

  const parts = html.split(/(<[^>]+>)/g);
  const tagStack = [];
  const excludedTags = new Set([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'script', 'style', 'head', 'title', 'meta', 'link',
    'button', 'select', 'option', 'textarea', 'thead',
  ]);

  // Only link inside how-it-works, vocabulary, and body content sections
  const linkableSectionIds = new Set([
    'how-it-works', 'vocabulary', 'definition', 'introduction',
    'real-life-example', 'fun-facts', 'misconceptions', 'visual-learning',
    'knowledge-check', 'critical-thinking', 'mini-projects', 'teacher-notes',
  ]);
  let inLinkableSection = false;
  let sectionDepth = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('<')) {
      const sectionOpen = part.match(/^<section[^>]+id="([^"]+)"/i);
      if (sectionOpen) {
        inLinkableSection = linkableSectionIds.has(sectionOpen[1]);
        sectionDepth = 1;
      } else if (/^<section/i.test(part)) {
        inLinkableSection = false;
        sectionDepth = 1;
      } else if (/^<\/section/i.test(part)) {
        inLinkableSection = false;
        sectionDepth = 0;
      }

      const isClosing = part.startsWith('</');
      const isSelfClosing = part.endsWith('/>');
      const tagMatch = part.match(/^<\/?([a-zA-Z0-9:-]+)/);
      if (tagMatch) {
        const tagName = tagMatch[1].toLowerCase();
        if (!isSelfClosing) {
          if (isClosing) {
            const idx = tagStack.lastIndexOf(tagName);
            if (idx !== -1) tagStack.splice(idx);
          } else {
            tagStack.push(tagName);
          }
        }
      }
    } else if (inLinkableSection && part.trim().length > 0) {
      const hasExcluded = tagStack.some((t) => excludedTags.has(t));
      if (!hasExcluded) {
        let text = part;
        const placeholders = {};
        let plIndex = 0;

        for (const term of sorted) {
          const regex = new RegExp(getTermRegexPattern(term), 'gi');
          text = text.replace(regex, (m) => {
            const plKey = `__VOCAB_PL_${plIndex}__`;
            const wordId = termToId(term);
            placeholders[plKey] =
              `<span class="vocab cursor-pointer" onclick="scrollToVocabulary('${wordId}')">${m}</span>`;
            plIndex++;
            return plKey;
          });
        }

        for (const [plKey, replacement] of Object.entries(placeholders)) {
          text = text.replaceAll(plKey, replacement);
        }
        parts[i] = text;
      }
    }
  }

  return parts.join('');
}

function processChapter(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;
  const rel = path.relative(BASE_DIR, filePath).replace(/\\/g, '/');

  html = ensureVocabStyles(html);
  const title = extractTitle(html);
  const { html: withTable, terms } = fixVocabTable(html);
  html = withTable;
  const allTerms = terms.length ? terms : extractTermsFromVocabSection(html);
  html = restructureHowItWorks(html, title, allTerms);
  html = linkVocabulary(html, allTerms);

  // Re-link vocabulary table terms with click handlers
  for (const term of allTerms) {
    const wordId = termToId(term);
    const rowRegex = new RegExp(
      `(<tr id="vocab-${wordId}"><td><span class=")vocab(">${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</span></td>)`,
      'i'
    );
    html = html.replace(
      rowRegex,
      `$1vocab"><span class="vocab cursor-pointer" onclick="scrollToVocabulary('${wordId}')">${term}</span></span></td>`
    );
  }

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Enhanced: ${rel}`);
    return true;
  }
  return false;
}

function walk(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory() && f !== 'diagrams') {
      files.push(...walk(p));
    } else if (f.startsWith('chapter-') && f.endsWith('.html')) {
      files.push(p);
    }
  }
  return files;
}

const chapters = walk(LESSONS_DIR);
let count = 0;
for (const f of chapters) {
  if (processChapter(f)) count++;
}
console.log(`Done. Updated ${count} of ${chapters.length} chapters.`);
