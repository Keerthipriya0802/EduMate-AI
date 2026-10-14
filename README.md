# EduMate AI

EduMate AI is a React + Vite study companion with a FastAPI demo backend. It includes materials, an AI tutor, quizzes, revision planning, learning paths, and analytics.
## Requirements

- Node.js 20 or newer
- Python 3.10 or newer
## Install

From the project root (`C:\EduMate AI`):
```powershell
npm install
python -m pip install -r backend\requirements.txt
```
## Run locally

Open two PowerShell terminals in `C:\EduMate AI`.
**Terminal 1: start the API**

```powershell
npm run start:api
```
The API runs at `http://localhost:8000`.

**Terminal 2: start the frontend**
```powershell
npm run dev
```
Open `http://localhost:5173` in a browser.

The frontend expects the API at `http://localhost:8000/api`. The backend currently uses local demo JSON state and does not require external API keys.
## Useful commands

```powershell
npm run build       # Create a production frontend build
npm run preview     # Preview the production build
npm run lint        # Run Oxlint
```
To check that the API is running, open `http://localhost:8000/api/health`.
 
