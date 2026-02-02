import React from 'react';
import { Card, CardContent } from '../../../../components/ui/card';

export default function AvatarSkeleton() {
  return (
    <Card className="actor-card">
      <CardContent className="actor-card-content">
        {/* Image skeleton with pulse animation */}
        <div className="actor-image">
          <div className="relative h-full w-full overflow-hidden rounded-md">
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-shimmer" 
              style={{ backgroundSize: '200% 100%' }} 
            />
          </div>
        </div>

        {/* Actor info skeleton */}
        <div className="actor-info">
          {/* Actor name skeleton */}
          <div className="h-5 w-24 bg-gray-800 rounded animate-pulse mb-2" />
          
          {/* Category skeleton */}
          <div className="h-3 w-16 bg-gray-800 rounded animate-pulse mb-3" />
          
          {/* Pricing skeleton */}
          <div className="actor-pricing">
            <div className="h-4 w-12 bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-10 w-full bg-gray-800 rounded animate-pulse mt-4" />
      </CardContent>
    </Card>
  );
}
