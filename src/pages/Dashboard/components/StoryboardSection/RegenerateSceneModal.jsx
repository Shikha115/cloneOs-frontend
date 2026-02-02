import React from 'react';
import { Dialog, DialogContent } from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Textarea } from '../../../../components/ui/textarea';
import { Loader } from 'lucide-react';

export function RegenerateSceneModal({ regenerateFrame, setRegenerateFrame, regeneratePrompt, setRegeneratePrompt, regenerateMutation }) {
  return (
    <Dialog
      open={!!regenerateFrame}
      onOpenChange={() => {
        setRegenerateFrame(null);
        setRegeneratePrompt('');
      }}
    >
      <DialogContent className="bg-black border-gray-800 max-w-md">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Regenerate Scene</h3>
            <p className="text-sm text-gray-400">Enter a prompt for Scene {regenerateFrame?.sequenceOrder}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Prompt</label>
            <Textarea
              value={regeneratePrompt}
              onChange={(e) => setRegeneratePrompt(e.target.value)}
              placeholder="Describe what you'd like for this scene..."
              className="bg-gray-900 border-gray-700 text-white resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setRegenerateFrame(null);
                setRegeneratePrompt('');
              }}
              className="bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (regeneratePrompt.trim() && regenerateFrame?.id) {
                  regenerateMutation.mutate(
                    { sceneId: regenerateFrame.id, prompt: regeneratePrompt },
                    {
                      onSuccess: () => {
                        setRegenerateFrame(null);
                        setRegeneratePrompt('');
                      },
                    }
                  );
                }
              }}
              disabled={!regeneratePrompt.trim() || regenerateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {regenerateMutation.isPending ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                'Regenerate'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
