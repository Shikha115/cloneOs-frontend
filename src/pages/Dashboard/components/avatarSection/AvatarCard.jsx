import React from 'react';
import { Card, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { User } from 'lucide-react';

export default function AvatarCard({ actor, isSelected, onSelect }) {
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
