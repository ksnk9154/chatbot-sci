from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

INDEX_FILE = "faiss_index.bin"
CHUNKS_FILE = "chunks.pkl"
PORT = int(os.environ.get("PORT", 8000))

app = Flask(__name__)
CORS(app)

# load index (fail fast with helpful message)
try:
    index = faiss.read_index(INDEX_FILE)
    with open(CHUNKS_FILE, "rb") as f:
        chunks = pickle.load(f)
    model = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    print("Error loading index. Did you run indexer.py first? Exception:", e)
    index = None; chunks = []; model = None

@app.route("/")
def home():
    return "Backend is running.", 200

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "chunks": len(chunks)})

@app.route("/chat", methods=["POST"])
def chat():
    if index is None or model is None:
        return jsonify({"error":"index not loaded; run indexer.py first"}), 500
    body = request.get_json(force=True)
    query = body.get("query","")
    top_k = int(body.get("top_k", 3))
    if not query:
        return jsonify({"error":"query missing"}), 400
    query_vec = model.encode([query])
    query_vec = np.asarray(query_vec, dtype="float32")
    distances, indices = index.search(query_vec, top_k)
    results = []
    for i, idx in enumerate(indices[0]):
        if idx < len(chunks):
            results.append({
                "text": chunks[idx],
                "score": float(distances[0][i])
            })
    return jsonify({"query":query, "best_score": float(distances[0][0]) if len(distances[0]) else 0.0, "results":results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=False)
