const fs = require('fs');

const techs = [
  { name: 'TypeScript', category: 'Language', icon: 'assets/icons/typescript.svg' },
  { name: 'Python', category: 'AI/ML', icon: 'assets/icons/python.svg' },
  { name: 'Node.js', category: 'Backend', icon: 'assets/icons/nodejs.svg' },
  { name: 'PostgreSQL', category: 'Database', icon: 'assets/icons/postgresql.svg' },
  { name: 'TensorFlow', category: 'ML', icon: 'assets/icons/tensorflow.svg' },
  { name: 'OpenAI', category: 'AI', icon: 'assets/icons/openai.svg' },
  { name: 'AWS', category: 'Cloud', icon: 'assets/icons/aws.svg' },
  { name: 'Docker', category: 'DevOps', icon: 'assets/icons/docker.svg' },
  { name: 'Tailwind', category: 'Design', icon: 'assets/icons/tailwind.svg' },
  { name: 'Flutter', category: 'Mobile', icon: 'assets/icons/flutter.svg' },
  { name: 'Dart', category: 'Language', icon: 'assets/icons/dart.svg' },
  { name: 'GraphQL', category: 'API', icon: 'assets/icons/graphql.svg' },
  { name: 'Kubernetes', category: 'Infra', icon: 'assets/icons/kubernetes.svg' },
];

let html = '          <div class="marquee-content flex gap-4 animate-marquee-left">\n';

function buildItem(t, hidden) {
  return `            <div
              class="glass-panel !shadow-none px-4 py-3 lg:px-6 lg:py-4 text-center min-w-[130px] lg:min-w-[160px] flex flex-col items-center gap-2 lg:gap-3 shrink-0"${hidden ? ' aria-hidden="true"' : ''}>
              <img src="${t.icon}" alt="${t.name}" class="w-8 h-8 lg:w-10 lg:h-10 object-contain" loading="lazy">
              <div>
                <p class="font-display font-medium text-[13px] lg:text-sm">${t.name}</p>
                <p class="text-[10px] lg:text-xs text-theme-faint mt-0.5">${t.category}</p>
              </div>
            </div>\n`;
}

// First set
techs.forEach(t => html += buildItem(t, false));
// Second set (hidden for loop)
techs.forEach(t => html += buildItem(t, true));

html += '          </div>';

fs.writeFileSync('scratch_marquee.html', html);
console.log('Done!');
