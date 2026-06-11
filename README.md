# YAATAL Control Center Bilingual Docs & Workflows SSOT

YAATAL is a high-performance, edge-optimized live translation portal designed to connect speech and text across languages in real-time. This application serves as the central **Single Source of Truth (SSOT)** for our architectural blueprints, external workflow hubs, and latency budgets.

---

## 🚀 Core Features

*   **Bilingual Docs Portal (EN / FR)**: Render static or database-driven documentation. Supports Markdown (via `marked`) and safe native HTML page embeds (preserving visual pipelines, reframes, and gate-line styling).
*   **Workflows & Tools Launchpad**: Categorized control panel linking Google Sheets (translation caches), Google Colab & Modal (GPU training and pipelines), Hugging Face Spaces, Supabase DB panels, and Apache Airflow pipelines.
*   **Interactive Latency Budget Calculator**: Adjust range sliders for ASR, MT, and TTS stages to calculate total delay and visualize proportional segment bars. Click presets to compare a **Nemotron Edge Cascade** against a **Monolithic S2ST (Hibiki)**.
*   **Model Playground & Feedback Loop**: Live input sandbox querying Hugging Face translation models. Corrected translations can be submitted back to a Supabase database to trigger **n8n** dataset preparation workflows.
*   **Hybrid Offline/Live Mode**: Automatically falls back to static JSON lists if Supabase connection details are missing, ensuring local testing never breaks.

---

## 🛠️ Tech Stack & Libraries

*   **Core Framework**: [Vite](https://vitejs.dev/) + [React](https://react.dev/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Markdown Compiler**: [Marked](https://marked.js.org/)
*   **Styling**: Vanilla CSS (Premium Glassmorphic and Classic Paper / Sleek Charcoal theme tokens)
*   **Backend Client**: [@supabase/supabase-js](https://supabase.com/docs/reference/javascript/introduction)

---

## 📥 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Local Setup
Clone this repository and install dependencies in the directory:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file at the root of the project to enable Supabase syncing and Hugging Face translation models:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_HF_API_KEY=hf_your_huggingface_token
```
*If left blank, the portal runs automatically in **Offline Fallback Mode**.*

### 4. Running the Dev Server
To start the local development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

### 5. Document Compiler Script
To compile new documents placed inside `docs/en/` and `docs/fr/` into the static JSON database manually:
```bash
node scripts/build-docs.js
```
*(This script runs automatically when starting `npm run dev` or compiling a build).*

---

## 📦 Production & Deployment

### Local Build & Smoke Test
Compile assets for production and run a build sanity check:
```bash
npm run build
node scripts/smoke-test.js
```

### GitHub Pages CI/CD
This project is configured with a GitHub Actions workflow `.github/workflows/deploy.yml`. 

Whenever you push to the `main` branch, the workflow will automatically:
1. Initialize node and install dependencies.
2. Compile the document manifest.
3. Build Vite assets with relative path mapping (`base: './'`).
4. Push the build to the `gh-pages` branch to host the portal automatically.
