// Client-side shopping state: enquiry list (quote basket), wishlist, compare and recently
// viewed, persisted to localStorage. A backend would replace these with API-backed sessions.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { EnquiryItem } from './enquiry';
import { load, save } from './storage';

interface Toast {
  id: number;
  text: string;
  action?: { label: string; to: string };
}

interface StoreValue {
  list: EnquiryItem[];
  addToList: (item: EnquiryItem) => void;
  updateQty: (variantId: string, qty: number) => void;
  removeFromList: (variantId: string) => void;
  clearList: () => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  compare: string[];
  toggleCompare: (slug: string) => void;
  recent: string[];
  markViewed: (slug: string) => void;
  toasts: Toast[];
  notify: (text: string, action?: Toast['action']) => void;
  enquiry: { open: boolean; items: EnquiryItem[]; kind: 'product' | 'list' };
  openEnquiry: (items: EnquiryItem[], kind?: 'product' | 'list') => void;
  closeEnquiry: () => void;
}

const Ctx = createContext<StoreValue | null>(null);

function usePersisted<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => load(key, init));
  useEffect(() => save(key, v), [key, v]);
  return [v, setV] as const;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [list, setList] = usePersisted<EnquiryItem[]>('mgr.list', []);
  const [wishlist, setWish] = usePersisted<string[]>('mgr.wish', []);
  const [compare, setCompare] = usePersisted<string[]>('mgr.compare', []);
  const [recent, setRecent] = usePersisted<string[]>('mgr.recent', []);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [enquiry, setEnquiry] = useState<StoreValue['enquiry']>({ open: false, items: [], kind: 'product' });

  const notify = useCallback((text: string, action?: Toast['action']) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, action }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      list,
      addToList: (item) => {
        setList((l) => {
          const ex = l.find((x) => x.variantId === item.variantId);
          return ex ? l.map((x) => (x.variantId === item.variantId ? { ...x, qty: x.qty + item.qty } : x)) : [...l, item];
        });
        notify(`${item.title} added to your enquiry list`, { label: 'View list', to: '/enquiry-list' });
      },
      updateQty: (id, qty) => setList((l) => l.map((x) => (x.variantId === id ? { ...x, qty: Math.max(1, Math.min(999, qty)) } : x))),
      removeFromList: (id) => setList((l) => l.filter((x) => x.variantId !== id)),
      clearList: () => setList([]),
      wishlist,
      toggleWish: (slug) => {
        const has = wishlist.includes(slug);
        setWish((w) => (has ? w.filter((s) => s !== slug) : [...w, slug]));
        notify(has ? 'Removed from wishlist' : 'Saved to wishlist', has ? undefined : { label: 'View', to: '/wishlist' });
      },
      compare,
      toggleCompare: (slug) => {
        if (compare.includes(slug)) return setCompare((c) => c.filter((s) => s !== slug));
        if (compare.length >= 3) return notify('You can compare up to three pieces', { label: 'Compare', to: '/compare' });
        setCompare((c) => [...c, slug]);
        notify('Added to compare', { label: 'Compare now', to: '/compare' });
      },
      recent,
      markViewed: (slug) => setRecent((r) => [slug, ...r.filter((s) => s !== slug)].slice(0, 8)),
      toasts,
      notify,
      enquiry,
      openEnquiry: (items, kind = 'product') => setEnquiry({ open: true, items, kind }),
      closeEnquiry: () => setEnquiry((e) => ({ ...e, open: false })),
    }),
    [list, wishlist, compare, recent, toasts, enquiry, notify, setList, setWish, setCompare, setRecent],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore outside StoreProvider');
  return v;
}
