import fs from 'fs';
import path from 'path';

const DOCS_DIR = './docs';
const OUTPUT_DIR = './src/data';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'docs.json');

function parseHtml(content) {
  let title = 'Untitled HTML';
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // Extract body content
  let bodyContent = content;
  const bodyMatch = content.match(/<body>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    bodyContent = bodyMatch[1].trim();
  }

  return { title, bodyContent };
}

function parseMarkdown(content) {
  let title = 'Untitled Markdown';
  const firstLine = content.split('\n')[0] || '';
  if (firstLine.startsWith('# ')) {
    title = firstLine.substring(2).trim();
  } else {
    // Try to find any heading
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      title = headingMatch[1].trim();
    }
  }
  return { title, bodyContent: content };
}

function build() {
  console.log('Building documentation manifest...');
  
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Docs directory "${DOCS_DIR}" does not exist.`);
    return;
  }

  const docs = [];
  const languages = ['en', 'fr'];
  const categories = ['architecture', 'vision', 'guides'];

  languages.forEach((lang) => {
    const langDir = path.join(DOCS_DIR, lang);
    if (!fs.existsSync(langDir)) {
      console.log(`Directory for language "${lang}" not found, skipping.`);
      return;
    }

    categories.forEach((cat) => {
      const catDir = path.join(langDir, cat);
      if (!fs.existsSync(catDir)) return;

      const files = fs.readdirSync(catDir);
      files.forEach((file) => {
        const ext = path.extname(file).toLowerCase();
        if (ext !== '.html' && ext !== '.md') return;

        const slug = path.basename(file, ext);
        const filePath = path.join(catDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        let parsed;
        if (ext === '.html') {
          parsed = parseHtml(fileContent);
        } else {
          parsed = parseMarkdown(fileContent);
        }

        docs.push({
          slug,
          format: ext === '.html' ? 'html' : 'md',
          lang,
          category: cat,
          title: parsed.title,
          content: parsed.bodyContent
        });
      });
    });
  });

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(docs, null, 2), 'utf-8');
  console.log(`Successfully compiled ${docs.length} documents to ${OUTPUT_FILE}`);
}

build();
