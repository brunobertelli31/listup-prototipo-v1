// Build del prototipo V1: versione Artifact (senza head) e versione GitHub Pages (documento completo).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';

const src = readFileSync('/home/claude/listup/v1.src.html', 'utf8');
const photos = readFileSync('/home/claude/listup/photos.json', 'utf8').trim();
const now = new Date(Date.now() + 2*3600e3); const stamp = `${String(now.getUTCDate()).padStart(2,'0')}/${String(now.getUTCMonth()+1).padStart(2,'0')} alle ${String(now.getUTCHours()).padStart(2,'0')}:${String(now.getUTCMinutes()).padStart(2,'0')}`;
const body = src.split('__PHOTOS__').join(photos).split('__BUILD__').join(stamp);

// Artifact e file locale
for (const p of ['/home/claude/listup/v1.html', '/home/claude/listup/listup-top10-coda.html', '/mnt/user-data/outputs/ListUp-V1-prototipo.html']) writeFileSync(p, body);
copyFileSync('/home/claude/listup/v1.src.html', '/mnt/user-data/outputs/v1-prototipo.src.html');

// GitHub Pages: serve lo scheletro che l'Artifact aggiunge da solo
const head = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#FAF6F0">
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="ListUp">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
`;
// il <title> e il resto della head stanno in cima al sorgente: chiudiamo la head dopo lo <style> principale
const i = body.indexOf('</style>') + '</style>'.length;
const gh = head + body.slice(0, i) + '\n</head>\n<body>\n' + body.slice(i) + '\n</body>\n</html>\n';
const R = '/home/claude/listup-prototipo';
mkdirSync(R + '/sorgente', { recursive: true });
writeFileSync(R + '/index.html', gh);
copyFileSync('/home/claude/listup/v1.src.html', R + '/sorgente/v1-prototipo.src.html');
copyFileSync('/home/claude/listup/photos.json', R + '/sorgente/photos.json');
copyFileSync('/home/claude/listup/build.mjs', R + '/sorgente/build.mjs');
console.log('ok', body.length, gh.length);
