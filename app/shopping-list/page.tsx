"use client";

import { useMemo, useState } from "react";
import { Check, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/ToastProvider";
import { getShoppingList, saveShoppingList, type ShoppingItem } from "@/lib/storage/shopping-list";

export default function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingItem[]>(() => (typeof window === "undefined" ? [] : getShoppingList()));
  const [value, setValue] = useState("");
  const { showToast } = useToast();

  const remaining = useMemo(() => items.filter((i) => !i.checked).length, [items]);

  const update = (next: ShoppingItem[]) => {
    setItems(next);
    saveShoppingList(next);
  };

  const addItem = () => {
    const name = value.trim();
    if (!name) return;
    if (items.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
      showToast("Item already in your shopping list", "info");
      setValue("");
      return;
    }
    update([{ id: crypto.randomUUID(), name, checked: false }, ...items]);
    setValue("");
    showToast("Item added to shopping list", "success");
  };

  return (
    <main className="container-shell section-pad">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Shopping list</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Your ingredient checklist</h1>
        <p className="mt-4 text-base leading-7 text-muted">Add ingredients you need, check them off as you shop, and keep everything in one place.</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card-surface rounded-[2rem] p-6 sm:p-7">
          <label htmlFor="shopping-item" className="block text-sm font-medium text-foreground">Add an ingredient</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="shopping-item"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
              placeholder="e.g. Olive oil"
              className="h-12 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <button type="button" onClick={addItem} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-deep">
              <Plus className="h-4 w-4" /> Add item
            </button>
          </div>

          <div className="mt-8">
            {items.length === 0 ? (
              <EmptyState icon={ShoppingBag} title="Your shopping list is empty" description="Add ingredients manually or from a recipe details page to start planning your next shop." />
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => update(items.map((i) => i.id === item.id ? { ...i, checked: !i.checked } : i))}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${item.checked ? "border-primary bg-primary text-white" : "border-border bg-surface text-transparent hover:border-primary/40"}`}
                      aria-label={item.checked ? `Mark ${item.name} as not purchased` : `Mark ${item.name} as purchased`}
                      aria-pressed={item.checked}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <span className={`flex-1 text-sm ${item.checked ? "text-muted line-through" : "text-foreground"}`}>{item.name}</span>
                    <button type="button" onClick={() => update(items.filter((i) => i.id !== item.id))} className="rounded-full p-2 text-muted transition hover:bg-surface-muted hover:text-red-500" aria-label={`Remove ${item.name}`}>
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="card-surface h-fit rounded-[2rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Overview</p>
          <dl className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-sm"><dt className="text-muted">Total items</dt><dd className="font-semibold text-foreground">{items.length}</dd></div>
            <div className="flex items-center justify-between text-sm"><dt className="text-muted">Remaining</dt><dd className="font-semibold text-foreground">{remaining}</dd></div>
            <div className="flex items-center justify-between text-sm"><dt className="text-muted">Purchased</dt><dd className="font-semibold text-foreground">{items.length - remaining}</dd></div>
          </dl>
          <div className="mt-6 space-y-3">
            <button type="button" onClick={() => update(items.filter((i) => !i.checked))} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary">
              <Check className="h-4 w-4" /> Clear completed
            </button>
            <button type="button" onClick={() => { update([]); showToast("Shopping list cleared", "info"); }} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-red-200 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30">
              <Trash2 className="h-4 w-4" /> Clear all
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
