import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useGetAllProjects, useGetProjectById } from '../../services/project.service';
import { useUser } from '../../store/auth.store';
import { useProjectStore } from '../../store/project.store';
import { useToast } from '../../hooks/use-toast';
import { ProjectCard } from './ProjectCard';
import { ProjectListSkeleton } from './Skeleton';
import { ProjectDetailsModal } from './ProjectDetailsModal';

export default function MyProjectsPage() {
  const user = useUser();
  const { toast } = useToast();
  const { 
    projects: cachedProjects,
    setProjects,
    projectsLastFetched,
    isCacheFresh,
  } = useProjectStore();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectDetailsById, setProjectDetailsById] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  
  const shouldFetch = !isCacheFresh(projectsLastFetched);
  const { data: fetchedProjects = [], isLoading, error, refetch } = useGetAllProjects({
    enabled: shouldFetch,
  });
  
  useEffect(() => {
    if (fetchedProjects.length > 0) {
      setProjects(fetchedProjects);
    }
  }, [fetchedProjects, setProjects]);

  const projects = cachedProjects.length > 0 ? cachedProjects : fetchedProjects;

  const { data: selectedProject } = useGetProjectById(selectedProjectId, {
    enabled: !!selectedProjectId,
  });

  const userProjects = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    const userId = user?.id ?? user?._id ?? user?.userId;
    if (userId) {
      return list.filter((project) => project?.userId === userId);
    }
    return list;
  }, [projects, user]);
  useEffect(() => {
    if (selectedProject?.id) {
      setProjectDetailsById((prev) => ({
        ...prev,
        [selectedProject.id]: selectedProject,
      }));
      setModalOpen(true);
    }
  }, [selectedProject]);

  const handleViewDetails = async (projectId) => {
    try {
      setSelectedProjectId(projectId);
    } catch (err) {
      toast({
        title: 'Unable to load project',
        description: err?.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProjectId(null);
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Projects</h1>
          <ProjectListSkeleton />
        </div>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Projects</h1>
          <div className="text-center py-20">
            <p className="text-red-500 text-xl">Unable to load projects. Please try again.</p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (userProjects.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Projects</h1>
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No projects found. Create a new project to get started.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Projects</h1>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {userProjects.map((project) => (
            <div key={project.id}>
              <ProjectCard 
                project={project}
                scenes={projectDetailsById[project.id]?.scenes || project.scenes || []}
                onViewDetails={handleViewDetails}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProjectId ? projectDetailsById[selectedProjectId] : null}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
