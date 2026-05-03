// Serialize / parse between the structured editor state (header + blocks)
// and canonical markdown (the format rendered by /blog/$slug).

import type { Block, PostHeader } from './types';
import { DEFAULT_HEADER, newBlockId } from './types';

// ---------------------------------------------------------------------------
// DERIVED VALUES — reading time & date label, auto-computed from content/post.
// ---------------------------------------------------------------------------

const WORDS_PER_MINUTE = 200;

function blockWordCount(b: Block): number {
  const tokenize = (s: string) => s.split(/\s+/).filter(Boolean).length;
  switch (b.type) {
    case 'paragraph':
    case 'heading':
      return tokenize(b.text);
    case 'list':
      return b.items.reduce((acc, item) => acc + tokenize(item), 0);
    case 'image':
      return tokenize(b.alt);
    case 'timestamps':
      return b.items.reduce((acc, it) => acc + tokenize(it.description), 0);
    case 'tags':
      return b.tags.length;
    case 'divider':
      return 0;
  }
}

function minutesLabel(minutes: number): string {
  return `Aprox. ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
}

/**
 * Compute reading time. If `overrideMinutes` is provided and > 0 (e.g. for
 * video posts) it wins; otherwise we estimate from block word count at 200
 * wpm with a 1-minute floor.
 */
export function computeReadingTime(blocks: Block[], overrideMinutes?: number): string {
  if (overrideMinutes && overrideMinutes > 0) {
    return minutesLabel(overrideMinutes);
  }
  const total = blocks.reduce((acc, b) => acc + blockWordCount(b), 0);
  const minutes = Math.max(1, Math.ceil(total / WORDS_PER_MINUTE));
  return minutesLabel(minutes);
}

// ---------------------------------------------------------------------------
// VIDEO EMBED — turn share URLs into <iframe>-able embed URLs.
// ---------------------------------------------------------------------------

export function toEmbedUrl(url: string): string {
  const trimmed = url.trim();
  // YouTube long form
  const yt = trimmed.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  // YouTube short form
  const ytb = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (ytb) return `https://www.youtube.com/embed/${ytb[1]}`;
  // YouTube already-embed
  if (/youtube\.com\/embed\//.test(trimmed)) return trimmed;
  // Vimeo
  const v = trimmed.match(/vimeo\.com\/(\d+)/);
  if (v) return `https://player.vimeo.com/video/${v[1]}`;
  return trimmed;
}

/**
 * Extract the video ID from any common YouTube URL form. Returns null if the
 * URL is not a YouTube URL.
 */
export function extractYouTubeId(url: string): string | null {
  const trimmed = url.trim();
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

/**
 * Parse an ISO 8601 duration (e.g. "PT1H23M45S") into total minutes,
 * rounded up. Returns 0 for unparseable input.
 */
export function isoDurationToMinutes(iso: string): number {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  const hours = Number.parseInt(m[1] ?? '0', 10);
  const minutes = Number.parseInt(m[2] ?? '0', 10);
  const seconds = Number.parseInt(m[3] ?? '0', 10);
  const total = hours * 60 + minutes + Math.ceil(seconds / 60);
  return total > 0 ? total : 0;
}

/**
 * Fetch a YouTube video's duration in minutes via the YouTube Data API v3.
 * Returns null on any failure (no API key, network, video private/missing,
 * unparseable duration, etc.) — caller should fall back to manual entry.
 */
export async function fetchYouTubeDurationMinutes(
  videoId: string,
  apiKey: string
): Promise<number | null> {
  if (!videoId || !apiKey) return null;
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${encodeURIComponent(
      videoId
    )}&part=contentDetails&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = (await res.json()) as {
      items?: Array<{ contentDetails?: { duration?: string } }>;
    };
    const iso = json.items?.[0]?.contentDetails?.duration;
    if (!iso) return null;
    const minutes = isoDurationToMinutes(iso);
    return minutes > 0 ? minutes : null;
  } catch {
    return null;
  }
}

export function formatMonthYear(date: Date): string {
  // es-ES with `{ month: 'long', year: 'numeric' }` outputs "mayo de 2026" —
  // we want the shorter "Mayo 2026" form. Format month and year separately
  // and concatenate with a single space.
  const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
  const capitalised = month.charAt(0).toUpperCase() + month.slice(1);
  return `${capitalised} ${date.getFullYear()}`;
}

// ---------------------------------------------------------------------------
// SERIALIZE
// ---------------------------------------------------------------------------

// Sentinel HTML comment used to round-trip video metadata through markdown.
// HTML comments are invisible in rendered output but survive the markdown
// pipeline (rehype-raw preserves them in the AST without rendering).
const VIDEO_META_RE =
  /<!--\s*meta:video\s+url="([^"]*)"\s+minutes="(\d+)"\s*-->/;

