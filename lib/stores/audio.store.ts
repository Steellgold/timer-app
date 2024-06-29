import create from 'zustand';

export type AudioType = {
  song: "drums" | "guitar" | "piano";
  isPlaying: boolean;
};

type AudioStore = {
  audio: AudioType;

  togglePlay: (song: AudioType['song']) => void;
  toggleStop: () => void;
  
  audioElement: HTMLAudioElement | null;
};

const useAudioStore = create<AudioStore>((set, get) => ({
  audio: {
    song: "drums",
    isPlaying: false,
  },
  audioElement: null,
  togglePlay: (song) => {
    const { audio, audioElement } = get();

    if (audioElement) {
      if (audio.song !== song) {
        audioElement.pause();
        const newAudio = new Audio(`/sounds/${song}.mp3`);
        newAudio.play();
        set({
          audio: { ...audio, song, isPlaying: true },
          audioElement: newAudio
        });
      } else if (audio.isPlaying) {
        audioElement.pause();
        set({ audio: { ...audio, isPlaying: false } });
      } else {
        audioElement.play();
        set({ audio: { ...audio, isPlaying: true } });
      }
    } else {
      const newAudio = new Audio(`/sounds/${song}.mp3`);
      newAudio.play();
      set({
        audio: { ...audio, song, isPlaying: true },
        audioElement: newAudio
      });
    }
  },
  toggleStop: () => {
    const { audio, audioElement } = get();

    if (audioElement) {
      audioElement.pause();
    }
    set({ audio: { ...audio, isPlaying: false } });
  }
}));

export default useAudioStore;
