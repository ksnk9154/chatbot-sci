from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, os
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

INDEX_DIR = "index"
PORT = int(os.environ.get("PORT", 8000))

app = Flask(__name__)
CORS(app)

# load index (fail fast with helpful message)
try:
    vectorizer = joblib.load(os.path.join(INDEX_DIR, "vectorizer.joblib"))
    tfidf_matrix = joblib.load(os.path.join(INDEX_DIR, "tfidf_matrix.joblib"))
    docs = joblib.load(os.path.join(INDEX_DIR, "docs.joblib"))
except Exception as e:
    print("Error loading index. Did you run indexer.py first? Exception:", e)
    vectorizer = None; tfidf_matrix = None; docs = []

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "chunks": len(docs)})

@app.route("/chat", methods=["POST"])
def chat():
    if vectorizer is None:
        return jsonify({"error":"index not loaded; run indexer.py first"}), 500
    body = request.get_json(force=True)
    query = body.get("query","")
    top_k = int(body.get("top_k", 3))
    if not query:
        return jsonify({"error":"query missing"}), 400
    qv = vectorizer.transform([query])
    sims = cosine_similarity(qv, tfidf_matrix).flatten()
    idxs = (-sims).argsort()[:top_k]
    results = []
    for i in idxs:
        results.append({
            "source": docs[i]["source"],
            "chunk_id": docs[i]["chunk_id"],
            "text": docs[i]["text"],
            "score": float(sims[i])
        })
    return jsonify({"query":query, "best_score": float(sims[idxs[0]]) if len(idxs) else 0.0, "results":results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=False)
=======
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, os
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

INDEX_DIR = "index"
PORT = int(os.environ.get("PORT", 8000))

app = Flask(__name__)
CORS(app)

# load index (fail fast with helpful message)
try:
    vectorizer = joblib.load(os.path.join(INDEX_DIR, "vectorizer.joblib"))
    tfidf_matrix = joblib.load(os.path.join(INDEX_DIR, "tfidf_matrix.joblib"))
    docs = joblib.load(os.path.join(INDEX_DIR, "docs.joblib"))
except Exception as e:
    print("Error loading index. Did you run indexer.py first? Exception:", e)
    vectorizer = None; tfidf_matrix = None; docs = []

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "chunks": len(docs)})

@app.route("/chat", methods=["POST"])
def chat():
    if vectorizer is None:
        return jsonify({"error":"index not loaded; run indexer.py first"}), 500
    body = request.get_json(force=True)
    query = body.get("query","")
    top_k = int(body.get("top_k", 3))
    if not query:
        return jsonify({"error":"query missing"}), 400
    qv = vectorizer.transform([query])
    sims = cosine_similarity(qv, tfidf_matrix).flatten()
    idxs = (-sims).argsort()[:top_k]
    results = []
    for i in idxs:
        results.append({
            "source": docs[i]["source"],
            "chunk_id": docs[i]["chunk_id"],
            "text": docs[i]["text"],
            "score": float(sims[i])
        })
    return jsonify({"query":query, "best_score": float(sims[idxs[0]]) if len(idxs) else 0.0, "results":results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=False)