export function serializeHeader(h: PostHeader): string {
  const parts: string[] = [];
  parts.push(`# ${h.title.trim()}`);

  // Persist video metadata (URL + duration) right under the title via an
  // HTML comment so we can recover it on edit without a DB migration.
  if (h.videoUrl.trim()) {
    parts.push('');
    parts.push(
      `<!-- meta:video url="${h.videoUrl.trim()}" minutes="${Math.max(0, Math.floor(h.videoDurationMinutes))}" -->`
    );
  }

  parts.push('');
  parts.push('---');
  parts.push('');

  // The meta row uses a single-line h3 with three children: avatar image,
  // author handle, and inline-code "{readingTime} · {date}".
  // The markdown override in markdown-components.tsx detects this pattern.
  const metaParts: string[] = [];
  if (h.authorAvatarUrl) {
    metaParts.push(`![${h.authorAvatarAlt || 'avatar'}](${h.authorAvatarUrl})`);
  }
  if (h.authorHandle) metaParts.push(h.authorHandle);
  if (h.readingTime || h.date) {
    metaParts.push(`\`${[h.readingTime, h.date].filter(Boolean).join(' · ')}\``);
  }
  if (metaParts.length > 0) {
    parts.push(`### ${metaParts.join(' ')}`);
    parts.push('');
  }

  // Hero: video iframe wins over image when set.
  if (h.videoUrl.trim()) {
    const embed = toEmbedUrl(h.videoUrl);
    parts.push(
      `<iframe src="${embed}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    );
    parts.push('');
  } else if (h.heroUrl) {
    parts.push(`![${h.heroAlt || 'Imagen del post'}](${h.heroUrl})`);
    parts.push('');
  }

  parts.push('---');
  return parts.join('\n');
}

export function serializeBlock(b: Block): string {
  switch (b.type) {
    case 'paragraph':
      return b.text;
    case 'heading':
      return `${'#'.repeat(b.level)} ${b.text}`;
    case 'divider':
      return '---';
    case 'image':
      return `![${b.alt}](${b.url})`;
    case 'list': {
      const items = b.items.filter(i => i.trim().length > 0);
      if (b.style === 'numbered') {
        return items.map((i, idx) => `${idx + 1}. ${i}`).join('\n');
      }
      return items.map(i => `- ${i}`).join('\n');
    }
    case 'timestamps': {
      const head = `#### ${b.emoji} ${b.label}`.trim();
      const lines = b.items
        .filter(i => i.time.trim() || i.description.trim())
        .map(({ time, description }) => `${time} – ${description}  `);
      return `${head}\n\n${lines.join('\n').trimEnd()}`;
    }
    case 'tags': {
      const head = `#### ${b.emoji} ${b.label}`.trim();
      const tagsLine = b.tags
        .filter(t => t.trim().length > 0)
        .map(t => `#${t.replace(/^#/, '').trim()}`)
        .join(' ');
      return `${head}\n\n${tagsLine}`;
    }
  }
}

export function serializePost(header: PostHeader, blocks: Block[]): string {
  const headerMd = serializeHeader(header);
  const blocksMd = blocks.map(serializeBlock).filter(s => s.length > 0).join('\n\n');
  return blocksMd ? `${headerMd}\n\n${blocksMd}\n` : `${headerMd}\n`;
}

// ---------------------------------------------------------------------------
// PARSE — best-effort. Falls back to a single paragraph block on weird input.
// ---------------------------------------------------------------------------

const META_ROW_RE =
  /^###\s+!\[([^\]]*)\]\(([^)]+)\)\s+(\S+)\s+`([^`]+)`\s*$/;

