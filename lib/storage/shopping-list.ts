import { readStorage, SHOPPING_LIST_KEY, writeStorage } from "./storage";

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
}

export function getShoppingList(): ShoppingItem[] {
  return readStorage<ShoppingItem[]>(SHOPPING_LIST_KEY, []);
}

export function saveShoppingList(items: ShoppingItem[]) {
  writeStorage(SHOPPING_LIST_KEY, items);
}

export function addShoppingItems(names: string[]): ShoppingItem[] {
  const items = getShoppingList();
  const existing = new Set(items.map((item) => item.name.toLowerCase()));
  const additions = names
    .map((name) => name.trim())
    .filter(Boolean)
    .filter((name) => !existing.has(name.toLowerCase()))
    .map((name) => ({ id: crypto.randomUUID(), name, checked: false }));
  const next = [...additions, ...items];
  saveShoppingList(next);
  return next;
}
