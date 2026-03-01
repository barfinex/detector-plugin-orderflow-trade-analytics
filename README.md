# @barfinex/detector-plugin-orderflow-trade-analytics

**Orderflow and trade analytics plugin** for the [Barfinex](https://barfinex.com) Detector — analyze trade flow, order book imbalance, and market microstructure in real time.

This plugin extends the Detector with metrics that candles alone don’t show: delta, CVD-style aggregates, absorption, and liquidity shifts. Use it from your strategies to improve entries and risk.

---

## What it does

- **Trade ingestion** — `ingestTrade` / `ingestOrderbook` to feed the plugin from detector market-data hooks.
- **Metrics** — delta ratio, cumulative volume, order book imbalance, large-trade VWAP, and configurable thresholds.
- **Plugin API** — `getMetrics`, `getDebugState`, `getOrderBookImbalanceFromState`, `getTradeDeltaByLastN` for strategy logic and debugging.
- **Detector integration** — runs as a detector plugin via `@barfinex/plugin-driver`; registers with Provider so Studio can call its plugin API.

---

## Installation

```sh
npm install @barfinex/detector-plugin-orderflow-trade-analytics
```

or

```sh
yarn add @barfinex/detector-plugin-orderflow-trade-analytics
```

---

## What's included

| Export | Purpose |
|--------|--------|
| `OrderflowTradeAnalyticsModule` | NestJS module for the plugin. |
| `OrderflowTradeAnalyticsService` | Plugin service: ingest, metrics, state. |
| `OrderflowTradeAnalyticsController` | REST/plugin API controller. |
| `SymbolMetrics`, `OrderflowState`, `AnalyticsConfig`, etc. | Types for metrics and config. |

---

## Documentation

- **Detector (host for this plugin)** — [Installation detector](https://barfinex.com/docs/installation-detector) — config and plugin list (e.g. `orderflow-trade-analytics`).
- **Barfinex overview** — [First Steps](https://barfinex.com/docs/first-steps), [Architecture](https://barfinex.com/docs/architecture), [Glossary](https://barfinex.com/docs/glossary).
- **APIs** — [Detector API reference](https://barfinex.com/docs/detector-api), [Provider API reference](https://barfinex.com/docs/provider-api), [Building with the API](https://barfinex.com/docs/frontend-api).
- **Troubleshooting** — [Typical problems and solutions](https://barfinex.com/docs/troubleshooting).

---

## Contributing

New metrics and detection ideas welcome. Open an issue or PR. Community: [Telegram](https://t.me/barfinex) · [GitHub](https://github.com/barfinex).

---

## License

Licensed under the [Apache License 2.0](LICENSE) with additional terms. Attribution to **Barfin Network Limited** and a link to [https://barfinex.com](https://barfinex.com) are required. Commercial use requires explicit permission. See [LICENSE](LICENSE) and the [Barfinex site](https://barfinex.com) for details.
