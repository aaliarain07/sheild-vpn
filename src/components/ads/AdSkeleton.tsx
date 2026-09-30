/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AdSkeletonProps {
  height?: string;
  className?: string;
  label?: string;
}

export const AdSkeleton: React.FC<AdSkeletonProps> = ({
  height = 'h-[50px]',
  className = '',
  label = 'Loading Ad…',
}) => {
  return (
    <div
      className={`relative w-full ${height} rounded-xl overflow-hidden bg-slate-200/60 dark:bg-white/5 border border-slate-300/40 dark:border-white/5 flex items-center justify-center select-none ${className}`}
    >
      {/* Animated shimmer gradient */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent" />
      <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 dark:text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" />
        <span>{label}</span>
      </div>
    </div>
  );
};
