// src/hooks/useApi.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081";


export async function useApi(path, options) {
  const res = await fetch(API_BASE + path, options);
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  if (contentType.includes("application/json")) return res.json();
  return res.text();
}
