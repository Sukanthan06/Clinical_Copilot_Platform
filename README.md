# 🏥 Clinical Copilot Platform

> **AI-powered clinical decision support platform** that enables patients to upload medical reports, extract structured health data, match clinical trials, and generate referral letters — all powered by a NitroCloud MCP Server backed by MongoDB Atlas.

---

## 📸 Overview

Clinical Copilot is a full-stack healthcare platform consisting of:

- **React Frontend** — A modern, responsive patient-facing web app built with Vite + Tailwind CSS
- **FastAPI Backend** — A Python API Gateway that orchestrates all data flows
- **MCP Client** — An async SSE client connecting to the NitroCloud MCP Server
- **AI Assistant** — A RAG pipeline (Groq LLaMA + Pinecone + Gemini Embeddings) for answering patient queries

---

## 🗂️ Project Structure

```
Clinical_Copilot_Platform/
├── backend/                    # FastAPI API Gateway
│   ├── app.py                  # App entry point, lifespan, routers, CORS
│   ├── config.py               # Pydantic Settings (reads from .env)
│   ├── routes/                 # REST endpoints
│   │   ├── auth.py             # POST /auth/login, /auth/register
│   │   ├── patient.py          # POST /patient/upload, GET /patient/{id}
│   │   ├── extraction.py       # POST /extraction
│   │   ├── timeline.py         # GET /patient/{id}/timeline
│   │   ├── trials.py           # GET /patient/{id}/clinical-trials
│   │   ├── referral.py         # POST /patient/referral
│   │   └── chat.py             # POST /api/v1/assistant/chat
│   ├── services/               # Business logic layer (calls MCP client)
│   ├── models/                 # Pydantic request/response models
│   ├── ai/                     # RAG pipeline (Groq, Pinecone, Gemini embeddings)
│   ├── middleware/             # Global exception handlers
│   └── utils/                  # Logging setup
│
├── frontend/                   # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/              # Dashboard, Upload, Profile, Timeline, Trials, Chat, Referral
│   │   ├── components/         # Shared UI components (Sidebar, Navbar, Cards)
│   │   ├── services/           # API service layer (fetch wrappers)
│   │   └── data/               # Static fallback data
│   ├── vite.config.js          # Dev proxy to backend (:8000)
│   └── package.json
│
├── mcp_client/                 # Python MCP SSE Client package
│   ├── client.py               # Async MCPClient (connect, call_tool, reconnect)
│   ├── schemas.py              # Pydantic v2 MCP response schemas
│   ├── config.py               # MCP config (URL, timeout)
│   └── exceptions.py           # MCPConnectionError, MCPToolError, MCPTimeoutError
│
├── .env                        # Secret keys (not committed)
├── .env.example                # Template for environment setup
├── requirements.txt            # Python dependencies
└── README.md
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 6, Tailwind CSS 3, React Router 6 |
| **Backend** | FastAPI 0.110+, Uvicorn, Pydantic v2 |
| **MCP Transport** | SSE (Server-Sent Events) via NitroCloud |
| **Database** | MongoDB Atlas (via MCP tools) |
| **File Storage** | Supabase Storage (PDF referrals) |
| **Vector DB** | Pinecone (RAG embeddings) |
| **LLM (Chat)** | Groq LLaMA 3.3 |
| **Embeddings** | Google Gemini Embedding API |
| **Auth** | JWT tokens (managed by MCP auth tools) |

---

## ⚙️ Environment Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Clinical_Copilot_Platform
```

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Fill in the values in `.env`:

```env
# Application
APP_NAME="Clinical Copilot Platform"
APP_ENV="development"
DEBUG=True
HOST="127.0.0.1"
PORT=8000
CORS_ORIGINS='["*"]'

# MCP Server (NitroCloud SSE endpoint)
MCP_SERVER_URL="https://<your-nitrocloud-instance>/sse"
MCP_TIMEOUT=60

# AI / LLM
GEMINI_API_KEY="your-gemini-api-key"
GROK_API_KEY="your-groq-api-key"

# Vector Database
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX="clinical-copilot"
```

---

## 🚀 Running Locally

### Backend (FastAPI)

