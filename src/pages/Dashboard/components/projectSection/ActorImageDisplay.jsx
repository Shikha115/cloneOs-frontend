import React from 'react';
import { useGetActorById } from '../../../../services/actor.service';

export default function ActorImageDisplay({ actorId, projectName }) {
  const { data: actor } = useGetActorById(actorId);
  const fallbackImage = "https://i.pinimg.com/736x/3d/70/41/3d704151eebcdb14b129c0fead905fbb.jpg";
  const actorImage = actor?.avatarUrl || fallbackImage;

  return (
    <div className="actor-image">
      <img
        src={actorImage}
        alt={projectName || "Project"}
      />
    </div>
  );
}
