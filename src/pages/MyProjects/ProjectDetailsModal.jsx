import React from 'react';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Download, User, Film } from 'lucide-react';
import { useGetActorById } from '../../services/actor.service';

function ActorImage({ actorId }) {
  const { data: actor } = useGetActorById(actorId);
  const fallbackImage = "https://i.pinimg.com/736x/3d/70/41/3d704151eebcdb14b129c0fead905fbb.jpg";
  const actorImage = actor?.avatarUrl || fallbackImage;

  return (
    <div className="w-64 h-full rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
      {actorImage ? (
        <img src={actorImage} alt="Actor" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="w-24 h-24 text-gray-600" />
        </div>
      )}
    </div>
  );
}

export function ProjectDetailsModal({ project, open, onClose }) {
  const handleDownload = () => {
    if (project?.storageUrl) {
      window.open(project.storageUrl, '_blank');
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[50vh] bg-black border-gray-800 p-0">
        <div className="flex gap-8 h-[inherit] p-6">
          {/* Left Side - Actor Image */}
          <div className="flex-shrink-0 h-full">
            <ActorImage actorId={project.actorId} />
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 space-y-6 overflow-y-auto">
            {/* Project Name and Status */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">
                {project.name || 'Untitled Project'}
              </h2>
              <Badge 
                variant="outline" 
                className={`${
                  project.status === 'completed' 
                    ? 'border-green-500 text-green-500 bg-green-500/10'
                    : project.status === 'rendering'
                    ? 'border-blue-500 text-blue-500 bg-blue-500/10'
                    : 'border-orange-500 text-orange-500 bg-orange-500/10'
                }`}
              >
                {project.status || 'unknown'}
              </Badge>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              {/* Script Text */}
              {project.scriptText && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-300">Script</h3>
                  <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                    <p className="text-sm text-gray-300">{project.scriptText}</p>
                  </div>
                </div>
              )}

              {/* Video Download */}
              {project.storageUrl && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-300">Video</h3>
                  <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Final Video Available</span>
                      </div>
                      <Button
                        onClick={handleDownload}
                        className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
