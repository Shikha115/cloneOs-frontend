import React, { useEffect, useState } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { Input } from "../../../../components/ui/input";
import { User, Lock, Unlock, Shirt } from "lucide-react";
import { useToast } from "../../../../hooks/use-toast";
import { useGetAllActors } from "../../../../services/actor.service";
import { useProjectStore } from "../../../../store/project.store";
import {
  mockVoiceStyles,
  mockLanguages,
  mockFunctions,
} from "../../../../components/mock";
import AvatarSkeleton from "./Skeleton";

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

  const handleLockActor = (actorId) => {
    setSelectedActors((prev) =>
      prev.map((actor) =>
        actor.id === actorId ? { ...actor, isLocked: !actor.isLocked } : actor
      )
    );
  };

  const handleRemoveActor = (actorId) => {
    setSelectedActors((prev) => prev.filter((actor) => actor.id !== actorId));
    setSelectedActorId(null);
  };

  const handleOutfitUpload = async (file, actorId) => {
    try {
      const imageUrl = await mockFunctions.uploadImage(file);
      setSelectedActors((prev) =>
        prev.map((actor) =>
          actor.id === actorId ? { ...actor, outfitImage: imageUrl } : actor
        )
      );

      const actor = selectedActors.find((a) => a.id === actorId);
      if (actor?.uploadedImage) {
        const vtonResult = await mockFunctions.processVTON(
          actor.uploadedImage,
          imageUrl
        );
        setSelectedActors((prev) =>
          prev.map((a) =>
            a.id === actorId
              ? { ...a, vtonResult: vtonResult.processedImage }
              : a
          )
        );
      }

      toast({
        title: "Outfit Uploaded",
        description: "Outfit processed with VTON successfully!",
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Failed to process outfit. Please try again.",
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

      <div className="browse-more">
        <Button variant="outline" className="browse-btn">
          Browse More Actors
        </Button>
      </div>

      {selectedActors.length > 0 && (
        <div className="selected-actors-section">
          <h3 className="subsection-title">YOUR SELECTION</h3>
          <div className="selected-actors-grid">
            {selectedActors.map((actor) => (
              <SelectedAvatarCard
                key={actor.id}
                actor={actor}
                onLock={handleLockActor}
                onRemove={handleRemoveActor}
                onOutfitUpload={handleOutfitUpload}
              />
            ))}
          </div>

          <div className="section-navigation">
            <Button className="next-section-btn" onClick={() => onNext?.()}>
              Proceed to Script
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

// Avatar Card Component for browsing actors
function AvatarCard({ actor, isSelected, onSelect }) {
  return (
    <Card className="actor-card">
      <CardContent className="actor-card-content">
        <div className="actor-image">
          {actor.avatarUrl ? (
            <img src={"https://i.pinimg.com/736x/3d/70/41/3d704151eebcdb14b129c0fead905fbb.jpg" ?? actor.avatarUrl} alt={actor.name} />
          ) : (
            <div className="placeholder-image">
              <User className="w-12 h-12" />
            </div>
          )}
        </div>
        <div className="actor-info">
          <h3 className="actor-name">{actor.name}</h3>
          <p className="actor-category">{actor.triggerWord}</p>
          <div className="actor-pricing">
            <span className="price">₹{actor.costPerVideo}</span>
            <span className="credits">{actor.costPerVideo} Credits</span>
          </div>
        </div>
        <Button
          className="select-actor-btn"
          onClick={() => onSelect(actor)}
          disabled={isSelected}
        >
          {isSelected ? "Selected" : "Select Actor"}
        </Button>
      </CardContent>
    </Card>
  );
}

// Selected Avatar Card Component with customization options
function SelectedAvatarCard({ actor, onLock, onRemove, onOutfitUpload }) {
  return (
    <Card className="selected-actor-card">
      <CardContent className="selected-actor-content">
        <div className="selected-actor-header">
          <h4 className="selected-actor-name">{actor.name}</h4>
          <div className="actor-controls">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onLock(actor.id)}
              className="lock-btn"
            >
              {actor.isLocked ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(actor.id)}
              className="remove-btn"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="actor-customization">
          <div className="customization-section">
            <h5>Voice Style</h5>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select voice style" />
              </SelectTrigger>
              <SelectContent>
                {mockVoiceStyles.map((style) => (
                  <SelectItem key={style.id} value={style.name}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="customization-section">
            <h5>Outfit</h5>
            <div className="outfit-upload">
              {actor.outfitImage ? (
                <div className="outfit-preview">
                  <img
                    src={actor.outfitImage}
                    alt="Outfit"
                    className="outfit-image"
                  />
                  <div className="outfit-actions">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // clear outfit / vton
                      }}
                      className="cancel-outfit-btn"
                    >
                      Cancel
                    </Button>
                    <label className="reupload-btn">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          onOutfitUpload(e.target.files[0], actor.id)
                        }
                        className="hidden-input"
                      />
                      <Button size="sm" variant="outline" as="span">
                        Reupload
                      </Button>
                    </label>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="upload" className="outfit-tabs">
                  <TabsList>
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                    <TabsTrigger value="prompt">Text Prompt</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <label className="upload-area small">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          onOutfitUpload(e.target.files[0], actor.id)
                        }
                        className="hidden-input"
                      />
                      <Shirt className="w-5 h-5" />
                      <span>Upload Outfit</span>
                    </label>
                  </TabsContent>
                  <TabsContent value="prompt">
                    <Input placeholder="Describe the outfit..." />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>

          <div className="customization-section">
            <h5>Languages</h5>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select languages" />
              </SelectTrigger>
              <SelectContent>
                {mockLanguages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="lock-add-btn" onClick={() => onLock(actor.id)}>
            {actor.isLocked ? "Locked & Added" : "Lock & Add"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
