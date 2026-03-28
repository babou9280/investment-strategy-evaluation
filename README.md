# Evaluation of an Automated Investment Strategy

Author : Ayman BESBAS  
Date : 2026, March 10th

## Overview

This repository contains the research project **"Evaluation of an Automated Investment Strategy"**.

The objective of the project is to evaluate the robustness and real-world feasibility of an investment strategy based on signals provided by the application *StocksToBuyNowAI*.

The study focuses on whether the strategy can generate **reproducible and economically exploitable performance once real trading frictions are considered**.

This repository contains the full academic report and data sources for the project.

The analysis is structured around two complementary stages:

• **Backtest (2020 – 2023)**  
Evaluation of the structural behaviour of the strategy using historical data.

• **Live Test (2025 – 2026)**  
Real-time execution of the signals in order to evaluate performance under realistic market conditions.

The comparison between these two stages allows the study of the gap between **theoretical performance and implementable performance**.

---

# Methodology

The evaluation follows a quantitative scorecard approach based on four main dimensions :

### Performance
- Total return
- CAGR
- Win rate
- Profit Factor
- Average gain / loss per trade

### Risk
- Volatility
- Maximum Drawdown
- Sharpe Ratio
- Sortino Ratio
- Calmar Ratio

### Robustness
- CVaR (Expected Shortfall)
- Skewness
- Kurtosis
- Adjusted Sharpe Ratio

### Sustainability
- Concentration of performance (Top-5 trades)
- Herfindahl-Hirschman Index
- Turnover

---

# Benchmark

To provide a reference point, the strategy is compared with the **S&P 500 (SPY ETF)** over the same tests periods.


---

# Main Question of the Study

The project attempts to answer the following question:

> Can an automated investment strategy remain profitable and robust once real market frictions such as transaction costs, spreads, slippage and currency conversion are taken into account?

---

# Full Report

The complete academic report can be found in the tab :

Évaluation Stratégie - Projet Ayman BESBAS.pdf

The full report is written in French. 

---

# Data

Backtest dataset :

https://docs.google.com/spreadsheets/d/10MBOxn1x_BtPBNMxfavU_j_BSuzFM4nBvZ-OriIQfhc

Live test dataset :

https://docs.google.com/spreadsheets/d/10dL1sK63Z7Pi0IzyhwFIim7PzLYW-acDXe3JD7qb9tw

---

# Disclaimer

This project was conducted for academic purposes and does not constitute financial advice.
