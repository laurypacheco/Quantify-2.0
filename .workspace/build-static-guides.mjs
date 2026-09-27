import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const wikiDir = path.join(root, 'context', 'wiki');
const outputPath = path.join(wikiDir, 'index.html');
const sourceTemplate = await fs.readFile(outputPath, 'utf8');
const styles = sourceTemplate.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!styles) throw new Error('Could not read the existing guide styles.');

const parserResponse = await fetch('https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js');
if (!parserResponse.ok) throw new Error(`Could not download Markdown parser: ${parserResponse.status}`);
const parserSource = await parserResponse.text();
const parserDataUrl = `data:text/javascript;base64,${Buffer.from(parserSource).toString('base64')}`;
const { marked } = await import(parserDataUrl);

const guides = [
  { id: 'getting-started', number: '00', title: 'Getting Started', file: '00-getting-started.md' },
  { id: 'super-admin', number: '01', title: 'Super Admin', file: '01-super-admin.md' },
  { id: 'admin', number: '02', title: 'Admin', file: '02-admin.md' },
  { id: 'reviewer', number: '03', title: 'Reviewer', file: '03-reviewer.md' },
  { id: 'provider', number: '04', title: 'Provider', file: '04-provider.md' },
];

const anchorMaps = new Map();
const renderedGuides = [];
let embeddedImages = 0;
let imageBytes = 0;

for (const guide of guides) {
  const source = await fs.readFile(path.join(wikiDir, guide.file), 'utf8');
  const diagram = `<div class="process-map" role="img" aria-label="Recorrido orientativo de una factura"><div><b>Provider</b><span>Prepara una factura</span></div><i aria-hidden="true">→</i><div><b>Bill</b><span>Consulta o inicia</span></div><i aria-hidden="true">→</i><div><b>Reviewer / Approver</b><span>Revisión por validar</span></div><i aria-hidden="true">→</i><div><b>Seguimiento</b><span>Estado visible</span></div></div>`;
  const withDiagram = source.replace(/```mermaid\s+[\s\S]*?```/, diagram);
  let html = marked.parse(withDiagram, { gfm: true, breaks: false });

  html = await replaceAsync(html, /<img\b([^>]*?)\bsrc="([^"]+)"([^>]*)>/g, async (match, before, sourcePath, after) => {
    const decodedPath = decodeURIComponent(sourcePath);
    const imagePath = path.resolve(wikiDir, decodedPath);
    const image = await fs.readFile(imagePath);
    const extension = path.extname(imagePath).toLowerCase();
    const mime = extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : 'image/png';
    embeddedImages += 1;
    imageBytes += image.length;
    return `<img${before}src="data:${mime};base64,${image.toString('base64')}"${after}>`;
  });

  const anchors = new Map();
  html = html.replace(/<(h[1-6])([^>]*?)\bid="([^"]+)"([^>]*)>/g, (match, tag, before, originalId, after) => {
    const id = `${guide.id}-${originalId}`;
    anchors.set(originalId, id);
    return `<${tag}${before}id="${id}"${after}>`;
  });
  anchorMaps.set(guide.file, anchors);
  renderedGuides.push({ ...guide, html });
}

for (const guide of renderedGuides) {
  guide.html = guide.html.replace(/<a\b([^>]*?)href="([^"]+)"([^>]*)>/g, (match, before, href, after) => {
    const hashIndex = href.indexOf('#');
    const filePath = hashIndex < 0 ? href : href.slice(0, hashIndex);
    const anchor = hashIndex < 0 ? '' : decodeURIComponent(href.slice(hashIndex + 1));
    if (!filePath.endsWith('.md')) {
      if (filePath === '' && anchor) {
        const mappedAnchor = anchorMaps.get(guide.file)?.get(anchor) || `${guide.id}-${anchor}`;
        return `<a${before}href="#${guide.id}/${mappedAnchor}"${after}>`;
      }
      return match;
    }
    const targetFile = path.basename(decodeURIComponent(filePath));
    const target = targetFile === 'README.md'
      ? renderedGuides[0]
      : renderedGuides.find((item) => item.file === targetFile);
    if (!target) return match;
    const mappedAnchor = anchor ? anchorMaps.get(target.file)?.get(anchor) || `${target.id}-${anchor}` : '';
    return `<a${before}href="#${target.id}${mappedAnchor ? `/${mappedAnchor}` : ''}"${after}>`;
  });
}

