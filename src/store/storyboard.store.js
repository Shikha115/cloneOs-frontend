import { create } from 'zustand';

export const useStoryboardStore = create((set, get) => ({
  frames: [],
  isGeneratingScript: false,
  isGeneratingSketches: false,
  isGeneratingImages: false,
  
  setFrames: (frames) => set({ frames }),
  
  setGeneratingScript: (value) => set({ isGeneratingScript: value }),
  setGeneratingSketches: (value) => set({ isGeneratingSketches: value }),
  setGeneratingImages: (value) => set({ isGeneratingImages: value }),
  
  updateFrame: (id, updater) =>
    set((state) => ({
      frames: state.frames.map((frame) =>
        frame.id === id ? (typeof updater === 'function' ? updater(frame) : { ...frame, ...updater }) : frame
      ),
    })),
  clearFrames: () => set({ frames: [], isGeneratingScript: false, isGeneratingSketches: false, isGeneratingImages: false }),
}));

export const useStoryboardFrames = () => useStoryboardStore((s) => s.frames);
export const useIsGeneratingScript = () => useStoryboardStore((s) => s.isGeneratingScript);
export const useIsGeneratingSketches = () => useStoryboardStore((s) => s.isGeneratingSketches);
export const useIsGeneratingImages = () => useStoryboardStore((s) => s.isGeneratingImages);
