import React, { useState } from 'react';
import { Card, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { FrameDetailsModal } from './FrameDetailsModal';

export function FrameCard({ frame, isGeneratingSketches, isGeneratingImages, setSelectedFrame: parentSetSelectedFrame, setRegenerateFrame, onImageClick }) {
  const [isHovering, setIsHovering] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [showFinalImage, setShowFinalImage] = useState(false);
  
  const isImageGenerating = isGeneratingSketches || isGeneratingImages;
  const needsImage = !frame.sketchUrl && !frame.finalImageUrl;
  const hasFinalImage = !!frame.finalImageUrl;

  // Determine which image to show (default sketch, hover final)
  const showFinalImageHover = hasFinalImage && isHovering;
  const currentImage = showFinalImageHover
    ? frame.finalImageUrl
    : frame.sketchUrl || frame.finalImageUrl;

  const handleViewDetails = () => {
    setSelectedFrame(frame);
    parentSetSelectedFrame(frame);
  };

  return (
    <>
      <Card key={frame.id} className="storyboard-card">
        <CardContent className="storyboard-content">
          {currentImage || (isImageGenerating && needsImage) ? (
            <div
              className="frame-preview relative overflow-hidden rounded-md cursor-pointer"
              onMouseEnter={() => hasFinalImage && setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => currentImage && onImageClick?.(currentImage)}
            >
              {isImageGenerating && needsImage ? (
                <div className="relative h-full w-full overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-shimmer"
                    style={{ backgroundSize: '200% 100%' }}
                  />
                </div>
              ) : (
                <>
                  <img
                    src={currentImage}
                    alt={frame.scene}
                    className="w-full h-48 object-cover transition-opacity duration-300"
                  />
                  {/* Hover indicator overlay */}
                  {hasFinalImage && (
                    <div
                      className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
                        isHovering ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span className="text-white text-sm font-medium">Show Final</span>
                    </div>
                  )}
                  {!hasFinalImage && frame.sketchUrl && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      Sketch
                    </div>
                  )}
                  {hasFinalImage && !isHovering && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      Sketch
                    </div>
                  )}
                  {hasFinalImage && isHovering && (
                    <div className="absolute bottom-2 right-2 bg-orange-600/80 text-white text-xs px-2 py-1 rounded">
                      Final
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}
          <div className="frame-info">
            <h4>Scene {frame.sequenceOrder}</h4>
            <p className="line-clamp-5">{frame.scriptText}</p>
          </div>
          <div className="frame-actions">
            <Button size="sm" variant="ghost" className="frame-action-btn" onClick={handleViewDetails}>
              View Details
            </Button>
            <Button size="sm" variant="ghost" className="frame-action-btn" onClick={() => setRegenerateFrame(frame)}>
              Generate New
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Frame Details Modal */}
      <FrameDetailsModal
        selectedFrame={selectedFrame}
        open={!!selectedFrame}
        onOpenChange={() => setSelectedFrame(null)}
        showFinalImage={showFinalImage}
        setShowFinalImage={setShowFinalImage}
      />
    </>
  );
}
