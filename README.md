# @barfinex/detector-plugin-orderflow-trade-analytics

**`@barfinex/detector-plugin-orderflow-trade-analytics`** is a specialized plugin for the [Barfinex](https://barfinex.com) ecosystem, 
focused on **orderflow analytics** and **market microstructure analysis**.  
It extends the Barfinex detector framework with advanced capabilities to monitor trade flow, liquidity shifts, 
and anomalies in order execution.

---

## 🚀 Purpose

This plugin enables trading systems to leverage **orderflow-based signals** for better decision-making.  
It helps detect:

- 📊 **Imbalances in orderflow** — when aggressive buyers or sellers dominate.  
- 🔎 **Absorption levels** — areas where liquidity providers absorb large amounts of market orders.  
- ⚡ **Momentum ignition** — detecting sudden bursts of trading activity.  
- 🏦 **Liquidity shifts** — changes in depth and volume distribution across the order book.  
- 🔄 **Stop hunts & sweep patterns** — when price pushes through liquidity clusters.  

The goal is to give **quantitative traders** and **systematic strategies** access to real-time market insights that 
are not visible from candlestick data alone.

---

## 📦 Installation

```sh
npm install @barfinex/detector-plugin-orderflow-trade-analytics
```

or

```sh
yarn add @barfinex/detector-plugin-orderflow-trade-analytics
```

---

## 📚 What's Included

The plugin provides a rich set of tools for analyzing orderflow:

- **Analytics Services**  
  Components to compute metrics such as executed buy/sell volume, delta, and cumulative volume profiles.

- **Orderflow Indicators**  
  Custom metrics like CVD (Cumulative Volume Delta), Imbalance Ratios, and Aggression Index.

- **Integration Layer**  
  Works seamlessly with `@barfinex/detector`, `@barfinex/orders`, and `@barfinex/connectors` to process live 
  and historical data.

- **Configurable Rules**  
  Traders can define thresholds for imbalances, minimum volume filters, and signal triggers.

---

## 🤝 Contributing

Contributions are welcome to enhance the **orderflow analytics toolkit**:

- 📌 Add new indicators and metrics.  
- 🛠 Improve detection algorithms.  
- 💡 Share real-world trading strategies based on orderflow.  

Join our Telegram community to discuss features: [t.me/barfinex](https://t.me/barfinex)

---

## 📜 License

This repository is licensed under the [Apache License 2.0](LICENSE) with additional restrictions.

### Key Terms:
1. **Attribution**: Proper credit must be given to the original author, Barfin Network Limited, with a link to the official website: [https://barfin.network/](https://barfin.network/).  
2. **Non-Commercial Use**: The use of this codebase for commercial purposes is prohibited without explicit written permission.  
3. **Display Requirements**: For non-commercial use, the following must be displayed:  
   - The name "Barfin Network Limited".  
   - The official logo.  
   - A working link to [https://barfinex.com/](https://barfinex.com/).  

For further details or to request commercial use permissions, contact **Barfin Network Limited** through the official website.  
