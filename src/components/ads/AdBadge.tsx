/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AdBadgeProps {
  className?: string;
}

export const AdBadge: React.FC<AdBadgeProps> = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-500/10 select-none ${className}`}
      aria-label="Advertisement"
    >
      Ad
    </span>
  );
};
