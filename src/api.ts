// src/api.ts
export type BackendResult = {
  source: string;
  chunk_id: string;
  text: string;
  score: number;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

/**
 * askBackend
 * Calls POST /chat on the TF-IDF backend and returns parsed results.
 */
export async function askBackend(query: string, top_k = 3): Promise<{
  query: string;
  best_score: number;
  results: BackendResult[];
}> {
  const url = `${BACKEND_URL.replace(/\/+$/, "")}/chat`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k }),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Backend error ${resp.status}: ${text}`);
  }
  const json = await resp.json();
  // Basic validation/normalization
  return {
    query: json.query ?? query,
    best_score: typeof json.best_score === "number" ? json.best_score : 0,
    results:
      Array.isArray(json.results) && json.results.length
        ? (json.results as BackendResult[])
        : [],
  };
}
