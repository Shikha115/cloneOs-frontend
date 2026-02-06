import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Loader } from 'lucide-react';
import { useStoryboardStore, useStoryboardFrames } from '../../../../store/storyboard.store';
import { useSelectedProjectId } from '../../../../store/project.store';
import { useRegenerateScene, useGenerateImages, useGenerateSketches } from '../../../../services/project.service';
import { useToast } from '../../../../hooks/use-toast';
import { FrameCard } from './FrameCard';
import { renderFrameSkeleton } from './Skeleton';
import { RegenerateSceneModal } from './RegenerateSceneModal';
import { ImagePreviewModal } from './ImagePreviewModal';

export default function StoryboardSection({ sectionRef, onFramesChange, onProceed, isGenerating: propIsGenerating }) {
  const projectId = useSelectedProjectId();
  const frames = useStoryboardFrames();
  const { updateFrame, setFrames, isGeneratingScript, isGeneratingSketches, isGeneratingImages, setGeneratingScript, setGeneratingSketches, setGeneratingImages } = useStoryboardStore();
  const { toast } = useToast();
  const [regenerateFrame, setRegenerateFrame] = useState(null);
  const [regeneratePrompt, setRegeneratePrompt] = useState('');
  const [previewIndex, setPreviewIndex] = useState(null);

  // Combine prop and store states for backward compatibility
  const isGenerating = propIsGenerating || isGeneratingScript;

  // Check if any frame has a sketch URL to determine button state
  const hasSketches = useMemo(() => {
    return frames.some(frame => frame.sketchUrl);
  }, [frames]);

  // Check if all frames have final images (images generated)
  const hasAllFinalImages = useMemo(() => {
    return frames.length > 0 && frames.every(frame => frame.finalImageUrl);
  }, [frames]);

  const previewImages = useMemo(() => {
    return frames.flatMap((frame) => {
      const images = [];
      if (frame.sketchUrl) {
        images.push({
          url: frame.sketchUrl,
          type: 'sketch',
          sequenceOrder: frame.sequenceOrder,
          frameId: frame.id,
        });
      }
      if (frame.finalImageUrl) {
        images.push({
          url: frame.finalImageUrl,
          type: 'final',
          sequenceOrder: frame.sequenceOrder,
          frameId: frame.id,
        });
      }
      return images;
    });
  }, [frames]);

  const openPreview = (url) => {
    const index = previewImages.findIndex((img) => img.url === url);
    if (index >= 0) {
      setPreviewIndex(index);
    }
  };

  const closePreview = () => setPreviewIndex(null);

  const showPrev = () => {
    setPreviewIndex((prev) => {
      if (prev === null || previewImages.length === 0) return null;
      return (prev - 1 + previewImages.length) % previewImages.length;
    });
  };

  const showNext = () => {
    setPreviewIndex((prev) => {
      if (prev === null || previewImages.length === 0) return null;
      return (prev + 1) % previewImages.length;
    });
  };

  const regenerateMutation = useRegenerateScene({
    onSuccess: (response) => {
      if (response?.data) {
        const updatedFrame = response.data;
        updateFrame(updatedFrame.id, {
          sketchUrl: updatedFrame.sketchUrl,
          finalImageUrl: updatedFrame.finalImageUrl,
          aiPrompt: updatedFrame.aiPrompt,
          scriptText: updatedFrame.scriptText,
          status: updatedFrame.status,
          sequenceOrder: updatedFrame.sequenceOrder,
        });
        toast({
          title: 'Scene regenerated',
          description: 'Successfully regenerated the scene.',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Regeneration failed',
        description: error?.message || 'Unable to regenerate scene',
        variant: 'destructive',
      });
    },
  });

  const generateSketchesMutation = useGenerateSketches({
    onMutate: () => {
      setGeneratingSketches(true);
    },
    onSuccess: (response) => {
      setGeneratingSketches(false);
      if (response?.data && Array.isArray(response.data)) {
        if (frames.length === 0) {
          const nextFrames = response.data.map((scene, idx) => ({
            id: scene.id || `scene-${idx}`,
            scene: scene.scene || `Scene ${scene.sequenceOrder ?? idx + 1}`,
            scriptText: scene.scriptText || scene.aiPrompt || 'No description',
            sketchUrl: scene.sketchUrl || null,
            finalImageUrl: scene.finalImageUrl || null,
            aiPrompt: scene.aiPrompt || null,
            status: scene.status || 'pending',
            sequenceOrder: scene.sequenceOrder ?? idx + 1,
            isLocked: false,
          }));
          setFrames(nextFrames);
        } else {
          response.data.forEach((updatedFrame) => {
            updateFrame(updatedFrame.id, {
              sketchUrl: updatedFrame.sketchUrl,
              finalImageUrl: updatedFrame.finalImageUrl,
              aiPrompt: updatedFrame.aiPrompt,
              scriptText: updatedFrame.scriptText,
              status: updatedFrame.status,
              sequenceOrder: updatedFrame.sequenceOrder,
            });
          });
        }
        toast({
          title: 'Sketches generated',
          description: `Successfully generated ${response.data.length} sketches.`,
        });
      }
    },
    onError: (error) => {
      setGeneratingSketches(false);
      toast({
        title: 'Generation failed',
        description: error?.message || 'Unable to generate sketches',
        variant: 'destructive',
      });
    },
  });

  const generateImagesMutation = useGenerateImages({
    onMutate: () => {
      setGeneratingImages(true);
    },
    onSuccess: (response) => {
      setGeneratingImages(false);
      if (response?.data && Array.isArray(response.data)) {
        if (frames.length === 0) {
          const nextFrames = response.data.map((scene, idx) => ({
            id: scene.id || `scene-${idx}`,
            scene: scene.scene || `Scene ${scene.sequenceOrder ?? idx + 1}`,
            scriptText: scene.scriptText || scene.aiPrompt || 'No description',
            sketchUrl: scene.sketchUrl || null,
            finalImageUrl: scene.finalImageUrl || null,
            aiPrompt: scene.aiPrompt || null,
            status: scene.status || 'pending',
            sequenceOrder: scene.sequenceOrder ?? idx + 1,
            isLocked: false,
          }));
          setFrames(nextFrames);
        } else {
          response.data.forEach((updatedFrame) => {
            updateFrame(updatedFrame.id, {
              sketchUrl: updatedFrame.sketchUrl,
              finalImageUrl: updatedFrame.finalImageUrl,
              aiPrompt: updatedFrame.aiPrompt,
              scriptText: updatedFrame.scriptText,
              status: updatedFrame.status,
              sequenceOrder: updatedFrame.sequenceOrder,
            });
          });
        }
        toast({
          title: 'Images generated',
          description: `Successfully generated ${response.data.length} images.`,
        });
      }
    },
    onError: (error) => {
      setGeneratingImages(false);
      toast({
        title: 'Generation failed',
        description: error?.message || 'Unable to generate images',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    onFramesChange?.(frames);
  }, [frames, onFramesChange]);

  const toggleLock = (id) => {
    updateFrame(id, (f) => ({ ...f, isLocked: !f.isLocked }));
  };

  // Handle generate storyboard sketches
  const handleGenerateStoryboard = async () => {
    if (!projectId) {
      toast({
        title: 'No project selected',
        description: 'Please select a project first.',
        variant: 'destructive',
      });
      return;
    }

    generateSketchesMutation.mutate(projectId);
  };

  // Handle generate images
  const handleGenerateImages = async () => {
    if (!projectId) {
      toast({
        title: 'No project selected',
        description: 'Please select a project first.',
        variant: 'destructive',
      });
      return;
    }

    generateImagesMutation.mutate(projectId);
  };

  // Get button label and disabled state based on current state
  const generateButtonConfig = useMemo(() => {
    if (isGeneratingSketches) {
      return {
        label: 'Generating Storyboard...',
        disabled: true,
        onClick: handleGenerateStoryboard,
      };
    }
    if (isGeneratingImages) {
      return {
        label: 'Generating Images...',
        disabled: true,
        onClick: handleGenerateImages,
      };
    }
    if (hasSketches) {
      return {
        label: 'AI Generate Images',
        disabled: false,
        onClick: handleGenerateImages,
      };
    }
    return {
      label: 'Generate Storyboard',
      disabled: false,
      onClick: handleGenerateStoryboard,
    };
  }, [isGeneratingSketches, isGeneratingImages, hasSketches]);

  if (!projectId && !isGenerating && frames.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">STORYBOARD GENERATION</h2>
      </div>
      <div className="storyboard-grid">
        {isGeneratingScript ? (
          // Full skeleton when generating script
          Array.from({ length: 3 }).map((_, idx) => renderFrameSkeleton(idx))
        ) : frames.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            No storyboard scenes yet. Generate from your script to see scenes here.
          </div>
        ) : (
          frames.map((frame) => (
            <FrameCard
              key={frame.id}
              frame={frame}
              isGeneratingSketches={isGeneratingSketches}
              isGeneratingImages={isGeneratingImages}
              setSelectedFrame={() => {}} // No-op, handled in FrameCard
              setRegenerateFrame={setRegenerateFrame}
              onImageClick={openPreview}
            />
          ))
        )}
      </div>
      <div className="storyboard-global-actions">
        <Button
          variant="outline"
          className="regenerate-all-btn hover:text-[#ff6b00]"
          onClick={generateButtonConfig.onClick}
          disabled={generateButtonConfig.disabled}
        >
          {isGeneratingSketches || isGeneratingImages ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              {generateButtonConfig.label}
            </>
          ) : (
            generateButtonConfig.label
          )}
        </Button>
        {hasAllFinalImages && <Button className="proceed-video-btn" onClick={onProceed}>Proceed to Video</Button>}
      </div>

      <RegenerateSceneModal
        regenerateFrame={regenerateFrame}
        setRegenerateFrame={setRegenerateFrame}
        regeneratePrompt={regeneratePrompt}
        setRegeneratePrompt={setRegeneratePrompt}
        regenerateMutation={regenerateMutation}
      />

      <ImagePreviewModal
        previewIndex={previewIndex}
        previewImages={previewImages}
        onClose={closePreview}
        onPrev={showPrev}
        onNext={showNext}
      />
    </section>
  );
}