export function parsePost(markdown: string): {
  header: PostHeader;
  blocks: Block[];
} {
  const lines = markdown.split('\n');
  const header: PostHeader = { ...DEFAULT_HEADER };

  let i = 0;
  // 1. First non-empty line should be `# Title`.
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length && lines[i].startsWith('# ')) {
    header.title = lines[i].slice(2).trim();
    i++;
  }

  // 1b. Optional video metadata comment.
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length) {
    const m = lines[i].match(VIDEO_META_RE);
    if (m) {
      header.videoUrl = m[1];
      header.videoDurationMinutes = Number.parseInt(m[2], 10) || 0;
      i++;
    }
  }

  // 2. Skip blank + first `---`.
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length && lines[i].trim() === '---') i++;

  // 3. Meta row.
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length) {
    const m = lines[i].match(META_ROW_RE);
    if (m) {
      header.authorAvatarAlt = m[1];
      header.authorAvatarUrl = m[2];
      header.authorHandle = m[3];
      const meta = m[4].split('·').map(s => s.trim());
      header.readingTime = meta[0] ?? '';
      header.date = meta[1] ?? '';
      i++;
    }
  }

  // 4. Hero — image OR iframe.
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length) {
    const imgM = lines[i].match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (imgM) {
      header.heroAlt = imgM[1];
      header.heroUrl = imgM[2];
      i++;
    } else if (lines[i].trim().startsWith('<iframe')) {
      // Video iframe — extract src so the URL field shows even without a meta comment.
      const srcM = lines[i].match(/src="([^"]+)"/);
      if (srcM && !header.videoUrl) header.videoUrl = srcM[1];
      i++;
    }
  }

  // 5. Skip blank + second `---`.
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length && lines[i].trim() === '---') i++;

  // 6. Body — everything from here parsed as blocks.
  const body = lines.slice(i).join('\n').trim();
  const blocks = body.length > 0 ? parseBody(body) : [];

  return { header, blocks };
}

function parseBody(body: string): Block[] {
  // Split by 2+ blank lines into chunks.
  const chunks = body
    .split(/\n{2,}/)
    .map(c => c.trim())
    .filter(c => c.length > 0);

  const out: Block[] = [];
  for (const chunk of chunks) {
    const parsed = chunkToBlocks(chunk);
    if (Array.isArray(parsed)) out.push(...parsed);
    else out.push(parsed);
  }
  return out;
}

function chunkToBlocks(chunk: string): Block | Block[] {
  // Divider
  if (chunk === '---') return { id: newBlockId(), type: 'divider' };

  // Standalone image
  const imgM = chunk.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
  if (imgM) {
    return { id: newBlockId(), type: 'image', alt: imgM[1], url: imgM[2] };
  }

  // List — bullets (`-`/`*`) or numbered (`1.`).
  const lines = chunk.split('\n');
  if (lines.every(l => /^\d+\.\s+/.test(l))) {
    return {
      id: newBlockId(),
      type: 'list',
      style: 'numbered',
      items: lines.map(l => l.replace(/^\d+\.\s+/, '').trim()),
    };
  }
  if (lines.every(l => /^[-*]\s+/.test(l))) {
    return {
      id: newBlockId(),
      type: 'list',
      style: 'bullet',
      items: lines.map(l => l.replace(/^[-*]\s+/, '').trim()),
    };
  }

  // h2/h3/h4 single-line heading
  if (lines.length === 1) {
    const headingM = lines[0].match(/^(#{2,4})\s+(.+)$/);
    if (headingM) {
      const level = headingM[1].length as 2 | 3 | 4;
      return { id: newBlockId(), type: 'heading', level, text: headingM[2].trim() };
    }
  }

  // h4 followed by body — could be a Timestamps or Tags block.
  if (lines[0].startsWith('#### ')) {
    const headLine = lines[0];
    const bodyLines = lines.slice(1).filter(l => l.trim().length > 0);
    const headM = headLine.match(/^####\s+(\S)\s+(.+)$/);
    const emoji = headM?.[1] ?? '';
    const label = headM?.[2]?.trim() ?? headLine.replace(/^####\s+/, '').trim();

    // Timestamps detection: every body line matches `HH:MM – text`.
    if (bodyLines.length > 0 && bodyLines.every(l => /^\d{1,2}:\d{2}\s*[–-]\s*.+/.test(l))) {
      const items = bodyLines.map(l => {
        const m = l.match(/^(\d{1,2}:\d{2})\s*[–-]\s*(.+?)\s*$/);
        return { time: m?.[1] ?? '', description: (m?.[2] ?? '').replace(/\s{2,}$/, '') };
      });
      return { id: newBlockId(), type: 'timestamps', emoji, label, items };
    }

    // Tags detection: body is one line of `#tag #tag …`.
    if (bodyLines.length === 1 && /^#\S/.test(bodyLines[0])) {
      const tags = bodyLines[0]
        .split(/\s+/)
        .filter(t => t.startsWith('#'))
        .map(t => t.replace(/^#/, ''));
      return { id: newBlockId(), type: 'tags', emoji, label, tags };
    }

    // Otherwise: heading-4 + paragraph for the rest.
    const blocks: Block[] = [
      { id: newBlockId(), type: 'heading', level: 4, text: headLine.slice(5).trim() },
    ];
    if (bodyLines.length > 0) {
      blocks.push({ id: newBlockId(), type: 'paragraph', text: bodyLines.join('\n') });
    }
    return blocks;
  }

  // Default: paragraph (preserves line breaks within).
  return { id: newBlockId(), type: 'paragraph', text: chunk };
}
