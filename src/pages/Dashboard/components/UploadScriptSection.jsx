import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Upload, RefreshCw } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import { mockFunctions } from '../../../components/mock';

export default function UploadScriptSection({ sectionRef, onFramesReady }) {
  const { toast } = useToast();
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStoryboard = async () => {
    if (!script.trim()) {
      toast({ title: 'Script Required', description: 'Please upload or paste your script first.', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await mockFunctions.generateStoryboard(script);
      onFramesReady?.(result.frames);
      toast({ title: 'Success', description: result.message });
    } catch (error) {
      toast({ title: 'Generation Failed', description: 'Failed to generate storyboard. Please try again.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <section ref={sectionRef} className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">UPLOAD YOUR SCRIPT</h2>
      </div>

      <Card className="script-card">
        <CardContent className="script-content">
          <div className="script-upload-area">
            <div className="upload-zone">
              <Upload className="w-8 h-8" />
              <p>Drag & Drop your script file here</p>
              <Button variant="outline" className="browse-files-btn">
                Browse Files
              </Button>
            </div>

            <div className="script-divider">
              <span>OR</span>
            </div>

            <div className="paste-script">
              <p>Paste your script directly:</p>
              <Textarea
                placeholder="Enter your script here..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="script-textarea"
                rows={10}
              />
            </div>
          </div>

          <div className="script-actions">
            <Button
              className="generate-storyboard-btn"
              onClick={handleGenerateStoryboard}
              disabled={isGenerating || !script.trim()}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Storyboard'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
