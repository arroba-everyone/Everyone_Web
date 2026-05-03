import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Bold, Code, Italic, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '@everyone-web/ui/button';
import { Input } from '@everyone-web/ui/input';
import { Textarea } from '@everyone-web/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@everyone-web/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@everyone-web/ui/dropdown-menu';
import { cn } from '@everyone-web/libs/utils';
import { BLOCK_TYPE_LABELS, emptyBlock } from './types';
import type {
  Block,
  BlockType,
  HeadingBlock,
  ImageBlock,
  ListBlock,
  ParagraphBlock,
  TagsBlock,
  TimestampsBlock,
} from './types';

interface BlockListProps {
  blocks: Block[];
  onChange: (next: Block[]) => void;
}

export function BlockList({ blocks, onChange }: BlockListProps) {
  const insertAt = (index: number, type: BlockType) => {
    const next = [...blocks];
    next.splice(index, 0, emptyBlock(type));
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const updateAt = (index: number, block: Block) => {
    const next = [...blocks];
    next[index] = block;
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <InsertDivider onInsert={type => insertAt(0, type)} />

      {blocks.map((block, i) => (
        <div key={block.id}>
          <BlockCard
            block={block}
            onChange={b => updateAt(i, b)}
            onMoveUp={i > 0 ? () => move(i, -1) : undefined}
            onMoveDown={i < blocks.length - 1 ? () => move(i, 1) : undefined}
            onDelete={() => removeAt(i)}
          />
          <InsertDivider onInsert={type => insertAt(i + 1, type)} />
        </div>
      ))}

      {blocks.length === 0 && (
        <p className="text-sm text-foreground/50 italic text-center py-6">
          Aún no hay bloques. Usa el botón <strong>+</strong> de arriba para añadir el primero.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Insert divider — a thin row with a centered "+ Añadir bloque" dropdown.
// ---------------------------------------------------------------------------

function InsertDivider({ onInsert }: { onInsert: (type: BlockType) => void }) {
  const types: BlockType[] = [
    'paragraph',
    'heading',
    'divider',
    'image',
    'list',
    'timestamps',
    'tags',
  ];

  return (
    <div className="flex items-center justify-center py-1 group/insert">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Añadir bloque"
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold',
              'rounded-full border border-dashed border-foreground/15',
              'px-3 py-1 text-foreground/40',
              'hover:text-primary hover:border-primary/40 transition-colors cursor-pointer',
              'group-hover/insert:opacity-100 opacity-60'
            )}
          >
            <Plus className="h-3 w-3" />
            Añadir bloque
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          sideOffset={4}
          className="rounded-2xl bg-background border-foreground/15 p-1 min-w-[10rem]"
        >
          {types.map(t => (
            <DropdownMenuItem
              key={t}
              onClick={() => onInsert(t)}
              className="rounded-xl px-3 py-2 cursor-pointer text-sm"
            >
              {BLOCK_TYPE_LABELS[t]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block card — shared chrome (label, move/delete buttons) + per-type editor.
// ---------------------------------------------------------------------------

interface BlockCardProps {
  block: Block;
  onChange: (next: Block) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
}

function BlockCard({ block, onChange, onMoveUp, onMoveDown, onDelete }: BlockCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-foreground/10 bg-foreground/[.02]',
        'p-4 tablet-lg:p-5'
      )}
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
          {BLOCK_TYPE_LABELS[block.type]}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={onMoveUp}
            disabled={!onMoveUp}
            aria-label="Subir bloque"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={onMoveDown}
            disabled={!onMoveDown}
            aria-label="Bajar bloque"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
            aria-label="Eliminar bloque"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <BlockEditor block={block} onChange={onChange} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-block editors
// ---------------------------------------------------------------------------

const inputClass =
  'rounded-full bg-background border-foreground/15 px-5 h-10';
const textareaClass =
  'rounded-2xl bg-background border-foreground/15 p-4 text-sm leading-relaxed resize-y';

function BlockEditor({ block, onChange }: { block: Block; onChange: (next: Block) => void }) {
  switch (block.type) {
    case 'paragraph':
      return <ParagraphEditor block={block} onChange={onChange} />;
    case 'heading':
      return <HeadingEditor block={block} onChange={onChange} />;
    case 'divider':
      return (
        <div className="flex items-center justify-center py-3">
          <span className="text-xs text-foreground/40">— línea horizontal —</span>
        </div>
      );
    case 'image':
      return <ImageEditor block={block} onChange={onChange} />;
    case 'list':
      return <ListEditor block={block} onChange={onChange} />;
    case 'timestamps':
      return <TimestampsEditor block={block} onChange={onChange} />;
    case 'tags':
      return <TagsEditor block={block} onChange={onChange} />;
  }
}

/**
 * Wraps the current selection (or inserts a placeholder) with markdown
 * markers using `document.execCommand('insertText')`. This is the trick
 * that keeps the change in the textarea's NATIVE undo stack — so
 * Cmd/Ctrl+Z reverts the wrap exactly like normal typing.
 *
 * `execCommand` is deprecated in the spec but every modern browser still
 * supports it for textarea/input contexts, and there's no replacement that
 * preserves the native undo history.
 */
function applyMarkdownWrap(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder: string
): void {
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  const selected = textarea.value.slice(start, end);
  const inner = selected.length > 0 ? selected : placeholder;
  const replacement = before + inner + after;

  textarea.focus();
  // Replaces the current selection (or inserts at cursor) AND emits a real
  // `input` event so React's onChange fires and the controlled value stays
  // in sync. The change lands in the native undo history.
  document.execCommand('insertText', false, replacement);

  // Restore selection INSIDE the wrap so the user can keep typing or
  // chain another shortcut without having to re-select.
  const newStart = start + before.length;
  const newEnd = newStart + inner.length;
  textarea.setSelectionRange(newStart, newEnd);
}

// Mac vs others — pick the right modifier key for shortcut hints.
const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
const modKey = isMac ? '⌘' : 'Ctrl';

interface MarkdownAction {
  key: 'b' | 'i' | 'e' | 'k';
  before: string;
  after: string;
  placeholder: string;
  label: string;
  shortcut: string;
}

const MARKDOWN_ACTIONS: MarkdownAction[] = [
  { key: 'b', before: '**', after: '**', placeholder: 'negrita', label: 'Negrita', shortcut: 'B' },
  { key: 'i', before: '*', after: '*', placeholder: 'cursiva', label: 'Cursiva', shortcut: 'I' },
  { key: 'e', before: '`', after: '`', placeholder: 'código', label: 'Código', shortcut: 'E' },
  {
    key: 'k',
    before: '[',
    after: '](https://)',
    placeholder: 'texto del enlace',
    label: 'Enlace',
    shortcut: 'K',
  },
];

function ParagraphEditor({
  block,
  onChange,
}: {
  block: ParagraphBlock;
  onChange: (next: Block) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const apply = (action: MarkdownAction) => {
    if (!ref.current) return;
    applyMarkdownWrap(ref.current, action.before, action.after, action.placeholder);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMod = e.metaKey || e.ctrlKey;
    if (!isMod || e.shiftKey || e.altKey) return;
    const action = MARKDOWN_ACTIONS.find(a => a.key === e.key.toLowerCase());
    if (!action) return;
    e.preventDefault();
    apply(action);
  };

  const toolbarBtnClass =
    'inline-flex items-center justify-center h-7 w-7 rounded-full text-foreground/60 hover:text-primary hover:bg-foreground/5 transition-colors cursor-pointer';

  const iconForKey: Record<MarkdownAction['key'], React.ReactNode> = {
    b: <Bold className="h-3.5 w-3.5" />,
    i: <Italic className="h-3.5 w-3.5" />,
    e: <Code className="h-3.5 w-3.5" />,
    k: <LinkIcon className="h-3.5 w-3.5" />,
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Tiny toolbar — shortcuts shown in tooltip */}
      <div className="flex items-center gap-1 self-start rounded-full bg-foreground/[.04] border border-foreground/10 p-1">
        {MARKDOWN_ACTIONS.map(action => (
          <button
            key={action.key}
            type="button"
            onClick={() => apply(action)}
            className={toolbarBtnClass}
            aria-label={`${action.label} (${modKey}+${action.shortcut})`}
            title={`${action.label} (${modKey}+${action.shortcut})`}
          >
            {iconForKey[action.key]}
          </button>
        ))}
      </div>

      <Textarea
        ref={ref}
        value={block.text}
        onChange={e => onChange({ ...block, text: e.target.value })}
        onKeyDown={handleKeyDown}
        placeholder={
          'Escribe varios párrafos. Doble Enter para separar uno del siguiente.\n\nSoporta **negrita**, *cursiva*, `código` y [enlaces](https://…).'
        }
        className={cn(textareaClass, 'min-h-40 tablet-lg:min-h-48')}
        aria-label="Texto del bloque"
      />
      <p className="text-xs text-foreground/40">
        Atajos: <kbd className="font-mono">{modKey}+B</kbd> negrita ·{' '}
        <kbd className="font-mono">{modKey}+I</kbd> cursiva ·{' '}
        <kbd className="font-mono">{modKey}+E</kbd> código ·{' '}
        <kbd className="font-mono">{modKey}+K</kbd> enlace ·{' '}
        <kbd className="font-mono">{modKey}+Z</kbd> deshacer.
      </p>
    </div>
  );
}

function HeadingEditor({
  block,
  onChange,
}: {
  block: HeadingBlock;
  onChange: (next: Block) => void;
}) {
  return (
    <div className="flex gap-2 items-stretch">
      <Select
        value={String(block.level)}
        onValueChange={v => onChange({ ...block, level: Number(v) as 2 | 3 | 4 })}
      >
        <SelectTrigger className="w-24 rounded-full bg-background border-foreground/15">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-foreground/15">
          <SelectItem value="2">H2</SelectItem>
          <SelectItem value="3">H3</SelectItem>
          <SelectItem value="4">H4</SelectItem>
        </SelectContent>
      </Select>
      <Input
        value={block.text}
        onChange={e => onChange({ ...block, text: e.target.value })}
        placeholder="Texto del encabezado"
        className={cn(inputClass, 'flex-1')}
        aria-label="Texto del encabezado"
      />
    </div>
  );
}

function ImageEditor({
  block,
  onChange,
}: {
  block: ImageBlock;
  onChange: (next: Block) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input
        value={block.url}
        onChange={e => onChange({ ...block, url: e.target.value })}
        placeholder="URL de la imagen"
        className={inputClass}
        aria-label="URL de la imagen"
      />
      <Input
        value={block.alt}
        onChange={e => onChange({ ...block, alt: e.target.value })}
        placeholder="Texto alternativo"
        className={inputClass}
        aria-label="Texto alternativo de la imagen"
      />
    </div>
  );
}

/** Parse a multi-line blob into list items. Strips common bullet/number
 * prefixes so the user can paste from anywhere (markdown, dashes, "1.",
 * "1)", or just plain lines).
 */
function parseListBulk(blob: string): string[] {
  return blob
    .split('\n')
    .map(l => l.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim())
    .filter(l => l.length > 0);
}

function ListEditor({ block, onChange }: { block: ListBlock; onChange: (next: Block) => void }) {
  const [bulk, setBulk] = useState('');

  const update = (i: number, value: string) => {
    const next = [...block.items];
    next[i] = value;
    onChange({ ...block, items: next });
  };
  const add = () => onChange({ ...block, items: [...block.items, ''] });
  const remove = (i: number) =>
    onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) });

  const importBulk = () => {
    const parsed = parseListBulk(bulk);
    if (parsed.length === 0) return;
    const isPlaceholder = block.items.length === 1 && block.items[0]?.trim() === '';
    const base = isPlaceholder ? [] : block.items.filter(i => i.trim().length > 0);
    onChange({ ...block, items: [...base, ...parsed] });
    setBulk('');
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Style selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground/70 font-medium">Tipo</span>
        <Select
          value={block.style}
          onValueChange={v => onChange({ ...block, style: v as ListBlock['style'] })}
        >
          <SelectTrigger className="w-44" aria-label="Tipo de lista">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bullet">Viñetas</SelectItem>
            <SelectItem value="numbered">Numerada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {block.items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item}
              onChange={e => update(i, e.target.value)}
              placeholder={`Elemento ${i + 1}`}
              className={cn(inputClass, 'flex-1')}
              aria-label={`Elemento ${i + 1} de la lista`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 text-destructive"
              onClick={() => remove(i)}
              disabled={block.items.length === 1}
              aria-label={`Eliminar elemento ${i + 1}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          className="rounded-full self-start cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Añadir elemento
        </Button>
      </div>

      {/* Bulk import */}
      <details className="rounded-2xl border border-foreground/10 bg-background/50">
        <summary className="cursor-pointer text-sm font-medium px-4 py-3 select-none text-foreground/80 hover:text-primary transition-colors">
          Importar varios a la vez
        </summary>
        <div className="px-4 pb-4 flex flex-col gap-2">
          <Textarea
            value={bulk}
            onChange={e => setBulk(e.target.value)}
            placeholder={
              'Primer elemento\nSegundo elemento\n- Tercero (con guion)\n1. Cuarto (con número)'
            }
            className={cn(textareaClass, 'min-h-32 text-sm')}
            aria-label="Pegar lista de elementos"
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={importBulk}
              disabled={parseListBulk(bulk).length === 0}
              className="rounded-full cursor-pointer"
            >
              Importar {parseListBulk(bulk).length || ''}{' '}
              {parseListBulk(bulk).length === 1 ? 'elemento' : 'elementos'}
            </Button>
            <span className="text-xs text-foreground/40">
              Una línea por elemento. Acepta `-`, `*`, `•`, `1.` o `1)` como prefijo (se quita).
            </span>
          </div>
        </div>
      </details>
    </div>
  );
}

/** Parse a multi-line timestamps blob into structured items.
 *
 * Accepts lines like:
 *   00:00 - Intro
 *   00:39 – Agradecimientos
 *   1:23:45 — Sección
 *   00:00 Intro                 (no separator, just whitespace)
 *
 * Empty lines and lines that don't start with HH:MM are skipped.
 */
function parseTimestampsBulk(blob: string): { time: string; description: string }[] {
  const lines = blob.split('\n').map(l => l.trim()).filter(Boolean);
  const out: { time: string; description: string }[] = [];
  for (const line of lines) {
    const m = line.match(
      /^(\d{1,2}(?::\d{1,2}){1,2})\s*[–\-—:]?\s*(.+)$/
    );
    if (m) out.push({ time: m[1], description: m[2].trim() });
  }
  return out;
}

function TimestampsEditor({
  block,
  onChange,
}: {
  block: TimestampsBlock;
  onChange: (next: Block) => void;
}) {
  const [bulk, setBulk] = useState('');

  const updateItem = (i: number, patch: Partial<TimestampsBlock['items'][number]>) => {
    const next = [...block.items];
    next[i] = { ...next[i], ...patch };
    onChange({ ...block, items: next });
  };
  const add = () =>
    onChange({ ...block, items: [...block.items, { time: '00:00', description: '' }] });
  const remove = (i: number) =>
    onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) });

  const importBulk = () => {
    const parsed = parseTimestampsBulk(bulk);
    if (parsed.length === 0) return;
    // If the only existing item is the empty placeholder, replace it.
    const isPlaceholder =
      block.items.length === 1 &&
      block.items[0]?.time === '00:00' &&
      block.items[0]?.description === 'Intro';
    const base = isPlaceholder
      ? []
      : block.items.filter(i => i.time.trim() || i.description.trim());
    onChange({ ...block, items: [...base, ...parsed] });
    setBulk('');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-[6rem_1fr] gap-2">
        <Input
          value={block.emoji}
          onChange={e => onChange({ ...block, emoji: e.target.value })}
          placeholder="⏱"
          className={inputClass}
          aria-label="Emoji del título"
        />
        <Input
          value={block.label}
          onChange={e => onChange({ ...block, label: e.target.value })}
          placeholder="Timestamps:"
          className={inputClass}
          aria-label="Etiqueta del título"
        />
      </div>

      <div className="flex flex-col gap-2">
        {block.items.map((it, i) => (
          <div key={i} className="grid grid-cols-[6rem_1fr_auto] gap-2">
            <Input
              value={it.time}
              onChange={e => updateItem(i, { time: e.target.value })}
              placeholder="00:00"
              className={cn(inputClass, 'font-mono text-sm')}
              aria-label={`Hora ${i + 1}`}
            />
            <Input
              value={it.description}
              onChange={e => updateItem(i, { description: e.target.value })}
              placeholder="Descripción"
              className={inputClass}
              aria-label={`Descripción ${i + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 text-destructive"
              onClick={() => remove(i)}
              disabled={block.items.length === 1}
              aria-label={`Eliminar timestamp ${i + 1}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          className="rounded-full self-start cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Añadir timestamp
        </Button>
      </div>

      {/* Bulk import — paste a YouTube/manual timestamp list, parse on click. */}
      <details className="group/bulk rounded-2xl border border-foreground/10 bg-background/50">
        <summary className="cursor-pointer text-sm font-medium px-4 py-3 select-none text-foreground/80 hover:text-primary transition-colors">
          Importar varios a la vez
        </summary>
        <div className="px-4 pb-4 flex flex-col gap-2">
          <Textarea
            value={bulk}
            onChange={e => setBulk(e.target.value)}
            placeholder={
              '00:00 - Intro\n00:39 - Agradecimientos\n02:08 - Tip 1: ¿Dónde colocar tu PS5?\n…'
            }
            className={cn(textareaClass, 'min-h-32 font-mono text-xs')}
            aria-label="Pegar lista de timestamps"
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={importBulk}
              disabled={parseTimestampsBulk(bulk).length === 0}
              className="rounded-full cursor-pointer"
            >
              Importar {parseTimestampsBulk(bulk).length || ''}{' '}
              {parseTimestampsBulk(bulk).length === 1 ? 'línea' : 'líneas'}
            </Button>
            <span className="text-xs text-foreground/40">
              Acepta `HH:MM`, `H:MM:SS`, separadores `-` `–` `—` `:` o espacio.
            </span>
          </div>
        </div>
      </details>
    </div>
  );
}

function TagsEditor({ block, onChange }: { block: TagsBlock; onChange: (next: Block) => void }) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    // Accept multiple tags pasted/typed at once, separated by whitespace.
    // E.g. "#PS5Slim #CuidadoConsolas #GamingTips" → ["PS5Slim","CuidadoConsolas","GamingTips"].
    const newTags = draft
      .split(/\s+/)
      .map(t => t.replace(/^#/, '').trim())
      .filter(t => t.length > 0);
    if (newTags.length === 0) return;

    const merged = [...block.tags];
    for (const t of newTags) {
      if (!merged.includes(t)) merged.push(t);
    }
    onChange({ ...block, tags: merged });
    setDraft('');
  };

  const removeTag = (i: number) =>
    onChange({ ...block, tags: block.tags.filter((_, idx) => idx !== i) });

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-[6rem_1fr] gap-2">
        <Input
          value={block.emoji}
          onChange={e => onChange({ ...block, emoji: e.target.value })}
          placeholder="🔖"
          className={inputClass}
          aria-label="Emoji del título"
        />
        <Input
          value={block.label}
          onChange={e => onChange({ ...block, label: e.target.value })}
          placeholder="Tags:"
          className={inputClass}
          aria-label="Etiqueta del título"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {block.tags.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary text-sm font-semibold px-3 py-1"
          >
            #{t}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="hover:text-destructive cursor-pointer"
              aria-label={`Eliminar tag ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Escribe un tag y pulsa Enter…"
          className={cn(inputClass, 'flex-1')}
          aria-label="Nuevo tag"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTag}
          className="rounded-full cursor-pointer"
          disabled={!draft.trim()}
        >
          Añadir
        </Button>
      </div>
    </div>
  );
}
