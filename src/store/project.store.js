import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'cloneos-project-store';

export const useProjectStore = create(
  persist(
    (set, get) => ({
      // Selected project data
      selectedProject: null,
      selectedProjectId: null,
      selectedActorId: null,
      projectName: '',
      
      // Cached data
      projects: [],
      actors: [],
      projectsLastFetched: null,
      actorsLastFetched: null,
      
      // Set the selected project
      setSelectedProject: (project) => 
        set({ 
          selectedProject: project,
          selectedProjectId: project?.id || null 
        }),
      
      // Set just the project ID
      setSelectedProjectId: (projectId) => 
        set({ selectedProjectId: projectId }),
      
      // Set the selected actor ID
      setSelectedActorId: (actorId) => 
        set({ selectedActorId: actorId }),
      
      // Set the project name
      setProjectName: (name) => 
        set({ projectName: name }),
      
      // Set projects cache
      setProjects: (projects) => 
        set({ 
          projects,
          projectsLastFetched: Date.now()
        }),
      
      // Add a new project to cache
      addProject: (project) => 
        set((state) => ({
          projects: [...state.projects, project]
        })),
      
      // Update project in cache
      updateProject: (projectId, updates) => 
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === projectId ? { ...p, ...updates } : p
          )
        })),
      
      // Set actors cache
      setActors: (actors) => 
        set({ 
          actors,
          actorsLastFetched: Date.now()
        }),
      
      // Clear the selected project and related data
      clearSelectedProject: () => 
        set({ 
          selectedProject: null,
          selectedProjectId: null,
          selectedActorId: null,
          projectName: ''
        }),
      
      // Check if cache is fresh (within 5 minutes)
      isCacheFresh: (lastFetched) => {
        if (!lastFetched) return false;
        const FIVE_MINUTES = 5 * 60 * 1000;
        return Date.now() - lastFetched < FIVE_MINUTES;
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        projects: state.projects,
        actors: state.actors,
        projectsLastFetched: state.projectsLastFetched,
        actorsLastFetched: state.actorsLastFetched,
        selectedProjectId: state.selectedProjectId,
        selectedActorId: state.selectedActorId,
        projectName: state.projectName,
      }),
    }
  )
);

// Selectors for easy access
export const useSelectedProject = () => useProjectStore((s) => s.selectedProject);
export const useSelectedProjectId = () => useProjectStore((s) => s.selectedProjectId);
export const useSelectedActorId = () => useProjectStore((s) => s.selectedActorId);
export const useProjectName = () => useProjectStore((s) => s.projectName);
export const useProjects = () => useProjectStore((s) => s.projects);
export const useActors = () => useProjectStore((s) => s.actors);
