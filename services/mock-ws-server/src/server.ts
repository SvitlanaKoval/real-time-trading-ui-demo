import { WebSocketServer } from "ws";
import type { RawData } from "ws";
import { createMarketSim } from "./market-sim";
import type { ClientMsg } from "../../../shared/ws-protocol/protocol";

const PORT = Number(process.env.PORT ?? 8080);
const wss = new WebSocketServer({ port: PORT });

const sim = createMarketSim([
  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
  "AMZN",
  "META",
  "GOOG",
  "AMD",
]);

function rawToString(raw: RawData): string {
  if (typeof raw === "string") return raw;
  if (Buffer.isBuffer(raw)) return raw.toString("utf8");
  if (raw instanceof ArrayBuffer) return Buffer.from(raw).toString("utf8");
  return Buffer.concat(raw).toString("utf8"); // Buffer[]
}

wss.on("connection", (ws) => {
  // send snapshot
  ws.send(JSON.stringify(sim.snapshot()));

  let subscribed = new Set(sim.symbols());

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(rawToString(raw)) as ClientMsg;
      if (msg.type === "subscribe" && Array.isArray(msg.symbols)) {
        subscribed = new Set(msg.symbols);
      }
    } catch (e) {
      console.error("Bad WS message:", e);
    }
  });

  const interval = setInterval(() => {
    const updates = sim.tick();
    for (const u of updates) {
      if (subscribed.has(u.symbol)) ws.send(JSON.stringify(u));
    }
  }, 100); // 10Hz

  ws.on("close", () => clearInterval(interval));
});

console.log(`Mock WS server running on ws://localhost:${PORT}`);