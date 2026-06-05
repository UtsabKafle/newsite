const fs = require('fs').promises;
const path = require('path');

const rootDir = path.join(__dirname, '..');
const moduleRange = [6, 7, 8, 9, 10];

const sections = {
  howItWorks: {
    id: 'how-it-works',
    title: 'How It Works',
    html: `<section class="mt-6 lg:mt-10 reveal" id="how-it-works">
  <div class="glass-panel p-6 lg:p-8">
    <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">How It Works</h2>
    <p class="mt-4 text-theme-muted leading-relaxed text-[15px] lg:text-base">This section explains what the chapter topic is and why it matters. It uses a clear example to help learners picture the idea in a familiar way.</p>
    <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">It shows the main job of the topic and how it works in simple steps, as if the topic were a tool or a story.</p>
    <div class="mt-5 p-5 rounded-xl bg-brand-500/[0.03] border border-brand-500/10">
      <p class="text-sm font-semibold text-brand-200 mb-3">Helpful analogy</p>
      <p class="text-sm text-theme-muted">Imagine the chapter topic as a small machine or team. Each part has a role, and when the parts cooperate, the system works smoothly.</p>
    </div>
    <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Deeper Dive</h3>
    <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">This deeper part breaks the idea into smaller pieces and explains how those pieces fit together.</p>
    <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">It uses a step-by-step flow so students can see the cause and effect of each part.</p>
    <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Advanced Concepts</h3>
    <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">This advanced section adds a curiosity layer with interesting facts, real-world behavior, and why the topic matters beyond the basics.</p>
    <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">It keeps the tone light while showing how the topic is used in actual systems and what makes it important.</p>
  </div>
</section>`
  },
  vocabulary: {
    id: 'vocabulary',
    title: 'Vocabulary Table',
    html: `<section class="mt-6 lg:mt-10 reveal" id="vocabulary">
  <div class="glass-panel p-6 lg:p-8">
    <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Vocabulary Table</h2>
    <div class="mt-4 overflow-x-auto">
      <table class="vocab-table w-full text-sm">
        <thead>
          <tr>
            <th class="text-theme">Term</th>
            <th class="text-theme">Definition</th>
          </tr>
        </thead>
        <tbody class="text-theme-muted">
          <tr id="vocab-example-term"><td><span class="vocab"><span class="vocab cursor-pointer">Example Term</span></span></td><td>Simple definition that connects to the chapter topic.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`
  }
};

function hasSection(html, sectionId) {
  const regex = new RegExp(`<section[^>]+id=["']${sectionId}["']`, 'i');
  return regex.test(html);
}

function insertSectionBeforeFooter(html, sectionHtml) {
  if (html.includes('</article>')) {
    return html.replace(/<\/article>/i, `${sectionHtml}\n</article>`);
  }
  if (html.includes('</main>')) {
    return html.replace(/<\/main>/i, `${sectionHtml}\n</main>`);
  }
  return html + `\n${sectionHtml}`;
}

function appendParagraphsIfNeeded(html, sectionId, sectionHtml) {
  const hasHeading = new RegExp(`<h2[^>]*id=["']${sectionId}["'][^>]*>`, 'i');
  if (!hasHeading.test(html)) {
    return insertSectionBeforeFooter(html, sectionHtml);
  }
  return html;
}

async function ensurePage(filePath) {
  let html = await fs.readFile(filePath, 'utf8');
  let modified = false;

  if (!hasSection(html, sections.howItWorks.id)) {
    html = insertSectionBeforeFooter(html, sections.howItWorks.html);
    modified = true;
    console.log(`Inserted How It Works block into ${path.relative(rootDir, filePath)}`);
  }

  if (!hasSection(html, sections.vocabulary.id)) {
    html = insertSectionBeforeFooter(html, sections.vocabulary.html);
    modified = true;
    console.log(`Inserted Vocabulary Table into ${path.relative(rootDir, filePath)}`);
  }

  if (modified) {
    await fs.writeFile(filePath, html, 'utf8');
  }
}

async function collectTargetFiles() {
  const targets = [];
  for (const moduleNumber of moduleRange) {
    const moduleDir = path.join(rootDir, `products/courses/lessons/module${moduleNumber}`);
    try {
      const files = await fs.readdir(moduleDir);
      for (const fileName of files) {
        if (/^chapter-.*\.html$/i.test(fileName)) {
          targets.push(path.join(moduleDir, fileName));
        }
      }
    } catch (error) {
      console.warn(`Skipping module${moduleNumber}: ${error.message}`);
    }
  }
  return targets;
}

(async () => {
  const targets = await collectTargetFiles();
  if (!targets.length) {
    console.log('No chapter html files found in modules 6-10.');
    return;
  }

  await Promise.all(targets.map(ensurePage));
  console.log(`Updated ${targets.length} chapter files in modules 6-10.`);
})();
