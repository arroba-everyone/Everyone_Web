import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@everyone-web/ui/badge';
import { cn } from '@everyone-web/libs/utils';
import { HASHTAG_REGEX, MAX_HASHTAGS } from '@everyone-web/lib/validators/deal';

interface HashtagsInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

/**
 * Chip-input for hashtags. Separators: Enter, comma, space, Tab.
 * Backspace on empty draft removes last chip.
 * Paste is split by whitespace/comma and valid tokens are added.
 * Duplicates (case-insensitive) and invalid tags (HASHTAG_REGEX) are discarded.
 */
export function HashtagsInput({
  value,
  onChange,
  maxTags = MAX_HASHTAGS,
  placeholder = 'Añadir hashtag…',
  className,
}: HashtagsInputProps) {
  const [draft, setDraft] = useState('');
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFull = value.length >= maxTags;

  function flashInvalid() {
    setInvalid(true);
    setTimeout(() => setInvalid(false), 1000);
  }

  function stripHash(tag: string) {
    return tag.startsWith('#') ? tag.slice(1) : tag;
  }

  function tryCommit(raw: string): boolean {
    const tag = stripHash(raw.trim());
    if (!tag) return true; // empty — clear silently
    if (!HASHTAG_REGEX.test(tag)) {
      flashInvalid();
      return false;
    }
    // Duplicate check (case-insensitive)
    if (value.some(t => t.toLowerCase() === tag.toLowerCase())) {
      return true; // silently discard
    }
    if (value.length >= maxTags) return false;
    onChange([...value, tag]);
    return true;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
      return;
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      if (draft) {
        e.preventDefault();
        const committed = tryCommit(draft);
        if (committed !== false) setDraft('');
      }
      return;
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Commit on comma or space
    if (raw.endsWith(',') || raw.endsWith(' ')) {
      const committed = tryCommit(raw.slice(0, -1));
      if (committed !== false) setDraft('');
    } else {
      setDraft(raw);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const tokens = pasted.split(/[,\s]+/).filter(Boolean);
    const next = [...value];
    for (const token of tokens) {
      const tag = stripHash(token.trim());
      if (!tag) continue;
      if (!HASHTAG_REGEX.test(tag)) continue;
      if (next.some(t => t.toLowerCase() === tag.toLowerCase())) continue;
      if (next.length >= maxTags) break;
      next.push(tag);
    }
    onChange(next);
    setDraft('');
  }

  function removeChip(tag: string) {
    onChange(value.filter(t => t !== tag));
  }

  return (
    <div
      role="group"
      aria-label="Hashtags"
      className={cn(
        'flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-2',
        'focus-within:ring-2 focus-within:ring-ring',
        className
      )}
    >
      {value.map((tag, idx) => {
        // Defensive strip: if the stored value already has '#', avoid rendering '##tag'
        const displayTag = tag.startsWith('#') ? tag.slice(1) : tag;
        return (
          <Badge key={`${idx}-${displayTag}`} variant="secondary" className="gap-1 select-none">
            #{displayTag}
            <button
              type="button"
              aria-label={`Quitar ${displayTag}`}
              onClick={e => {
                e.stopPropagation();
                removeChip(tag);
              }}
              className="rounded-full hover:bg-foreground/10 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}

      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={isFull ? '' : placeholder}
        disabled={isFull}
        data-invalid={invalid ? 'true' : undefined}
        className={cn(
          'flex-1 min-w-[8ch] bg-transparent outline-none text-sm',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid && 'text-destructive'
        )}
      />

      <span className="ml-auto text-xs text-muted-foreground tabular-nums select-none">
        {value.length}/{maxTags}
      </span>
    </div>
  );
}
