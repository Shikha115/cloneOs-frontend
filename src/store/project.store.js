import { create } from 'zustand';

export const useProjectStore = create((set, get) => ({
  selectedProject: null,
  selectedProjectId: null,
  
  // Set the selected project
  setSelectedProject: (project) => 
    set({ 
      selectedProject: project,
      selectedProjectId: project?.id || null 
    }),
  
  // Set just the project ID
  setSelectedProjectId: (projectId) => 
    set({ selectedProjectId: projectId }),
  
  // Clear the selected project
  clearSelectedProject: () => 
    set({ 
      selectedProject: null,
      selectedProjectId: null 
    }),
}));

// Selectors for easy access
export const useSelectedProject = () => useProjectStore((s) => s.selectedProject);
export const useSelectedProjectId = () => useProjectStore((s) => s.selectedProjectId);
