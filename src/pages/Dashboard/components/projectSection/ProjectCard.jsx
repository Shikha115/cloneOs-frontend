import React from 'react';
import { Card, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import ActorImageDisplay from './ActorImageDisplay';

export default function ProjectCard({ project, selected, onSelect }) {
  const { projectName, scriptText, status } = project || {};
  const scriptPreview = scriptText?.trim()
    ? scriptText.length > 80
      ? `${scriptText.slice(0, 80)}...`
      : scriptText
    : "No script added yet.";

  return (
    <Card className={`actor-card ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="actor-card-content">
        <ActorImageDisplay actorId={project.actorId} projectName={projectName} />

        <div className="actor-info">
          <div className="flex items-center justify-between mb-2">
            <h3 className="actor-name">{projectName || "Untitled Project"}</h3>
            <Badge variant="outline" className="text-[8px] rounded-sm px-2 py-0.5 border-orange-500 text-orange-500">
              {status || "unknown"}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {scriptPreview}
          </p>
        </div>

        <Button
          className="select-actor-btn"
          variant={selected ? "default" : "outline"}
          onClick={onSelect}
          disabled={selected}
        >
          {selected ? "Selected" : "Select Project"}
        </Button>
      </CardContent>
    </Card>
  );
}
