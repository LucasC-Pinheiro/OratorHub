import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn, fuzzyScore, normalize } from "@/lib/utils";

export type ComboboxOption = {
  value: string;
  label: string;
  description?: ReactNode;
  badge?: ReactNode;
  searchTokens?: string[];
};

export type ComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  emptyHint?: string;
  className?: string;
  inputClassName?: string;
  allowFreeText?: boolean;
  leadingIcon?: ReactNode;
  id?: string;
  name?: string;
  autoFocus?: boolean;
  ariaInvalid?: boolean;
  maxOptions?: number;
  onSelectOption?: (option: ComboboxOption) => void;
};

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      value,
      onChange,
      options,
      placeholder,
      emptyHint = "Nenhum resultado",
      className,
      inputClassName,
      allowFreeText = true,
      leadingIcon,
      id,
      name,
      autoFocus,
      ariaInvalid,
      maxOptions = 8,
      onSelectOption,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(0);
    const listRef = useRef<HTMLUListElement | null>(null);

    const filtered = useMemo(() => {
      const term = normalize(value);
      const scored = options
        .map((option) => {
          const tokens = [option.label, ...(option.searchTokens ?? [])];
          let best: number | null = null;
          for (const token of tokens) {
            const score = fuzzyScore(token, term);
            if (score === null) continue;
            if (best === null || score < best) best = score;
          }
          return best === null ? null : { option, score: best };
        })
        .filter(
          (entry): entry is { option: ComboboxOption; score: number } =>
            entry !== null,
        )
        .sort((a, b) => a.score - b.score)
        .slice(0, maxOptions)
        .map(({ option }) => option);

      // When the input is empty, show recent/top options as-is.
      if (!term) return options.slice(0, maxOptions);
      return scored;
    }, [options, value, maxOptions]);

    useEffect(() => {
      setHighlight(0);
    }, [value, open]);

    function handleSelect(option: ComboboxOption) {
      onChange(option.value);
      onSelectOption?.(option);
      setOpen(false);
    }

    function handleKey(event: KeyboardEvent<HTMLInputElement>) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true);
        setHighlight((i) => Math.min(filtered.length - 1, i + 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlight((i) => Math.max(0, i - 1));
      } else if (event.key === "Enter") {
        const target = filtered[highlight];
        if (open && target) {
          event.preventDefault();
          handleSelect(target);
        }
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    }

    return (
      <Popover open={open && filtered.length > 0} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className={cn("relative", className)}>
            {leadingIcon ? (
              <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-muted-foreground">
                {leadingIcon}
              </span>
            ) : null}
            <Input
              ref={ref}
              id={id}
              name={name}
              value={value}
              autoFocus={autoFocus}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => {
                onChange(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => {
                // Allow click on list to register before we close.
                setTimeout(() => setOpen(false), 120);
              }}
              onKeyDown={handleKey}
              placeholder={placeholder}
              aria-invalid={ariaInvalid}
              className={cn(
                leadingIcon ? "pl-9" : "",
                "pr-9",
                inputClassName,
              )}
            />
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-[--radix-popover-trigger-width] max-h-72 overflow-y-auto scrollbar-thin p-1"
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              {allowFreeText
                ? "Pressione Enter para usar o que você digitou."
                : emptyHint}
            </p>
          ) : (
            <ul ref={listRef} className="space-y-0.5">
              {filtered.map((option, idx) => {
                const isActive = idx === highlight;
                const isSelected =
                  normalize(value) === normalize(option.value);
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(option);
                      }}
                      onMouseEnter={() => setHighlight(idx)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-foreground hover:bg-secondary/70",
                      )}
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">
                          {option.label}
                        </span>
                        {option.description ? (
                          <span className="truncate text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        {option.badge}
                        {isSelected ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </PopoverContent>
      </Popover>
    );
  },
);
Combobox.displayName = "Combobox";
