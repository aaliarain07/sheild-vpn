/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUp, Activity, Zap } from 'lucide-react';

interface SpeedometerProps {
  value: number;
  maxValue?: number;
  unit?: string;
  phase: 'idle' | 'ping' | 'download' | 'upload' | 'complete';
  progress?: number;
  ping?: number;
  jitter?: number;
}

export const Speedometer: React.FC<SpeedometerProps> = ({
  value,
  maxValue = 500,
  unit = 'Mbps',
  phase,
  progress = 0,
  ping = 0,
  jitter = 0,
}) => {
  // Arc calculation for 240-degree gauge (from -120deg to +120deg)
  const radius = 80;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // 240 degrees is 240/360 = 2/3 of full circle
  const arcLength = circumference * (240 / 360);
  
  // Clamped ratio
  const ratio = Math.min(1, Math.max(0, value / maxValue));
  // strokeDashoffset: at ratio 0, full arcLength offset; at ratio 1, 0 offset
  const strokeDashoffset = arcLength * (1 - ratio);

  // Rotation angle for needle: -120deg to +120deg
  const needleAngle = -120 + ratio * 240;

  // Major ticks (0, 50, 100, 200, 300, 500)
  const ticks = [
    { label: '0', val: 0 },
    { label: '50', val: 50 },
    { label: '100', val: 100 },
    { label: '250', val: 250 },
    { label: '500+', val: 500 },
  ];

  // Dynamic colors based on phase
  const getPhaseColors = () => {
    switch (phase) {
      case 'ping':
        return {
          gradient: ['#F59E0B', '#FBBF24'],
          stroke: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.25)',
          label: 'Testing Ping & Jitter',
          icon: Activity,
          iconColor: 'text-amber-400',
        };
      case 'download':
        return {
          gradient: ['#06B6D4', '#3B82F6'],
          stroke: '#06B6D4',
          glow: 'rgba(6, 182, 212, 0.3)',
          label: 'Testing Download',
          icon: ArrowDown,
          iconColor: 'text-cyan-400',
        };
      case 'upload':
        return {
          gradient: ['#3B82F6', '#8B5CF6'],
          stroke: '#8B5CF6',
          glow: 'rgba(139, 92, 246, 0.3)',
          label: 'Testing Upload',
          icon: ArrowUp,
          iconColor: 'text-purple-400',
        };
      case 'complete':
        return {
          gradient: ['#10B981', '#06B6D4'],
          stroke: '#10B981',
          glow: 'rgba(16, 185, 129, 0.25)',
          label: 'Test Complete',
          icon: Zap,
          iconColor: 'text-emerald-400',
        };
      default:
        return {
          gradient: ['#3B82F6', '#06B6D4'],
          stroke: '#3B82F6',
          glow: 'rgba(59, 130, 246, 0.15)',
          label: 'Ready for Benchmark',
          icon: Zap,
          iconColor: 'text-blue-400',
        };
    }
  };

  const currentTheme = getPhaseColors();
  const PhaseIcon = currentTheme.icon;

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* Ambient Radial Aura */}
      <div
        className="absolute w-56 h-56 rounded-full filter blur-3xl pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: currentTheme.glow }}
      />

      {/* SVG Speedometer Gauge */}
      <div className="relative w-64 h-56 flex items-center justify-center">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 220 200"
        >
          <defs>
            {/* Active Gauge Gradient */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={currentTheme.gradient[0]} />
              <stop offset="100%" stopColor={currentTheme.gradient[1]} />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track (240 deg arc) */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800/80"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(150 110 110)"
          />

          {/* Active Colored Arc with Smooth Transition */}
          <motion.circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            strokeLinecap="round"
            transform="rotate(150 110 110)"
            filter="url(#gaugeGlow)"
          />

          {/* Tick Marks & Scale Numbers */}
          {ticks.map((tick) => {
            const tickRatio = tick.val / maxValue;
            const tickAngle = -120 + tickRatio * 240;
            const rad = (tickAngle - 90) * (Math.PI / 180);
            const x1 = 110 + (radius - 12) * Math.cos(rad);
            const y1 = 110 + (radius - 12) * Math.sin(rad);
            const x2 = 110 + (radius - 18) * Math.cos(rad);
            const y2 = 110 + (radius - 18) * Math.sin(rad);
            const textX = 110 + (radius - 28) * Math.cos(rad);
            const textY = 110 + (radius - 28) * Math.sin(rad) + 3;

            return (
              <g key={tick.label} className="opacity-60 dark:opacity-40">
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  className="text-slate-400 dark:text-slate-500"
                  strokeWidth="1.5"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-slate-400 dark:fill-slate-500 font-medium"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Center Pivot Glow Pin */}
          <circle
            cx="110"
            cy="110"
            r="16"
            className="fill-white dark:fill-[#0B1220] stroke-slate-200 dark:stroke-white/10"
            strokeWidth="2"
          />
          <circle
            cx="110"
            cy="110"
            r="6"
            fill={currentTheme.stroke}
          />

          {/* Animated Needle / Pointer */}
          <motion.g
            animate={{ rotate: needleAngle }}
            transition={{ type: 'spring', damping: 18, stiffness: 140 }}
            style={{ originX: '110px', originY: '110px' }}
          >
            {/* Needle Line */}
            <line
              x1="110"
              y1="110"
              x2="110"
              y2="42"
              stroke={currentTheme.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Needle Tip Arrowhead */}
            <polygon
              points="107,48 110,38 113,48"
              fill={currentTheme.stroke}
            />
          </motion.g>
        </svg>

        {/* Center Digital Readout Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 pointer-events-none">
          {/* Phase Badge */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-1 backdrop-blur-xs">
            <PhaseIcon className={`w-3 h-3 ${currentTheme.iconColor} ${phase !== 'idle' && phase !== 'complete' ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {currentTheme.label}
            </span>
          </div>

          {/* Speed Number */}
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-900 dark:text-white drop-shadow-xs">
              {phase === 'idle'
                ? '0.0'
                : phase === 'ping'
                ? (ping || 24).toString()
                : value.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {phase === 'ping' ? 'ms' : unit}
            </span>
          </div>

          {/* Progress bar line if test in progress */}
          {phase !== 'idle' && phase !== 'complete' && (
            <div className="w-24 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Live Auxiliary Stats Pill (Ping / Jitter) */}
      <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-amber-500" />
          <span>Ping:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {ping > 0 ? `${ping} ms` : '--'}
          </span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-400/40" />
        <div className="flex items-center gap-1.5">
          <span>Jitter:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {jitter > 0 ? `${jitter} ms` : '--'}
          </span>
        </div>
      </div>
    </div>
  );
};
