import { create } from "zustand";

type Quote = {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  change: number;
  changePct: number;
  volume: number;
  ts: number;
};

type Trade = {
  symbol: string;
  price: number;
  size: number;
  side: "buy" | "sell";
  ts: number;
};

type Store = {
  selectedSymbol: string;
  setSelectedSymbol: (s: string) => void;

  connection: "connected" | "reconnecting" | "offline";
  setConnection: (c: Store["connection"]) => void;

  quotesBySymbol: Record<string, Quote>;
  upsertQuote: (q: Quote) => void;

  tradesBySymbol: Record<string, Trade[]>;
  pushTrade: (t: Trade) => void;
};

export const useStore = create<Store>((set) => ({
  selectedSymbol: "AAPL",
  setSelectedSymbol: (s) => set({ selectedSymbol: s }),

  connection: "offline",
  setConnection: (c) => set({ connection: c }),

  quotesBySymbol: {},
  upsertQuote: (q) =>
    set((st) => ({
      quotesBySymbol: { ...st.quotesBySymbol, [q.symbol]: q },
    })),

  tradesBySymbol: {},
  pushTrade: (t) =>
    set((st) => {
      const prev = st.tradesBySymbol[t.symbol] ?? [];
      const next = [t, ...prev].slice(0, 50); // keep last 50
      return { tradesBySymbol: { ...st.tradesBySymbol, [t.symbol]: next } };
    }),
}));