import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    const price = parseFloat(response.data.price);

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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch BTC price' });
  }
}
