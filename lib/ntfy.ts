const NTFY_BASE_URL = "https://ntfy.sh";

/**
 * Envía una notificación push al topic de ntfy.sh configurado por el usuario.
 * ntfy.sh es un servicio público: cualquiera que conozca el nombre del topic
 * puede suscribirse a él, así que el topic debe tratarse como un secreto
 * (elegir algo no adivinable, no reutilizar nombres genéricos).
 */
export async function sendNtfyNotification(
  topic: string,
  title: string,
  message: string
): Promise<{ ok: boolean; error?: string }> {
  if (!topic.trim()) return { ok: false, error: "Sin topic configurado" };

  try {
    // Se publica como JSON (en vez de headers HTTP) porque el título y el mensaje
    // llevan acentos y el símbolo €, que no son válidos como valor de header HTTP.
    const response = await fetch(NTFY_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: topic.trim(),
        title,
        message,
        tags: ["moneybag"],
      }),
    });

    if (!response.ok) {
      return { ok: false, error: `ntfy.sh respondió ${response.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error de red" };
  }
}
