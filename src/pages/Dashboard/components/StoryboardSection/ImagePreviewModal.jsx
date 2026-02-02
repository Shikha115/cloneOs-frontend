import React from 'react';
import { Dialog, DialogContent } from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';

export function ImagePreviewModal({ previewIndex, previewImages, onClose, onPrev, onNext }) {
  return (
    <Dialog open={previewIndex !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-black border-gray-800 p-0 overflow-hidden">
        {previewIndex !== null && previewImages[previewIndex] && (
          <div className="relative">
            <img
              src={previewImages[previewIndex].url}
              alt={`Scene ${previewImages[previewIndex].sequenceOrder} ${previewImages[previewIndex].type}`}
              className="w-full max-h-[80vh] object-contain bg-black"
            />

            <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
              Scene {previewImages[previewIndex].sequenceOrder} • {previewImages[previewIndex].type}
            </div>

            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={onPrev}
              >
                ←
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={onNext}
              >
                →
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
