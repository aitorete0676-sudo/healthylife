// Función de Vercel: puente entre la app y Gemini (plan gratuito de Google AI Studio).
// La clave GEMINI_API_KEY vive solo en Vercel; el navegador nunca la ve.
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ code: "bad_request", error: "Solo POST" });
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ code: "no_key", error: "Falta GEMINI_API_KEY" });
  if (process.env.APP_PASSWORD && req.headers["x-app-password"] !== process.env.APP_PASSWORD)
    return res.status(401).json({ code: "bad_password", error: "Contraseña incorrecta" });

  const { contents, tools, json } = req.body || {};
  if (!Array.isArray(contents) || !contents.length || contents.length > 80)
    return res.status(400).json({ code: "bad_request", error: "Mensajes no válidos" });

  const body = { contents };
  if (Array.isArray(tools) && tools.length) body.tools = [{ functionDeclarations: tools.slice(0, 20) }];
  if (json) body.generationConfig = { responseMimeType: "application/json" };

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    if (r.status === 429) return res.status(429).json({ code: "rate_limited", error: "Límite gratuito alcanzado" });
    if (r.status === 400 || r.status === 403) return res.status(r.status).json({ code: r.status === 403 ? "no_key" : "api_error", error: data?.error?.message || "Error" });
    if (!r.ok) return res.status(502).json({ code: "api_error", error: data?.error?.message || `Error ${r.status}` });
    const cand = data.candidates?.[0];
    return res.status(200).json({ content: cand?.content || { role: "model", parts: [] }, finishReason: cand?.finishReason || "" });
  } catch {
    return res.status(500).json({ code: "api_error", error: "Error inesperado" });
  }
}
