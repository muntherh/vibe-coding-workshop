import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Pencil, Plus, RotateCcw, X } from "lucide-react";
import { useRef, useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import { CodeBlock } from "@/components/CodeBlock";
import { OutputPanel } from "@/components/OutputPanel";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { cleanInput, listLiteral, reprList } from "@/lib/simulate";

const DEFAULT_FRUITS = ["Apple", "Banana", "Orange"];
const SUGGESTIONS = ["Mango", "Lemon", "Grape", "Peach", "Fig"];
const MAX_ITEMS = 6;

interface ListItem {
  key: string;
  value: string;
}

let keyCounter = 0;
const makeItems = (values: string[]): ListItem[] =>
  values.map((value) => ({ key: `item-${keyCounter++}`, value }));

/** Slide 08 — a list the learner can add to, edit and empty out. */
export function ListSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<ListItem[]>(() =>
    makeItems(DEFAULT_FRUITS),
  );
  const [draft, setDraft] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const values = items.map((item) => item.value);

  const code = [`fruits = ${listLiteral(values)}`, "print(fruits)"].join("\n");

  const nextSuggestion =
    SUGGESTIONS.find((suggestion) => !values.includes(suggestion)) ?? "Cherry";

  const addItem = () => {
    if (items.length >= MAX_ITEMS) return;
    const value = draft.trim() === "" ? nextSuggestion : draft.trim();
    setItems((current) => [...current, ...makeItems([value])]);
    setDraft("");
  };

  const removeItem = (key: string) => {
    setItems((current) => current.filter((item) => item.key !== key));
    if (editingKey === key) setEditingKey(null);
  };

  const startEdit = (item: ListItem) => {
    setEditingKey(item.key);
    setEditValue(item.value);
    window.requestAnimationFrame(() => editInputRef.current?.select());
  };

  const commitEdit = () => {
    if (editingKey === null) return;
    const trimmed = editValue.trim();
    setItems((current) =>
      current.map((item) =>
        item.key === editingKey
          ? { ...item, value: trimmed === "" ? item.value : trimmed }
          : item,
      ),
    );
    setEditingKey(null);
  };

  const reset = () => {
    setItems(makeItems(DEFAULT_FRUITS));
    setDraft("");
    setEditingKey(null);
  };

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Collections"
      title="List"
      lead="A list stores multiple items, and it can be changed."
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="min-w-0">
          <ul className="flex flex-wrap gap-2.5 sm:gap-3">
            <AnimatePresence initial={false} mode="popLayout">
              {items.map((item, itemIndex) => {
                const isEditing = editingKey === item.key;

                return (
                  <motion.li
                    key={item.key}
                    layout={!reduceMotion}
                    initial={
                      reduceMotion ? false : { opacity: 0, scale: 0.9, y: 10 }
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.9, y: -8 }
                    }
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative flex items-center gap-3 rounded-xl border border-line bg-navy-900/60 py-3.5 pr-3 pl-4 transition-colors duration-200 hover:border-py-blue/45"
                  >
                    <span className="font-mono text-[0.75rem] text-dim tabular-nums">
                      {itemIndex}
                    </span>

                    {isEditing ? (
                      <input
                        ref={editInputRef}
                        value={editValue}
                        onChange={(event) =>
                          setEditValue(cleanInput(event.target.value, 14))
                        }
                        onBlur={commitEdit}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") commitEdit();
                          if (event.key === "Escape") setEditingKey(null);
                        }}
                        aria-label={`Edit item ${itemIndex}`}
                        autoFocus
                        className="w-[7ch] rounded-md border border-py-yellow/50 bg-navy-950 px-2 py-1 font-mono text-[clamp(0.9rem,1.1vw,1.15rem)] text-chalk focus:outline-none"
                      />
                    ) : (
                      <span className="font-mono text-[clamp(0.98rem,1.35vw,1.5rem)] text-chalk">
                        {item.value}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          isEditing ? commitEdit() : startEdit(item)
                        }
                        aria-label={
                          isEditing
                            ? `Save item ${itemIndex}`
                            : `Edit item ${itemIndex}, ${item.value}`
                        }
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-dim transition-colors duration-200 hover:bg-white/8 hover:text-py-yellow"
                      >
                        {isEditing ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Pencil className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Remove item ${itemIndex}, ${item.value}`}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-dim transition-colors duration-200 hover:bg-white/8 hover:text-bad"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </motion.li>
                );
              })}
            </AnimatePresence>

            {items.length === 0 ? (
              <li className="rounded-xl border border-dashed border-line px-4 py-3 font-mono text-[0.95rem] text-dim">
                The list is empty
              </li>
            ) : null}
          </ul>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div className="flex min-w-[10rem] flex-1 flex-col gap-2 sm:max-w-[16rem]">
              <label
                htmlFor="list-new-item"
                className="font-mono text-[0.72rem] tracking-[0.2em] text-dim uppercase"
              >
                New item
              </label>
              <input
                id="list-new-item"
                type="text"
                value={draft}
                placeholder={nextSuggestion}
                onChange={(event) =>
                  setDraft(cleanInput(event.target.value, 14))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") addItem();
                }}
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-xl border border-line bg-navy-950/70 px-3.5 py-2.5 font-mono text-[clamp(0.9rem,1.1vw,1.12rem)] text-chalk transition-colors duration-200 placeholder:text-dim hover:border-py-blue/40 focus:border-py-blue/70 focus:outline-none"
              />
            </div>

            <ActionButton
              icon={Plus}
              variant="primary"
              onClick={addItem}
              disabled={items.length >= MAX_ITEMS}
            >
              Add Item
            </ActionButton>
            <ActionButton icon={RotateCcw} variant="ghost" onClick={reset}>
              Reset
            </ActionButton>
          </div>

          <p className="mt-3 text-[clamp(0.85rem,1vw,1.05rem)] text-dim">
            {items.length >= MAX_ITEMS
              ? "That is enough fruit for one slide."
              : "Use the pencil to edit an item, or the cross to remove it."}
          </p>
        </div>

        <div className="grid min-w-0 gap-4">
          <Reveal delay={0.24}>
            <CodeBlock
              code={code}
              fileName="fruits.py"
              emphasis="brackets"
              size="md"
            />
          </Reveal>
          <Reveal delay={0.32}>
            <OutputPanel
              lines={[reprList(values)]}
              minLines={1}
              placeholder=""
              size="md"
            />
          </Reveal>
        </div>
      </div>
    </PresentationSection>
  );
}
