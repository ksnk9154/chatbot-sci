import os
import pickle

from typing import List

import numpy as np
import faiss
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer

# === CONFIG ===
PDF_FOLDER = "vault"  # folder where your PDFs live (relative to backend/)
INDEX_FILE = "faiss_index.bin"  # this should match what your backend expects
CHUNKS_FILE = "chunks.pkl"      # this should also match backend


def load_pdf(file_path: str) -> str:
    """Read all text from a PDF file."""
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> List[str]:
    """
    Split long text into overlapping chunks.

    Example with chunk_size=500, overlap=100:
    - chunk 1: chars 0–500
    - chunk 2: chars 400–900 (100-char overlap)
    """
    chunks = []
    start = 0
    n = len(text)

    if n == 0:
        return chunks

    while start < n:
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap

    return chunks


def build_index():
    print("Indexer starting...")

    if not os.path.isdir(PDF_FOLDER):
        raise FileNotFoundError(
            f"PDF folder '{PDF_FOLDER}' not found. "
            f"Create it under backend/ and put your PDFs there."
        )

    all_chunks: List[str] = []

    # 1. Collect chunks from all PDFs
    print(f"Scanning folder: {PDF_FOLDER}")
    for filename in os.listdir(PDF_FOLDER):
        if not filename.lower().endswith(".pdf"):
            continue

        path = os.path.join(PDF_FOLDER, filename)
        print(f"  -> Loading {path}")
        text = load_pdf(path)
        chunks = chunk_text(text)
        print(f"     {len(chunks)} chunks")
        all_chunks.extend(chunks)

    if not all_chunks:
        raise RuntimeError(
            f"No PDF chunks found in '{PDF_FOLDER}'. "
            f"Make sure there are .pdf files with extractable text."
        )

    print(f"Total chunks: {len(all_chunks)}")

    # 2. Embed chunks
    print("Loading embedding model (SentenceTransformer)...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    print("Encoding chunks into vectors...")
    vectors = model.encode(
        all_chunks,
        batch_size=32,
        show_progress_bar=True,
    )
    vectors = np.asarray(vectors, dtype="float32")

    # 3. Build FAISS index
    dim = vectors.shape[1]
    print(f"Building FAISS index with dim={dim}, n={vectors.shape[0]}")
    index = faiss.IndexFlatL2(dim)
    index.add(vectors)

    # 4. Save index + chunks to disk
    print(f"Saving FAISS index to {INDEX_FILE}")
    faiss.write_index(index, INDEX_FILE)

    print(f"Saving chunks to {CHUNKS_FILE}")
    with open(CHUNKS_FILE, "wb") as f:
        pickle.dump(all_chunks, f)

    print("Indexer finished successfully.")


if __name__ == "__main__":
    build_index()
