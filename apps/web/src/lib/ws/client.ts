import { useStore } from "../../state/store";
import type { ServerMsg, ClientMsg } from "../../../../../shared/ws-protocol/protocol";

export function startWs() {
  const url = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080";
  let ws: WebSocket | null = null;
  let closedByUser = false;
  let reconnectTimer: number | null = null;

  const connect = () => {
    useStore.getState().setConnection("reconnecting");
    ws = new WebSocket(url);

    ws.onopen = () => {
      useStore.getState().setConnection("connected");
      // subscribe to all symbols initially (or watchlist)
      const symbols = Object.keys(useStore.getState().quotesBySymbol);
      ws?.send(JSON.stringify({ type: "subscribe", symbols: symbols.length ? symbols : ["AAPL","TSLA","NVDA","MSFT"] }));
    };

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data) as ServerMsg;
      if (msg.type === "snapshot") {
        for (const s of msg.symbols) useStore.getState().upsertQuote(s);
      }
      if (msg.type === "quote") useStore.getState().upsertQuote(msg);
      if (msg.type === "trade") useStore.getState().pushTrade(msg);
    };

    ws.onclose = () => {
      if (closedByUser) return;
      useStore.getState().setConnection("offline");
      reconnectTimer = window.setTimeout(connect, 600);
    };
  };

  connect();

  return {
    close() {
      closedByUser = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      ws?.close();
    },
    subscribe(symbols: string[]) {
      const msg: ClientMsg = {
        type: "subscribe",
        symbols
      };

      ws?.send(JSON.stringify(msg));
    },
  };
}