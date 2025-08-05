export default async function handler(req, res) {
  const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
  const data = await response.json();
  const price = parseFloat(data.price);

  const signal = {
    pair: 'BTCUSD',
    entry: price,
    sl: price - 70,
    tp1: price + 50,
    tp2: price + 100,
    direction: 'BUY',
    time: new Date().toLocaleTimeString('en-IN', { hour12: true }),
    status: 'active'
  };

  res.status(200).json({ signal });
}
