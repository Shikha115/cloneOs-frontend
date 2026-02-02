import React, { useMemo } from 'react';
import { Dialog, DialogContent } from '../../../../components/ui/dialog';
import { Badge } from '../../../../components/ui/badge';
import { Film, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

export function FrameDetailsModal({ selectedFrame, open, onOpenChange, showFinalImage, setShowFinalImage }) {
  // Determine which image to display in modal based on hover state
  const currentDisplayImage = useMemo(() => {
    if (!selectedFrame) return null;
    return showFinalImage && selectedFrame.finalImageUrl ? selectedFrame.finalImageUrl : selectedFrame.sketchUrl;
  }, [selectedFrame, showFinalImage]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-black border-gray-800 h-[400px] p-0">
        {/* Top Left Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {/* Scene Number Badge */}
          <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full font-semibold flex items-center gap-2 shadow-lg">
            <span className="text-xs">🎬</span>
            Scene {selectedFrame?.sequenceOrder}
          </Badge>

          {/* Status Badge with dynamic color */}
          <Badge
            className={`px-3 py-1 rounded-full font-semibold flex items-center gap-2 shadow-lg ${
              selectedFrame?.status === 'completed'
                ? 'bg-green-600/80 text-white'
                : selectedFrame?.status === 'processing'
                ? 'bg-blue-600/80 text-white'
                : selectedFrame?.status === 'pending'
                ? 'bg-yellow-600/80 text-white'
                : 'bg-gray-700/80 text-gray-200'
            }`}
          >
            {selectedFrame?.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
            {selectedFrame?.status === 'processing' && <Loader className="w-4 h-4 animate-spin" />}
            {selectedFrame?.status === 'pending' && <AlertCircle className="w-4 h-4" />}
            <span className="capitalize text-xs">{selectedFrame?.status}</span>
          </Badge>
        </div>

        <div className="flex gap-6 h-[inherit]">
          {/* Left Side - Image with hover toggle */}
          <div
            className="w-1/2 flex flex-col items-center justify-center bg-gray-900 overflow-hidden relative cursor-pointer"
            onMouseEnter={() => selectedFrame?.finalImageUrl && setShowFinalImage(true)}
            onMouseLeave={() => setShowFinalImage(false)}
          >
            {currentDisplayImage ? (
              <>
                <img
                  src={currentDisplayImage}
                  alt={`Scene ${selectedFrame?.sequenceOrder}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {/* Label badge */}
                <div
                  className={`absolute bottom-2 right-2 ${
                    showFinalImage ? 'bg-orange-600/80' : 'bg-black/60'
                  } text-white text-xs px-2 py-1 rounded`}
                >
                  {showFinalImage ? 'Final' : 'Sketch'}
                </div>
                {/* Hover indicator */}
                {selectedFrame?.finalImageUrl && (
                  <div
                    className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium transition-opacity duration-300 ${
                      showFinalImage ? 'opacity-0' : 'opacity-100'
                    } bg-black/60 text-white`}
                  >
                    Hover to see final
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Film className="w-12 h-12 text-gray-600 mb-2" />
                <p className="text-gray-400 text-sm">No image available</p>
              </div>
            )}
          </div>

          {/* Right Side - Scrollable Content */}
          <div className="w-1/2 overflow-y-auto pr-4 space-y-4 pt-12">
            <div className="space-y-4">
              {/* Script Text */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-white">Script Text</h3>
                <p className="text-sm text-gray-300 bg-gray-900 p-3 rounded border border-gray-800">
                  {selectedFrame?.scriptText}
                </p>
              </div>

              {/* AI Prompt */}
              {selectedFrame?.aiPrompt && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-white">AI Prompt</h3>
                  <p className="text-sm text-gray-300 bg-gray-900 p-3 rounded border border-gray-800">
                    {selectedFrame?.aiPrompt}
                  </p>
                </div>
              )}

              {/* Final Image */}
              {selectedFrame?.finalImageUrl && (
                <div className="space-y-2 pt-2 border-t border-gray-800">
                  <h3 className="font-semibold text-sm text-white">Final Image</h3>
                  <img
                    src={selectedFrame.finalImageUrl}
                    alt="Final"
                    className="w-full rounded-lg border border-gray-800"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
