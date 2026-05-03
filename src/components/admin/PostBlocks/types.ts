// Block types for the post body editor.
// The post is composed of:
//   - A `PostHeader` (form-driven) — title, meta row, hero image, dividers.
//   - An ordered list of `Block`s — the article body.
// Both serialize to the canonical markdown the public blog renders.

export type BlockId = string;

export interface ParagraphBlock {
  id: BlockId;
  type: 'paragraph';
  text: string;
}

export interface HeadingBlock {
  id: BlockId;
  type: 'heading';
  level: 2 | 3 | 4;
  text: string;
}

export interface DividerBlock {
  id: BlockId;
  type: 'divider';
}

export interface ImageBlock {
  id: BlockId;
  type: 'image';
  url: string;
  alt: string;
}

export type ListStyle = 'bullet' | 'numbered';

export interface ListBlock {
  id: BlockId;
  type: 'list';
  style: ListStyle;
  items: string[];
}

export interface TimestampsBlock {
  id: BlockId;
  type: 'timestamps';
  emoji: string; // default '⏱'
  label: string; // default 'Timestamps:'
  items: { time: string; description: string }[];
}

export interface TagsBlock {
  id: BlockId;
  type: 'tags';
  emoji: string; // default '🔖'
  label: string; // default 'Tags:'
  tags: string[];
}

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | DividerBlock
  | ImageBlock
  | ListBlock
  | TimestampsBlock
  | TagsBlock;

export type BlockType = Block['type'];

export interface PostHeader {
  title: string;
  authorAvatarUrl: string;
  authorAvatarAlt: string;
  authorHandle: string; // e.g. '@everyone'
  readingTime: string; // e.g. 'Aprox. 4 minutos' — auto-derived
  date: string; // e.g. 'Enero 2025' — auto-derived
  heroUrl: string;
  heroAlt: string;
  // When set, the hero is rendered as an iframe video embed instead of an
  // image, AND `videoDurationMinutes` overrides the auto reading time.
  videoUrl: string;
  videoDurationMinutes: number; // 0 = unset
}

export const DEFAULT_HEADER: PostHeader = {
  title: '',
  authorAvatarUrl: '',
  authorAvatarAlt: 'avatar',
  authorHandle: '@everyone',
  readingTime: 'Aprox. 5 minutos',
  date: '',
  heroUrl: '',
  heroAlt: 'Imagen del post',
  videoUrl: '',
  videoDurationMinutes: 0,
};

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  paragraph: 'Texto',
  heading: 'Encabezado',
  divider: 'Separador',
  image: 'Imagen',
  list: 'Lista',
  timestamps: 'Timestamps',
  tags: 'Tags',
};

let _idCounter = 0;
export function newBlockId(): BlockId {
  _idCounter += 1;
  return `b${Date.now()}-${_idCounter}`;
}

export function emptyBlock(type: BlockType): Block {
  const id = newBlockId();
  switch (type) {
    case 'paragraph':
      return { id, type: 'paragraph', text: '' };
    case 'heading':
      return { id, type: 'heading', level: 2, text: '' };
    case 'divider':
      return { id, type: 'divider' };
    case 'image':
      return { id, type: 'image', url: '', alt: '' };
    case 'list':
      return { id, type: 'list', style: 'bullet', items: [''] };
    case 'timestamps':
      return {
        id,
        type: 'timestamps',
        emoji: '⏱',
        label: 'Timestamps:',
        items: [{ time: '00:00', description: 'Intro' }],
      };
    case 'tags':
      return { id, type: 'tags', emoji: '🔖', label: 'Tags:', tags: [] };
  }
}