const localStyles = styles
  .replaceAll('"DM Sans", sans-serif', '"Segoe UI", sans-serif')
  .replaceAll('"Fraunces", Georgia, serif', 'Georgia, serif');
const panels = renderedGuides.map((guide, index) =>
  `<article class="guide-content guide-panel${index === 0 ? ' active' : ''}" data-guide-panel="${guide.id}"${index === 0 ? '' : ' hidden'}>${guide.html}</article>`
).join('\n');
const navigation = guides.map((guide, index) =>
  `<button class="nav-item" type="button" data-guide="${guide.id}" aria-current="${index === 0 ? 'page' : 'false'}"><span class="nav-index">${guide.number}</span><span>${guide.title}</span></button>`
).join('\n');

const standaloneHtml = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#07588d">
<meta name="description" content="Guías de usuario de Quantify para cada rol.">
<title>Guías de usuario · Quantify</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='10' fill='%2307588d'/%3E%3Ctext x='8' y='29' font-family='Arial' font-weight='700' font-size='25' fill='white'%3EQ%3C/text%3E%3Ccircle cx='30' cy='28' r='3' fill='%23f2a23a'/%3E%3C/svg%3E">
<style>
${localStyles}
      .guide-panel { display: none; }
      .guide-panel.active { display: block; }
      .process-map { display: flex; align-items: stretch; justify-content: center; gap: 8px; margin: 24px 0; padding: 18px; border: 1px solid var(--line); border-radius: 4px; background: #fbfcfc; }
      .process-map div { display: grid; min-width: 0; flex: 1 1 0; align-content: center; gap: 4px; padding: 12px 10px; border: 1px solid #d7e5ec; border-radius: 4px; background: #eaf3f9; text-align: center; }
      .process-map div:nth-of-type(3) { background: #fff4e6; border-color: #f1dfc4; }
      .process-map div:nth-of-type(4) { background: #eff7f4; border-color: #d5e9e2; }
      .process-map b { color: var(--blue-deep); font-size: 13px; }
      .process-map span { color: #526b79; font-size: 11px; line-height: 1.35; }
      .process-map i { align-self: center; color: var(--orange); font-size: 20px; font-style: normal; }
      @media (max-width: 760px) {
        .process-map { flex-direction: column; align-items: stretch; }
        .process-map i { align-self: center; transform: rotate(90deg); }
      }
      @media print {
        .rail, .topbar, .toc { display: none !important; }
        .main { margin: 0; }
        .content-grid { display: block; padding: 0; }
        .guide-content { display: block !important; max-width: none; margin: 0 0 20mm; border: 0; box-shadow: none; break-after: page; }
        .guide-content img { max-height: 180mm; object-fit: contain; }
      }
</style>
</head>
<body>
<div class="layout">
  <aside class="rail" aria-label="Navegación de guías">
    <div class="rail-head">
      <a class="brand" href="#getting-started" aria-label="Quantify, ir a Getting Started"><span class="brand-mark" aria-hidden="true">Q</span><span>Quantify</span></a>
      <button class="mobile-menu" id="menuToggle" type="button" aria-expanded="true">Ocultar guías</button>
    </div>
    <p class="rail-label">Project User Guides</p>
    <nav class="guide-nav" id="guideNav">${navigation}</nav>
    <div class="rail-bottom"><div>Version 0.1 · 26 Sep 2026</div><div>Documento HTML autónomo</div></div>
  </aside>
  <main class="main">
    <header class="topbar"><div class="crumb">User documentation <span aria-hidden="true">/</span> <span id="currentCrumb">Getting Started</span></div><label class="search-wrap"><input class="search" id="guideSearch" type="search" placeholder="Buscar una guía..." autocomplete="off" aria-label="Buscar una guía"></label></header>
    <div class="content-grid">
      <div id="guideCollection">${panels}</div>
      <aside class="toc" aria-label="En esta guía"><p class="toc-title">En esta guía</p><nav class="toc-list" id="tocList"></nav></aside>
    </div>
  </main>
</div>
<script>
(() => {
  const nav = document.getElementById('guideNav');
  const panels = [...document.querySelectorAll('[data-guide-panel]')];
  const toc = document.getElementById('tocList');
  const search = document.getElementById('guideSearch');
  const crumb = document.getElementById('currentCrumb');
  const menuToggle = document.getElementById('menuToggle');
  let activeId = 'getting-started';
  const titleFor = (id) => nav.querySelector('[data-guide="' + id + '"] span:last-child')?.textContent || 'Getting Started';

  function buildToc(panel) {
    toc.replaceChildren();
    panel.querySelectorAll('h2, h3').forEach((heading) => {
      if (!heading.id) return;
      const link = document.createElement('a');
      link.href = '#' + activeId + '/' + heading.id;
      link.textContent = heading.textContent;
      if (heading.tagName === 'H3') link.classList.add('sub');
      toc.append(link);
    });
  }

  function showGuide(id, section = '', updateHash = true) {
    const panel = panels.find((item) => item.dataset.guidePanel === id) || panels[0];
    activeId = panel.dataset.guidePanel;
    panels.forEach((item) => {
      const active = item === panel;
      item.classList.toggle('active', active);
      item.hidden = !active;
    });
    nav.querySelectorAll('[data-guide]').forEach((button) => {
      if (button.dataset.guide === activeId) button.setAttribute('aria-current', 'page');
      else button.setAttribute('aria-current', 'false');
    });
    crumb.textContent = titleFor(activeId);
    buildToc(panel);
    if (updateHash) history.replaceState(null, '', '#' + activeId + (section ? '/' + section : ''));
    if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  }

  nav.addEventListener('click', (event) => {
    const button = event.target.closest('[data-guide]');
    if (button) {
      showGuide(button.dataset.guide);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  document.getElementById('guideCollection').addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const [id, section = ''] = decodeURIComponent(link.getAttribute('href').slice(1)).split('/');
    if (!panels.some((item) => item.dataset.guidePanel === id)) return;
    event.preventDefault();
    showGuide(id, section);
  });
  toc.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    event.preventDefault();
    const [, section = ''] = decodeURIComponent(link.getAttribute('href').slice(1)).split('/');
    history.replaceState(null, '', '#' + activeId + '/' + section);
    document.getElementById(section)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    nav.querySelectorAll('[data-guide]').forEach((button) => {
      button.classList.toggle('hidden', !(button.textContent + ' ' + button.dataset.guide).toLowerCase().includes(query));
    });
  });
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.textContent = expanded ? 'Ver guías' : 'Ocultar guías';
    nav.hidden = expanded;
  });
  window.addEventListener('hashchange', () => {
    const [id, section = ''] = decodeURIComponent(location.hash.slice(1)).split('/');
    showGuide(id || 'getting-started', section, false);
  });
  const [initialId, initialSection = ''] = decodeURIComponent(location.hash.slice(1)).split('/');
  showGuide(initialId || 'getting-started', initialSection, false);
})();
</script>
</body>
</html>
`;

await fs.writeFile(outputPath, standaloneHtml, 'utf8');
console.log(`Built ${outputPath}`);
console.log(`Guides: ${renderedGuides.length}; embedded screenshots: ${embeddedImages}; image payload: ${(imageBytes / 1024 / 1024).toFixed(2)} MiB`);

async function replaceAsync(input, pattern, replacer) {
  const matches = [...input.matchAll(pattern)];
  let output = input;
  for (const match of matches.reverse()) {
    const replacement = await replacer(...match);
    output = output.slice(0, match.index) + replacement + output.slice(match.index + match[0].length);
  }
  return output;
}
