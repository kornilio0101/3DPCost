# 3DP Cost Calculator

A modern, feature-rich 3D printing cost calculator built with React, TypeScript, and Vite. This tool helps 3D printing enthusiasts and professionals accurately estimate the cost of their prints, including filament, electricity, machine wear, and configurable profit margins.

<div align="center">
  <img src="https://raw.githubusercontent.com/kornilio0101/3DPCost/main/public/icon.png" width="150" alt="3DP Cost Calculator Icon">
</div>

## ✨ Features

- **Printer Library**: Manage your collection of 3D printers. Configure each machine's price, print wattage, warmup wattage, and expected lifespan (for depreciation). Easily reorder the list or collapse it for a cleaner view.
- **Filament Library**: Keep track of your own collection of filaments with custom names, colors, and prices per kg. Lists auto-scroll to newly added items for quick editing.
- **Single & Multi-material Support**:
  - Calculate costs for simple single-color prints.
  - Full multi-material support with per-filament pricing and automated purge waste calculation.
- **Comprehensive Cost Breakdown**:
  - **Filament Cost**: Exact usage based on grams.
  - **Electricity Cost**: Main print power + configurable warmup routine (e.g., bed heating).
  - **Waste/Purge Cost**: Account for basic waste (5%) and purge blocks (grams per change).
  - **Machine Depreciation**: Factor in the wear and tear of your specific machine.
- **Profit Margin Tiers**: Create custom margin tiers (e.g., Friends & Family at 10%, Commercial at 40%) and instantly apply them to calculate your final selling price.
- **Global Currency Support**: Choose from over 20 global currencies (defaulting to Euro €).
- **Persisted Settings**: All your printers, filaments, and settings are saved locally and persist between sessions.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- (Optional) Python 3.10+ if using the `pywebview` standalone build

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

To run the app in your browser with hot-module replacement (HMR):
```bash
npm run dev
```

## 📦 Building & Packaging

### Python Standalone Version (Minimal Size)
This project comes with a PyInstaller script to package the web app into a lightweight, portable Windows `.exe` using `pywebview`.

1. Build the production React frontend:
   ```bash
   npm run build
   ```
2. Install the necessary Python packages:
   ```bash
   pip install pywebview pyinstaller
   ```
3. Create the executable using the provided spec file:
   ```bash
   pyinstaller 3DP_Cost_Calculator.spec --clean
   ```
The portable executable will be generated inside the `dist/` folder.

### Electron Version (Alternative)
You can also build the app using Electron:
```bash
npm run build
npm run package
```
The output will be in the `release/` folder.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modern Vanilla CSS
- **Desktop Wrapper**: [pywebview](https://pywebview.flowrl.com/) / Electron
- **Packaging**: PyInstaller / Electron Packager

## 👤 Author

**Kornilio Tribalis**
- GitHub: [@kornilio0101](https://github.com/kornilio0101)

---
*Created with ❤ for the 3D Printing Community.*
