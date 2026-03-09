# 3DP Cost Calculator

A modern, feature-rich 3D printing cost calculator built with React, TypeScript, and Vite. This tool helps 3D printing enthusiasts and professionals accurately estimate the cost of their prints, including filament, electricity, machine wear, and profit margins.

![3DP Cost Calculator](https://raw.githubusercontent.com/kornilio0101/3DPCost/main/public/vite.svg) *Note: Replace with actual screenshot if available*

## ✨ Features

- **Filament Library**: Manage your own collection of filaments with custom names, colors, and prices.
- **Single & Multi-material Support**:
  - Calculate costs for simple prints.
  - Multi-material support with per-filament pricing or a global override.
- **Comprehensive Cost Breakdown**:
  - **Filament Cost**: Exact usage based on grams.
  - **Electricity Cost**: Main print power + configurable warmup routine (e.g., bed heating).
  - **Waste/Purge Cost**: Account for basic waste (5%) and purge blocks (grams per change).
  - **Machine Deprecation**: Factor in the cost of your machine over its lifespan (default 4000h).
- **Profit Margin**: Easily add a percentage-based margin to find your final selling price.
- **Global Currency Support**: Choose from over 20 global currencies (USD, EUR, GBP, JPY, etc.).
- **Persisted Settings**: All your filaments and settings are saved locally in your browser/app.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kornilio0101/3DPCost.git
   cd 3DPCost
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the app in development mode (with Vite HMR and Electron):
```bash
npm run dev
```

### Building & Packaging

#### Electron Version (Windows)
To build the production assets and package the app into an executable:
```bash
npm run build
npm run package
```
The output will be in the `release/` folder.

#### Python Version (PyInstaller)
If you prefer the Python-based `pywebview` version:
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Install Python dependencies:
   ```bash
   pip install pywebview
   ```
3. Create the executable using the provided spec file:
   ```bash
   pyinstaller 3DP_Cost_Calculator_v7.spec
   ```

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modern Vanilla CSS
- **Desktop Wrapper**: Electron / [pywebview](https://pywebview.flowrl.com/)
- **Packaging**: Electron Packager / PyInstaller

## 👤 Author

**Kornilio Tribalis**
- GitHub: [@kornilio0101](https://github.com/kornilio0101)

---
*Created with ❤ for the 3D Printing Community.*
