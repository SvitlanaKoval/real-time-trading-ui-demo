import { useEffect } from "react";
import { startWs } from "./lib/ws/client";
import { useStore } from "./state/store";
import { PriceChart } from "./components/PriceChart";
import "./App.css";


function App() {
  const quotesBySymbol = useStore((s) => s.quotesBySymbol);
  const connection = useStore((s) => s.connection);

  useEffect(() => {
    startWs();
  }, []);

  const quotes = Object.values(quotesBySymbol);
  const selectedQuote = quotes[0];

  const chartData = quotes.map((q, index) => ({
  time: `${index}`,
  price: q.price,
}));

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Real-Time Market Data</p>
          <h1>Trading Dashboard</h1>
          <p className="subtitle">Live quotes, bid/ask prices, price changes, and volume.</p>
        </div>

        <div className={`status-pill ${connection}`}>
          {connection}
        </div>
      </header>

      <section className="metrics-grid">
        <div className="metric-card">
          <span>Selected Symbol</span>
          <strong>{selectedQuote?.symbol ?? "--"}</strong>
        </div>

        <div className="metric-card">
          <span>Last Price</span>
          <strong>{selectedQuote ? `$${selectedQuote.price.toFixed(2)}` : "--"}</strong>
        </div>

        <div className="metric-card">
          <span>Change %</span>
          <strong className={selectedQuote?.changePct >= 0 ? "positive" : "negative"}>
            {selectedQuote ? `${selectedQuote.changePct.toFixed(2)}%` : "--"}
          </strong>
        </div>

        <div className="metric-card">
          <span>Volume</span>
          <strong>{selectedQuote ? selectedQuote.volume.toLocaleString() : "--"}</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        <section className="card">
          <div className="section-header">
            <div>
              <p className="eyebrow">Streaming Quotes</p>
              <h2>Watchlist</h2>
            </div>
          </div>

          {quotes.length === 0 ? (
            <p className="empty-state">Waiting for market data...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Bid</th>
                  <th>Ask</th>
                  <th>Change</th>
                  <th>Change %</th>
                  <th>Volume</th>
                </tr>
              </thead>

              <tbody>
                {quotes.map((q) => (
                  <tr key={q.symbol}>
                    <td>{q.symbol}</td>
                    <td>${q.price.toFixed(2)}</td>
                    <td>${q.bid.toFixed(2)}</td>
                    <td>${q.ask.toFixed(2)}</td>
                    <td className={q.change >= 0 ? "positive" : "negative"}>
                      {q.change.toFixed(2)}
                    </td>
                    <td className={q.changePct >= 0 ? "positive" : "negative"}>
                      {q.changePct.toFixed(2)}%
                    </td>
                    <td>{q.volume.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="card">
          <div className="section-header">
            <div>
              <p className="eyebrow">Analytics</p>
              <h2>Live Price Chart</h2>
            </div>
          </div>

          <PriceChart data={chartData} />
        </section>
      </section>
    </main>
  );
}

export default App;