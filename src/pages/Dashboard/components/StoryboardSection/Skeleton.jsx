import React from 'react';
import { Card, CardContent } from '../../../../components/ui/card';

export function renderFrameSkeleton(key) {
  return (
    <Card key={`skeleton-${key}`} className="storyboard-card">
      <CardContent className="storyboard-content">
        {/* Image skeleton with pulse animation */}
        <div className="relative h-48 w-full mb-4 overflow-hidden rounded-md">
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-shimmer"
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>

        {/* Scene title skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Script text lines skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-full bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-2 mt-auto">
          <div className="h-8 w-24 bg-gray-800 rounded animate-pulse" />
          <div className="h-8 w-28 bg-gray-800 rounded animate-pulse" />
          <div className="h-8 w-8 ml-auto bg-gray-800 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
