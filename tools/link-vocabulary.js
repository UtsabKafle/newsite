const fs = require('fs');
const path = require('path');

const BASE_DIR = 'c:/Users/badhi/OneDrive/Documents/GitHub/newsite';
const LESSONS_DIR = path.join(BASE_DIR, 'products', 'courses', 'lessons');

function getTermRegexPattern(term) {
  const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  let bodyPattern;
  if (term.toLowerCase().endsWith('y')) {
    const stem = escaped.slice(0, -1);
    bodyPattern = `${stem}(y|ies|y's)`;
  } else if (term.toLowerCase().endsWith('s') || term.toLowerCase().endsWith('x') || term.toLowerCase().endsWith('z') || term.toLowerCase().endsWith('ch') || term.toLowerCase().endsWith('sh')) {
    bodyPattern = `${escaped}(es|'s)?`;
  } else {
    bodyPattern = `${escaped}(s|'s)?`;
  }
  return `(?<=^|\\W)(${bodyPattern})(?=$|\\W)`;
}

function processHTML(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const originalHtml = html;
  
  // Strip existing vocab spans to cleanly re-apply them without nesting
  html = html.replace(/<span class="vocab[^>]*>([^<]+)<\/span>/g, '$1');
  
  let modified = false;
  const relPath = path.relative(BASE_DIR, filePath);

  // 1. Fix broken relative footer links
  html = html.replaceAll('href="../../../../ai-systems.html"', 'href="../../../ai-systems.html"');
  html = html.replaceAll('href="../../../../lms.html"', 'href="../../../lms.html"');
  html = html.replaceAll('href="../../../../school-systems.html"', 'href="../../../school-systems.html"');
  html = html.replaceAll('href="../../../../saas-tools.html"', 'href="../../../saas-tools.html"');
  html = html.replaceAll('href="../../../../enterprise.html"', 'href="../../../enterprise.html"');
  // Handle double-dot academy reference
  html = html.replaceAll('href="../../academy.html"', 'href="../../../academy.html"');

  // 2. Find the Vocabulary Table and extract terms
  let vocabTableMatch = html.match(/<table[^>]*class="vocab-table[^>]*>([\s\S]*?)<\/table>/);
  if (!vocabTableMatch) {
    const vocabSection = html.match(/<section[^>]+id="vocabulary"[\s\S]*?<\/section>/i);
    if (vocabSection) {
      vocabTableMatch = vocabSection[0].match(/<table[^>]*>([\s\S]*?)<\/table>/i);
    }
  }
  if (vocabTableMatch) {
    const tableContent = vocabTableMatch[1];
    // Extract terms and update the table rows to include id="vocab-word-id"
    const rowRegex = /<tr[^>]*>\s*<td>(?:<span[^>]*>)?([^<]+)(?:<\/span>)?<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g;
    const terms = [];
    let updatedTableContent = tableContent;
    let rowMatch;
    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      const term = rowMatch[1].trim();
      const definition = rowMatch[2];
      if (term) {
        terms.push(term);
        const wordId = term.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        updatedTableContent = updatedTableContent.replace(
          rowMatch[0],
          `<tr id="vocab-${wordId}"><td><span class="vocab">${term}</span></td><td>${definition}</td></tr>`
        );
      }
    }
    
    if (updatedTableContent !== tableContent) {
      html = html.replace(tableContent, updatedTableContent);
      modified = true;
    }

    if (terms.length > 0) {
      terms.sort((a, b) => b.length - a.length);

      // Inject CSS class .vocab if not already present
      if (!html.includes('.vocab {')) {
        const vocabStyle = `\n    .vocab { color: #3b82f6; font-weight: 500; }`;
        if (html.includes('</style>')) {
          html = html.replace('</style>', `${vocabStyle}\n  </style>`);
        } else if (html.includes('</head>')) {
          html = html.replace('</head>', `  <style>${vocabStyle}\n  </style>\n</head>`);
        }
      }

      // Parse HTML into tag and text tokens
      const parts = html.split(/(<[^>]+>)/g);
      const tagStack = [];
      const excludedTags = new Set([
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'script', 'style', 'head', 'title', 'meta', 'link', 
        'button', 'select', 'option', 'textarea', 'thead'
      ]);

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.startsWith('<')) {
          const isClosing = part.startsWith('</');
          const isSelfClosing = part.endsWith('/>');
          const match = part.match(/^<\/?([a-zA-Z0-9:-]+)/);
          if (match) {
            const tagName = match[1].toLowerCase();
            if (!isSelfClosing) {
              if (isClosing) {
                const idx = tagStack.lastIndexOf(tagName);
                if (idx !== -1) tagStack.splice(idx);
              } else {
                tagStack.push(tagName);
              }
            }
          }
        } else {
          const hasExcluded = tagStack.some(t => excludedTags.has(t));
          if (!hasExcluded && part.trim().length > 0) {
            let text = part;
            const placeholders = {};
            let plIndex = 0;

            for (const term of terms) {
              const pattern = getTermRegexPattern(term);
              const regex = new RegExp(pattern, 'gi');
              
              text = text.replace(regex, (match) => {
                const plKey = `__VOCAB_PL_${plIndex}__`;
                const wordId = term.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                placeholders[plKey] = `<span class="vocab cursor-pointer" onclick="scrollToVocabulary('${wordId}')">${match}</span>`;
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

      const outputHtml = parts.join('');
      if (outputHtml !== html) {
        html = outputHtml;
        modified = true;
      }
    }
  }

  if (html !== originalHtml) {
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Processed: ${relPath}`);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'diagrams') {
        walk(fullPath);
      }
    } else {
      if (file.endsWith('.html')) {
        processHTML(fullPath);
      }
    }
  });
}

console.log("Running vocabulary linking and link fixing script on Modules 1-10...");
walk(LESSONS_DIR);
console.log("Processing completed!");
