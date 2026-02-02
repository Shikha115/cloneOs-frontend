import React from 'react';
import { Card, CardContent } from '../../components/ui/card';

export function renderProjectSkeleton(key) {
  return (
    <Card key={`skeleton-${key}`} className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
      <CardContent className="p-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-16 rounded-lg bg-gray-800 animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-800 rounded animate-pulse w-3/4" />
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-gray-800 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="h-10 w-44 bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Script section skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-gray-800 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="gap-8 grid grid-cols-2">
      {Array.from({ length: 3 }).map((_, idx) => renderProjectSkeleton(idx))}
    </div>
  );
}
