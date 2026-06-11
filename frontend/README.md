# Lead CRM Dashboard

A professional, production-ready CRM dashboard for managing scraping, assigning, and tracking sales leads. Built with React + Vite.

## Tech Stack

- **React 18** + **Vite 5**
- **React Router DOM v6** — client-side routing
- **Axios** — HTTP client with interceptors
- **Tailwind CSS** — utility-first styling
- **React Hook Form** — form management & validation
- **React Hot Toast** — notifications
- **Lucide React** — icons
- **Recharts** — charts

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd lead-crm
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:

```
VITE_API_BASE_URL=http://localhost:5005/api
```

### 3. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── app/              # App entry, router, providers
├── components/
│   ├── common/       # Button, Input, Select, Modal, Badge, Loader, EmptyState
│   ├── layout/       # DashboardLayout, Sidebar, Header, MobileNav
│   └── tables/       # LeadsTable
├── config/
│   └── constants.js  # Status values, colors, categories
├── features/
│   ├── dashboard/    # Stats + charts overview
│   ├── leads/        # Lead listing, filters, detail, status update, assign
│   ├── scraper/      # Google Maps scraper form
│   └── agents/       # Agent list + create
├── hooks/            # useDebounce, useModal
├── services/         # apiClient, leadService, agentService, scraperService
└── utils/            # formatters, validators
```

## Pages

| Route        | Description                                        |
|--------------|----------------------------------------------------|
| `/dashboard` | Stats overview, status chart, agent performance   |
| `/leads`     | Filterable leads table with pagination             |
| `/scraper`   | Google Maps lead scraping form                     |
| `/agents`    | Agent management with per-agent export             |

## API Integration

All API calls live in `src/services/`. Components only call service functions — no direct `axios` usage in UI files.

| Service           | Methods                                      |
|-------------------|----------------------------------------------|
| `leadService`     | getLeads, getLeadStats, updateLeadStatus, assignLeads, exportLeadsExcel |
| `agentService`    | getAgents, createAgent                       |
| `scraperService`  | scrapeGoogleMaps                             |

## Environment Variables

| Variable            | Default                        | Description          |
|---------------------|--------------------------------|----------------------|
| `VITE_API_BASE_URL` | `http://localhost:5005/api`    | Backend API base URL |
