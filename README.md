🚀 Setup Instructions
🖥️ Backend Setup
# 1. Install backend dependencies
cd backend && pip install -r requirements.txt

# 2. Build the search index
cd backend && python indexer.py

# 3. Run the backend server
python app_clean.py

💻 Frontend Setup
# 1. Install frontend dependencies
npm install

# 2. Start the development server
npm run dev


If you want, I can rewrite the entire README, add badges, screenshots, architecture diagrams, or make it more professional.

You said:
ok
ChatGPT said:

Great! Here is a polished, professional full README that includes your instructions and improves clarity, formatting, and project presentation.
You can replace your current README.md with this if you like.

🤖 Chatbot-SCI

A simple chatbot system with a backend search index and a React-based frontend interface.

📂 Project Structure
chatbot-sci/
│
├── backend/        # Python backend (API + search index)
│     ├── app_clean.py
│     ├── indexer.py
│     ├── requirements.txt
│     └── ...
│
└── frontend/       # React + Vite frontend
      ├── src/
      ├── package.json
      └── ...

🚀 Getting Started

This project consists of two parts:

Backend (Python) — handles indexing + chatbot API

Frontend (React) — user interface for interacting with the bot

Follow the steps below to run both.

🖥️ Backend Setup
1️⃣ Install dependencies
cd backend && pip install -r requirements.txt

2️⃣ Build the search index
cd backend && python indexer.py

3️⃣ Start the backend server
python app_clean.py


By default, the API usually runs at:

http://localhost:8000

💻 Frontend Setup
1️⃣ Install dependencies
npm install

2️⃣ Run development server
npm run dev


The frontend should start at:

http://localhost:5173

🔌 API Endpoints
Method	Endpoint	Description
POST	/chat	Sends user query to backend and returns response
GET	/health	Health status endpoint
🛠️ Customization
Modify bot responses

Frontend responses can be updated in:

src/botResponses.ts

Update indexed data

Add or modify documents in the backend data folder, then rebuild the index:

python indexer.py

📜 License

MIT — feel free to use and modify.



You can customize the chatbot by:

- Modifying bot responses in `src/App.tsx` (`botResponses` array)
- Adjusting colors and animations in component files
- Changing particle count in `ParticleBackground.tsx`
- Updating styling in Tailwind classes
=======
## API Documentation

### POST /chat
Search for relevant documents using TF-IDF retrieval.

**Request:**
```json
{
  "query": "your search query",
  "top_k": 3
}
```

**Response:**
```json
{
  "query": "your search query",
  "best_score": 0.85,
  "results": [
    {
      "source": "data/sample1.txt",
      "chunk_id": "chunk_0",
      "text": "Relevant text snippet...",
      "score": 0.85
    }
  ]
}
```

### GET /health
Check if the service is running and index is loaded.

**Response:**
```json
{
  "status": "ok",
  "chunks": 42
}
```

## Deployment

### Docker Production
```bash
# Build and run
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Manual Deployment
1. Build index on your server: `python indexer.py`
2. Set `PORT` environment variable
3. Run `python app.py`

## Customization

You can customize the chatbot by:

- Modifying bot responses in `src/App.tsx` (`botResponses` array)
- Adjusting colors and animations in component files
- Changing particle count in `ParticleBackground.tsx`
- Updating styling in Tailwind classes
- Adding new documents to `backend/data/` and rebuilding the index
