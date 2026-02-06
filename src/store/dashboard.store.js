import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  sidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// Selector hooks for convenience
export const useSidebarOpen = () => useDashboardStore((state) => state.sidebarOpen);
export const useSetSidebarOpen = () => useDashboardStore((state) => state.setSidebarOpen);
export const useToggleSidebar = () => useDashboardStore((state) => state.toggleSidebar);
