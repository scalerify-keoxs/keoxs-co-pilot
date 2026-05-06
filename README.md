# Keoxs Co-Pilot 🚀

**1-Click Amazon PPC Audit & Optimization**
*An open-source intelligence solution by [Scalerify.com](https://scalerify.com)*

---

## 📖 Overview
**Keoxs Co-Pilot** is a powerful, privacy-first desktop application designed for Amazon Sellers and PPC Consultants. It analyzes your Amazon Search Term Reports (.csv or .xlsx) locally on your machine, applying advanced unit economics formulas to generate actionable bid optimizations and strategic recommendations.

Unlike SaaS tools that upload your financial data to the cloud, **Keoxs Co-Pilot runs 100% locally**. 

## ✨ Features
- **Privacy-First**: No data leaves your computer. Your Search Term Reports are processed entirely on your local machine.
- **Advanced Unit Economics**: Calculates Break-Even ACOS dynamically using your Average Sale Price, COGS, and FBA Fees.
- **Automated Triage**: Automatically categorizes keywords into:
  - 🔴 **Urgencies (Bleeders)**: Wasted spend with 0 sales.
  - 🟠 **Optimizations**: Poor CTR, low CVR, or ACOS > Break-Even.
  - 🟢 **Opportunities (Harvest)**: Highly profitable search terms ready for Exact Match scaling.
- **AI Strategic Brain**: Connects to the free Google Gemini API to read your data like a Senior PPC Manager and generate a strategic action plan.
- **Bulk Export**: Download your optimized recommendations as an Amazon-ready Bulk File CSV to upload directly to Seller Central.
- **Multi-Language**: Available in English, French, Spanish, Italian, and German.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, CSS (Responsive & Dark Mode)
- **Backend**: Python, FastAPI, Pandas
- **AI Integration**: Google Generative AI (Gemini)

## 🚀 Quick Start (One-Liner)

The easiest way to install and run Keoxs Co-Pilot is to use our automated installation script. It will automatically clone the repository, install Python and Node.js dependencies, and create a 1-click startup script for you.

### Windows (PowerShell)
```powershell
powershell -c "irm https://keoxs.com/install.ps1 | iex"
```

### macOS & Linux (Terminal)
```bash
curl -sSL https://keoxs.com/install.sh | bash
```

Once installed, simply open the newly created `keoxs-co-pilot` folder and run `start-keoxs.bat` (Windows) or `./start-keoxs.sh` (macOS/Linux).

---

## 🛠️ Manual Installation (For Developers)

If you prefer to set up the environment manually, ensure you have **Node.js (v16+)** and **Python (3.9+)** installed.

### 1. Setup Backend
```bash
git clone https://github.com/scalerify-keoxs/keoxs-co-pilot.git
cd keoxs-co-pilot/backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn api:app --host 127.0.0.1 --port 8001
```

### 2. Setup Frontend
Open a new terminal window:
```bash
cd keoxs-co-pilot/frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request. If you find a bug, please open an issue in the issue tracker.

## 📄 License
This project is open-source and available under the MIT License.

---
Built by [David DADDI](https://www.linkedin.com/in/david-daddi-tkoi/) @ Scalerify.
