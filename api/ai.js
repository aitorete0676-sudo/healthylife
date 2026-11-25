// Función de Vercel: puente entre la app y Gemini (plan gratuito de Google AI Studio).
// La clave GEMINI_API_KEY vive solo en Vercel; el navegador nunca la ve.
// Prueba varios modelos: si uno está saturado o no existe, pasa al siguiente.
export const config = { maxDuration: 60 };

const MODELS = (process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : []).concat([
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
]);
const RETRY = new Set([404, 429, 500, 503, 504]);

async function ask(model, body, useThinking) {
  const b = useThinking ? { ...body, generationConfig: { ...(body.generationConfig || {}), thinkingConfig: { thinkingBudget: 0 } } } : body;
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify(b),
  });
  const data = await r.json().catch(() => ({}));
  return { status: r.status, ok: r.ok, data };
}

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

  let last = null;
  try {
    for (const model of MODELS) {
      // Primero sin "pensar" (más rápido); si el modelo no acepta esa opción, se repite normal.
      let r = await ask(model, body, true);
      if (r.status === 400) r = await ask(model, body, false);
      if (r.ok) {
        const cand = r.data.candidates?.[0];
        return res.status(200).json({ model, content: cand?.content || { role: "model", parts: [] }, finishReason: cand?.finishReason || "" });
      }
      last = r;
      if (r.status === 403) return res.status(403).json({ code: "no_key", error: r.data?.error?.message || "Clave no válida" });
      if (!RETRY.has(r.status)) break;
    }
  } catch {
    return res.status(500).json({ code: "api_error", error: "Error inesperado" });
  }
  const st = last?.status;
  return res.status(st === 429 ? 429 : 502).json({ code: st === 429 ? "rate_limited" : st === 503 ? "busy" : "api_error", error: last?.data?.error?.message || "Error" });
}
