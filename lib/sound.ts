const audioCache = new Map<string, HTMLAudioElement>();
let unlocked = false;

function getAudio(fileName: string): HTMLAudioElement {
  let audio = audioCache.get(fileName);
  if (!audio) {
    audio = new Audio(`/sounds/${encodeURIComponent(fileName)}`);
    audio.volume = 0.5;
    audioCache.set(fileName, audio);
  }
  return audio;
}

/**
 * Los navegadores bloquean el audio programático hasta que el usuario ha
 * interactuado con la página. Se llama una vez, en el primer click/tecla,
 * para "desbloquear" la reproducción y que las ventas simuladas posteriores
 * puedan sonar sin que el usuario tenga que tocar nada en ese momento.
 */
export function unlockAudioOnFirstInteraction(fileName: string): () => void {
  if (typeof window === "undefined") return () => {};

  const unlock = () => {
    if (unlocked || !fileName) return;
    const audio = getAudio(fileName);
    audio.muted = true;
    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
        unlocked = true;
      })
      .catch(() => {
        audio.muted = false;
      });
  };

  document.addEventListener("pointerdown", unlock, { once: true });
  document.addEventListener("keydown", unlock, { once: true });

  return () => {
    document.removeEventListener("pointerdown", unlock);
    document.removeEventListener("keydown", unlock);
  };
}

export async function playSaleSound(
  fileName: string
): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === "undefined") return { ok: false, error: "Sin ventana de navegador" };
  if (!fileName.trim()) return { ok: false, error: "Sin archivo de sonido configurado" };

  try {
    const audio = getAudio(fileName);
    audio.currentTime = 0;
    await audio.play();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "No se pudo reproducir" };
  }
}
