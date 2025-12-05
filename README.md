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