```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1      # Windows PowerShell
# source venv/bin/activate       # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn backend.app:app --reload
```

Backend runs at: **http://127.0.0.1:8000**  
Swagger docs at: **http://127.0.0.1:8000/docs**

---

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

> The Vite dev server proxies all `/api`, `/patient`, `/auth`, and `/extraction` requests to the backend automatically — no CORS issues during development.

---

## 🔄 Data Flow

```
User Browser (React)
    ↓  REST API calls
FastAPI Backend (Python)
    ↓  SSE tool invocations
NitroCloud MCP Server
    ↓  Reads/Writes
MongoDB Atlas (patients, reports, timelines, trials, referrals)
    ↓  Binary files
Supabase Storage (PDF referral letters)
    ↓  Semantic vectors
Pinecone (RAG embeddings for AI Assistant)
```

---

## 🧠 AI Assistant (RAG Pipeline)

The `/api/v1/assistant/chat` endpoint runs a full **Retrieval-Augmented Generation** pipeline:

1. **Embed** the user's question using Gemini Embedding API
2. **Query Pinecone** for the top-5 most relevant report chunks for this patient
3. **Fetch** patient profile + timeline from MongoDB (via backend API)
4. **Build prompt** with patient context + retrieved chunks + conversation history
5. **Generate response** using Groq (LLaMA 3.3 70B)
6. **Return** answer + source documents

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Authenticate patient |
| `POST` | `/auth/register` | Register new patient |
| `POST` | `/patient/upload` | Upload medical report (PDF/image) |
| `GET` | `/patient/{id}` | Get patient profile from MongoDB |
| `POST` | `/extraction` | Extract clinical data from uploaded report |
| `GET` | `/patient/{id}/timeline` | Get patient's medical timeline |
| `GET` | `/patient/{id}/clinical-trials` | Get matched clinical trials |
| `POST` | `/patient/referral` | Generate referral letter PDF |
| `POST` | `/api/v1/assistant/chat` | AI chat assistant (RAG) |
| `GET` | `/health` | Backend + MCP health check |

---

## 🛡️ MCP Tools (6 Available)

The MCP server exposes these tools, called via the `MCPClient`:

| Tool | Description |
|---|---|
| `authenticate_user` | Login / register users, returns JWT + patientId |
| `upload_medical_report` | Upload PDF, store in Supabase + MongoDB `reports` |
| `extract_patient_information` | OCR + LLM extraction → updates `patients` + Pinecone |
| `update_medical_timeline` | Compiles chronological events into `timelines` |
| `search_clinical_trials` | ClinicalTrials.gov matching → stores in `trials` |
| `generate_referral` | Creates PDF referral letter → stored in `referrals` |

---

## 🖥️ Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | Login | Auth (login / register) |
| `/dashboard` | Dashboard | KPIs, activity feed, AI insights |
| `/upload` | Upload Reports | Drag & drop medical PDF upload |
| `/profile` | Patient Profile | Conditions, medications from MongoDB |
| `/timeline` | Timeline | Chronological medical events |
| `/chat` | AI Assistant | RAG-powered health Q&A |
| `/trials` | Clinical Trials | Matched trials with eligibility scores |
| `/referral` | Referral | Generate & download PDF referral |

---

## 📦 Dependencies

### Backend (`requirements.txt`)
- `fastapi`, `uvicorn` — Web server
- `pydantic`, `pydantic-settings` — Validation
- `httpx`, `requests` — HTTP client
- `python-multipart` — File upload parsing
- `python-dotenv` — `.env` loading
- `mcp` — MCP SSE client protocol
- `groq` — LLaMA LLM API
- `pinecone-client` — Vector search

### Frontend (`frontend/package.json`)
- `react`, `react-dom`, `react-router-dom` — Core UI
- `axios` — HTTP client
- `react-icons`, `lucide-react` — Icons
- `react-markdown`, `remark-gfm` — Markdown rendering (AI chat)
- `sonner` — Toast notifications
- `tailwindcss`, `vite`, `@vitejs/plugin-react` — Build tooling

---


> Built with ❤️ using FastAPI, React, and NitroCloud MCP — Clinical Copilot Platform
