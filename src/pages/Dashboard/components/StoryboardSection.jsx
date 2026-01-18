import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Film, Lock, Unlock } from 'lucide-react';

export default function StoryboardSection({ sectionRef, initialFrames = [], onFramesChange, onProceed }) {
  const [frames, setFrames] = useState(initialFrames);

  useEffect(() => {
    onFramesChange?.(frames);
  }, [frames, onFramesChange]);

  const toggleLock = (id) => {
    setFrames((prev) => prev.map((f) => (f.id === id ? { ...f, isLocked: !f.isLocked } : f)));
  };

  return (
    <section ref={sectionRef} className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">STORYBOARD GENERATION</h2>
      </div>
      <div className="storyboard-grid">
        {frames.map((frame) => (
          <Card key={frame.id} className="storyboard-card">
            <CardContent className="storyboard-content">
              <div className="frame-preview">
                {frame.thumbnail ? (
                  <img src={frame.thumbnail} alt={frame.scene} />
                ) : (
                  <div className="frame-placeholder">
                    <Film className="w-8 h-8" />
                    <p>Choose File to Add Image!</p>
                  </div>
                )}
              </div>
              <div className="frame-info">
                <h4>{frame.scene}</h4>
                <p>{frame.description}</p>
              </div>
              <div className="frame-actions">
                <Button size="sm" variant="ghost" className="frame-action-btn">Upload Storyboard</Button>
                <Button size="sm" variant="ghost" className="frame-action-btn">Generate New</Button>
                <Button size="sm" variant="ghost" className="frame-action-btn" onClick={() => toggleLock(frame.id)}>
                  {frame.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="storyboard-global-actions">
        <Button variant="outline" className="regenerate-all-btn">AI Generate Images</Button>
        <Button className="proceed-video-btn" onClick={onProceed}>Proceed to Video</Button>
      </div>
    </section>
  );
}
