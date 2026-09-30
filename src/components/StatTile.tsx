/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatTileProps {
  type: 'download' | 'upload';
  speed: number;
  history: number[];
}

export const StatTile: React.FC<StatTileProps> = ({ type, speed, history }) => {
  const isDl = type === 'download';
  const label = isDl ? 'Download' : 'Upload';
  const icon = isDl ? (
    <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
  ) : (
    <ArrowUp className="w-3.5 h-3.5 text-blue-400" />
  );

  // Sparkline coordinates
  const values = history.length > 0 ? history : [speed, speed, speed, speed];
  const max = Math.max(...values, 10);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values
    .map((val, idx) => {
      const x = (idx / (values.length - 1 || 1)) * 90;
      const y = 24 - ((val - min) / range) * 18;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex-1 p-3 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-sm overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              isDl
                ? 'bg-cyan-500/10 text-cyan-500'
                : 'bg-blue-500/10 text-blue-500'
            }`}
          >
            {icon}
          </div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {label}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          Mbps
        </span>
      </div>

      <div className="mt-1.5 flex items-baseline justify-between">
        <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
          {speed.toFixed(1)}
        </span>
      </div>

      {/* Tiny sparkline SVG */}
      <div className="w-full h-6 mt-1">
        <svg
          viewBox="0 0 90 26"
          fill="none"
          className="w-full h-full overflow-visible"
        >
          <polyline
            fill="none"
            stroke={isDl ? '#06B6D4' : '#3B82F6'}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
};
