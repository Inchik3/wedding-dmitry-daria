import { qs } from '../shared/dom';

export function initMusic(audioPath: string): () => void {
  const button = qs<HTMLButtonElement>('[data-music-toggle]');
  let audio: HTMLAudioElement | null = null;
  let unavailable = false;

  const setState = (playing: boolean, label: string) => {
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'Выключить музыку' : label);
    button.title = playing ? 'Выключить музыку' : label;
    button.dataset.playing = String(playing);
  };

  const ensureAudio = () => {
    if (audio || unavailable) return audio;
    audio = new Audio(audioPath);
    audio.loop = true;
    audio.preload = 'none';
    audio.addEventListener('error', () => {
      unavailable = true;
      button.disabled = true;
      setState(false, 'Музыка пока не добавлена');
    });
    return audio;
  };

  const toggle = async () => {
    if (unavailable) return;
    const player = ensureAudio();
    if (!player) return;

    try {
      if (player.paused) {
        await player.play();
        setState(true, 'Включить музыку');
      } else {
        player.pause();
        setState(false, 'Включить музыку');
      }
    } catch {
      unavailable = true;
      button.disabled = true;
      setState(false, 'Музыка пока не добавлена');
    }
  };

  button.addEventListener('click', toggle);
  setState(false, 'Включить музыку');

  return () => {
    const player = ensureAudio();
    void player?.play().then(() => setState(true, 'Включить музыку')).catch(() => {
      unavailable = true;
      button.disabled = true;
      setState(false, 'Музыка пока не добавлена');
    });
  };
}
