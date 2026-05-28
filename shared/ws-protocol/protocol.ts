// shared/ws-protocol/protocol.ts

export type SnapshotMsg = {
  type: "snapshot";
  symbols: Array<{
    symbol: string;
    price: number;
    bid: number;
    ask: number;
    change: number;
    changePct: number;
    volume: number;
    ts: number;
  }>;
};

export type QuoteMsg = {
  type: "quote";
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  change: number;
  changePct: number;
  volume: number;
  ts: number;
};

export type TradeMsg = {
  type: "trade";
  symbol: string;
  price: number;
  size: number;
  side: "buy" | "sell";
  ts: number;
};

export type SubscribeMsg = {
  type: "subscribe";
  symbols: string[];
};

export type ServerMsg = SnapshotMsg | QuoteMsg | TradeMsg;
export type ClientMsg = SubscribeMsg;