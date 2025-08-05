// File: api/signal.js

let activeSignal = null;

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const SIGNAL_LOGIC = (symbol, price) => {
  const entry = price;
  const sl = price - 70;
  const tp1 = price + 50;
  const tp2 = price + 100;
  const direction = "BUY";

  return {
    pair: symbol,
    entry,
    sl,
    tp1,
    tp2,
    direction,
    time: new Date().toLocaleTimeString("en-IN", { hour12: true }),
    status: "active"
  };
};

async function fetchBTCPrice() {
  const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
  const data = await res.json();
  return parseFloat(data.price);
}

async function fetchGoldPrice() {
  const res = await fetch("https://api.twelvedata.com/price?symbol=XAU/USD&apikey=demo");
  const data = await res.json();
  return parseFloat(data.price);
}

export default async function handler(req, res) {
  try {
    if (!activeSignal) {
      const now = new Date();
      const day = now.getDay();

      if (day === 6 || day === 0) {
        const btcPrice = await fetchBTCPrice();
        activeSignal = SIGNAL_LOGIC("BTCUSD", btcPrice);
      } else {
        const rand = Math.random() > 0.5 ? "BTC" : "GOLD";
        if (rand === "BTC") {
          const btcPrice = await fetchBTCPrice();
          activeSignal = SIGNAL_LOGIC("BTCUSD", btcPrice);
        } else {
          const goldPrice = await fetchGoldPrice();
          activeSignal = SIGNAL_LOGIC("XAUUSD", goldPrice);
        }
      }
    }

    res.status(200).json({
      signal: activeSignal
    });

  } catch (error) {
    console.error("Error generating signal:", error);
    res.status(500).json({ error: "Signal generation failed." });
  }
}
