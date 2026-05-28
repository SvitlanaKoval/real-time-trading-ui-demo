export function createMarketSim(symbols: string[]) {
  const state = new Map<string, any>();

  for (const s of symbols) {
    const base = 100 + Math.random() * 200;
    state.set(s, {
      symbol: s,
      price: base,
      bid: base - 0.02,
      ask: base + 0.02,
      open: base,
      volume: Math.floor(100_000 + Math.random() * 900_000),
      ts: Date.now(),
    });
  }

  function snapshot() {
    return {
      type: "snapshot",
      symbols: [...state.values()].map((x) => {
        const change = x.price - x.open;
        const changePct = (change / x.open) * 100;
        return { ...x, change, changePct };
      }),
    };
  }

  function tick() {
    const now = Date.now();
    const out: any[] = [];

    // produce 3 random symbol updates per tick
    for (let i = 0; i < 3; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const x = state.get(symbol);

      const delta = (Math.random() - 0.5) * 0.6;
      x.price = Math.max(1, x.price + delta);
      x.bid = x.price - 0.02 - Math.random() * 0.02;
      x.ask = x.price + 0.02 + Math.random() * 0.02;
      x.volume += Math.floor(Math.random() * 1500);
      x.ts = now;

      const change = x.price - x.open;
      const changePct = (change / x.open) * 100;

      out.push({
        type: "quote",
        symbol,
        price: x.price,
        bid: x.bid,
        ask: x.ask,
        volume: x.volume,
        change,
        changePct,
        ts: now,
      });

      if (Math.random() < 0.6) {
        out.push({
          type: "trade",
          symbol,
          price: x.price,
          size: Math.floor(1 + Math.random() * 400),
          side: Math.random() < 0.5 ? "buy" : "sell",
          ts: now,
        });
      }
    }

    return out;
  }

  return { snapshot, tick, symbols: () => symbols };
}