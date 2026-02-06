import React, { useEffect, useState } from "react";
import { Badge } from "../../../../components/ui/badge";
import { useToast } from "../../../../hooks/use-toast";
import { useGetAllActors } from "../../../../services/actor.service";
import { useProjectStore } from "../../../../store/project.store";
import AvatarSkeleton from "./Skeleton";
import AvatarCard from "./AvatarCard";

export default function AvatarSection({
  sectionRef,
  onSelectionChange,
  onNext,
}) {
  const { toast } = useToast();
  const { 
    setSelectedActorId,
    actors: cachedActors,
    setActors,
    actorsLastFetched,
    isCacheFresh,
  } = useProjectStore();
  
  const shouldFetch = !isCacheFresh(actorsLastFetched);
  const {
    data: fetchedActors = [],
    isLoading: actorsLoading,
    error: actorsError,
  } = useGetAllActors({
    enabled: shouldFetch,
  });
  
  const [selectedActors, setSelectedActors] = useState([]);
  
  useEffect(() => {
    if (fetchedActors.length > 0) {
      setActors(fetchedActors);
    }
  }, [fetchedActors, setActors]);
  
  const actors = cachedActors.length > 0 ? cachedActors : fetchedActors;

  useEffect(() => {
    onSelectionChange?.(selectedActors);
  }, [selectedActors, onSelectionChange]);

  const handleActorSelect = (actor) => {
    if (selectedActors.length < 1) {
      setSelectedActors([{ ...actor, isLocked: false }]);
      setSelectedActorId(actor.id);
      toast({
        title: "Actor Selected",
        description: `${actor.name} has been added to your selection.`,
      });
    } else {
      toast({
        title: "Actor already selected",
        description: "You can only select one actor for this project.",
        variant: "destructive",
      });
    }
  };

  return (
    <section ref={sectionRef} className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">SELECT YOUR ACTOR</h2>
        <Badge variant="secondary" className="section-badge cursor-pointer">
          All Categories
        </Badge>
      </div>

      <div className="actors-grid">
        {actorsLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <AvatarSkeleton key={idx} />
          ))
        ) : actorsError ? (
          <div className="col-span-full text-center text-red-500 py-8">
            <p>Error loading actors. Please try again.</p>
          </div>
        ) : actors.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            <p>No actors available</p>
          </div>
        ) : (
          actors.map((actor) => (
            <AvatarCard
              key={actor.id}
              actor={actor}
              isSelected={selectedActors.some((a) => a.id === actor.id)}
              onSelect={handleActorSelect}
            />
          ))
        )}
      </div>

      {/* <div className="browse-more">
        <Button variant="outline" className="browse-btn">
          Browse More Actors
        </Button>
      </div> */}
    </section>
  );
}
