// Genera src/app/generated/tokens.ts a partir de src/styles/theme/inap-theme.css.
// Se ejecuta antes de build, start y test (scripts pre* de package.json).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(resolve(root, 'src/styles/theme/inap-theme.css'), 'utf8');
const out = resolve(root, 'src/app/generated/tokens.ts');

/** Contenido de cada bloque `@plugin "daisyui/theme" { name: … }`. */
function themeBlocks() {
  const blocks = {};
  const re = /@plugin\s+"daisyui\/theme"\s*\{([^}]*)\}/g;
  for (const m of css.matchAll(re)) {
    const name = /name:\s*"?([\w-]+)"?/.exec(m[1])?.[1];
    if (name) blocks[name] = vars(m[1]);
  }
  return blocks;
}

function vars(text) {
  const map = new Map();
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of clean.matchAll(/--([\w-]+):\s*([^;]+);/g)) map.set(m[1], m[2].trim());
  return map;
}

function themeAtRule() {
  const m = /@theme\s*\{([\s\S]*?)\n\}/.exec(css);
  return m ? vars(m[1]) : new Map();
}

// ── Contraste WCAG 2.1 ────────────────────────────────────────────────────
function parseHex(hex) {
  const h = hex.replace('#', '');
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) return null;
  const n = (i) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
}

function over(fg, bg) {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}

function luminance({ r, g, b }) {
  const c = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
}

function contrast(fgHex, bgHex, pageHex) {
  const page = parseHex(pageHex);
  let bg = parseHex(bgHex);
  let fg = parseHex(fgHex);
  if (!fg || !bg || !page) return null;
  if (bg.a < 1) bg = over(bg, page);
  if (fg.a < 1) fg = over(fg, bg);
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
}

// ── Clasificación ─────────────────────────────────────────────────────────
const STATES = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'];
const CATEGORY = ['tertiary', 'danger', 'royal', 'deep', 'garbo'];

function group(name) {
  if (name.startsWith('color-inap-')) return 'marca';
  if (/^color-[a-z]+-\d{2,3}$/.test(name)) return 'rampas';
  if (/^(radius|border$|depth$|noise$)/.test(name)) return 'forma';
  if (name.startsWith('font-')) return 'tipografia';
  if (/^color-(glow|logo)-/.test(name)) return 'decorativos';
  const base = name.replace(/^color-/, '').replace(/-(content|text)$/, '');
  if (CATEGORY.includes(base)) return 'categoria';
  if (STATES.includes(base)) return 'semanticos';
  return 'superficies';
}

function utility(name) {
  if (name.startsWith('color-')) {
    const c = name.slice(6);
    if (c.endsWith('-text') || c === 'base-content' || c.endsWith('-content')) return `text-${c}`;
    if (c === 'base-border' || c.endsWith('-line')) return `border-${c}`;
    return `bg-${c}`;
  }
  if (name.startsWith('radius-')) return `rounded-${name.slice(7)}`;
  if (name.startsWith('font-')) return name;
  return null;
}

/** Contra qué fondo se mide cada token, o null si no aplica. */
function against(name, light) {
  const c = name.replace(/^color-/, '');
  if (c === 'brand-surface-content' || c === 'brand-surface-muted' || c === 'brand-surface-line')
    return 'color-brand-surface';
  if (c.endsWith('-content') && c !== 'base-content') return `color-${c.replace(/-content$/, '')}`;
  if (c.endsWith('-text') || c === 'base-content' || c === 'base-border') return 'color-base-100';
  if (CATEGORY.includes(c) && c !== 'tertiary') return 'color-base-100';
  return null;
}

// ── Construcción ──────────────────────────────────────────────────────────
const blocks = themeBlocks();
const light = blocks['inap'];
const dark = blocks['dark'];
if (!light || !dark) throw new Error('No se encontraron los temas inap y dark en inap-theme.css');

// Los colores de categoría cambian en dark desde @layer base.
const darkOverrides = vars(/\[data-theme='dark'\]\s*\{([\s\S]*?)\}/.exec(css)?.[1] ?? '');
const fixed = themeAtRule();

const tokens = [];
const seen = new Set();

for (const [name, value] of light) {
  if (name === 'color-gray-200') continue; // alias de compatibilidad de Tailwind 3
  const darkValue = darkOverrides.get(name) ?? dark.get(name) ?? value;
  const ref = against(name, true);
  const contrastOf = (theme, val) => {
    if (!ref) return null;
    const map = theme === 'light' ? light : dark;
    const page = map.get('color-base-100');
    const bg = (theme === 'dark' ? darkOverrides.get(ref) : undefined) ?? map.get(ref);
    return contrast(val, bg, page);
  };
  tokens.push({
    name,
    group: group(name),
    light: value,
    dark: darkValue,
    utility: utility(name),
    against: ref,
    contrastLight: contrastOf('light', value),
    contrastDark: contrastOf('dark', darkValue),
  });
  seen.add(name);
}

for (const [name, value] of fixed) {
  if (seen.has(name) || !/^(color-inap-|font-)/.test(name)) continue;
  tokens.push({
    name,
    group: group(name),
    light: value,
    dark: value,
    utility: utility(name),
    against: null,
    contrastLight: null,
    contrastDark: null,
  });
}

const banner = `// Archivo generado por scripts/generate-tokens.mjs desde src/styles/theme/inap-theme.css.\n// No editar a mano.\n`;
const types = `export type TokenGroup =\n  | 'marca'\n  | 'semanticos'\n  | 'superficies'\n  | 'decorativos'\n  | 'categoria'\n  | 'rampas'\n  | 'forma'\n  | 'tipografia';\n\nexport interface Token {\n  /** Nombre sin los dos guiones: color-primary-text. */\n  name: string;\n  group: TokenGroup;\n  light: string;\n  dark: string;\n  /** Clase de Tailwind más común. */\n  utility: string | null;\n  /** Fondo contra el que se mide el contraste. */\n  against: string | null;\n  contrastLight: number | null;\n  contrastDark: number | null;\n}\n`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${banner}\n${types}\nexport const TOKENS: Token[] = ${JSON.stringify(tokens, null, 2)};\n`);
console.log(`tokens: ${tokens.length} → ${out.replace(root + '/', '')}`);

// ── Íconos: nombres del sprite de lucide-static ────────────────────────────
const sprite = readFileSync(resolve(root, 'node_modules/lucide-static/sprite.svg'), 'utf8');
const icons = [...sprite.matchAll(/<symbol id="([\w-]+)"/g)].map((m) => m[1]);
const iconsOut = resolve(root, 'src/app/generated/icons.ts');
writeFileSync(iconsOut, `${banner}\nexport const ICON_NAMES: string[] = ${JSON.stringify(icons)};\n`);
console.log(`íconos: ${icons.length} → ${iconsOut.replace(root + '/', '')}`);
