const audioCache = new Map<string, HTMLAudioElement>();

export function playSaleSound(fileName: string): void {
  if (typeof window === "undefined" || !fileName) return;

  let audio = audioCache.get(fileName);
  if (!audio) {
    audio = new Audio(`/sounds/${fileName}`);
    audio.volume = 0.5;
    audioCache.set(fileName, audio);
  }

  audio.currentTime = 0;
  audio.play().catch(() => {
    // El navegador puede bloquear el autoplay hasta la primera interacción del usuario.
  });
}
