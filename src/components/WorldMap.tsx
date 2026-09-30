/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Shield, Check, Signal, Info } from 'lucide-react';
import { ServerLocation, ConnectionStatus } from '../types/vpn.ts';
import { BottomSheet } from './BottomSheet.tsx';

interface WorldMapProps {
  servers: ServerLocation[];
  selectedServer: ServerLocation;
  status: ConnectionStatus;
  onSelectServer: (server: ServerLocation) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  servers,
  selectedServer,
  status,
  onSelectServer,
}) => {
  const [inspectedServer, setInspectedServer] = useState<ServerLocation | null>(null);

  // User simulated origin (e.g. San Francisco / US West)
  const userOrigin = { x: 220, y: 190 };

  // Calculate coordinates for SVG viewBox="0 0 1000 500"
  const getCoords = (server: ServerLocation) => {
    return {
      x: server.mapX * 10,
      y: server.mapY * 5,
    };
  };

  const targetCoords = getCoords(selectedServer);

  // Arc path between userOrigin and target server
  const dx = targetCoords.x - userOrigin.x;
  const dy = targetCoords.y - userOrigin.y;
  const cx = userOrigin.x + dx / 2;
  const cy = Math.min(userOrigin.y, targetCoords.y) - Math.abs(dx) * 0.22 - 30;
  const arcPath = `M ${userOrigin.x} ${userOrigin.y} Q ${cx} ${cy} ${targetCoords.x} ${targetCoords.y}`;

  const isConnecting = status === 'connecting';
  const isConnected = status === 'connected';

  return (
    <div className="relative w-full h-[360px] bg-slate-900/60 dark:bg-[#0E1626] rounded-2xl border border-slate-200/80 dark:border-white/6 overflow-hidden flex flex-col justify-between p-3 select-none">
      {/* Map Header Overlay */}
      <div className="flex items-center justify-between z-10 px-2 pt-1 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">
            {servers.length} Global Nodes Active
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Target: {selectedServer.country} ({selectedServer.ping}ms)
        </div>
      </div>

      {/* SVG Stylized World Map */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="1"
              />
            </pattern>
            {/* Gradient for Arc */}
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="1" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect width="1000" height="500" fill="url(#grid)" />

          {/* Continents simplified vector paths */}
          <g fill="currentColor" className="text-slate-800/80 dark:text-[#18233C]">
            {/* North America */}
            <path d="M 120,80 Q 220,60 300,100 Q 320,160 250,220 Q 200,240 180,270 Q 150,230 130,170 Z" />
            {/* Greenland */}
            <path d="M 330,40 Q 380,30 390,70 Q 350,90 320,70 Z" />
            {/* South America */}
            <path d="M 270,280 Q 370,300 370,380 Q 340,460 300,470 Q 270,410 260,340 Z" />
            {/* Europe */}
            <path d="M 460,110 Q 560,90 580,160 Q 520,200 460,180 Q 440,140 460,110 Z" />
            {/* Africa */}
            <path d="M 460,200 Q 580,200 590,300 Q 540,420 500,430 Q 450,330 460,200 Z" />
            {/* Asia */}
            <path d="M 580,100 Q 820,80 880,190 Q 820,280 690,260 Q 640,240 580,170 Z" />
            {/* Australia */}
            <path d="M 800,340 Q 910,340 900,430 Q 830,440 790,390 Z" />
          </g>

          {/* Connecting Arc Animation */}
          {(isConnecting || isConnected) && (
            <g>
              {/* Outer glow arc */}
              <path
                d={arcPath}
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.3"
                className="filter blur-[2px]"
              />
              {/* Core animated dashed arc */}
              <path
                d={arcPath}
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                strokeLinecap="round"
                className="animate-[dash_2s_linear_infinite]"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="100"
                  to="0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          )}

          {/* User Origin Pin */}
          <g transform={`translate(${userOrigin.x}, ${userOrigin.y})`}>
            <circle r="12" fill="#3B82F6" opacity="0.2" className="animate-ping" />
            <circle r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Server Nodes */}
          {servers.map((server) => {
            const { x, y } = getCoords(server);
            const isSelected = selectedServer.id === server.id;

            return (
              <g
                key={server.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer group"
                onClick={() => setInspectedServer(server)}
              >
                {/* Ripple ring for selected server */}
                {isSelected && (
                  <circle
                    r="16"
                    fill={isConnected ? '#22C55E' : '#06B6D4'}
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Outer hover ring */}
                <circle
                  r={isSelected ? '9' : '6'}
                  fill={
                    isSelected
                      ? isConnected
                        ? '#22C55E'
                        : '#06B6D4'
                      : server.ping < 50
                      ? '#3B82F6'
                      : '#94A3B8'
                  }
                  opacity={isSelected ? '0.4' : '0.2'}
                  className="transition-all duration-200 group-hover:scale-150"
                />

                {/* Core dot */}
                <circle
                  r={isSelected ? '5' : '3.5'}
                  fill={
                    isSelected
                      ? isConnected
                        ? '#22C55E'
                        : '#06B6D4'
                      : '#3B82F6'
                  }
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? '1.5' : '1'}
                  className="transition-transform group-hover:scale-125"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Map Footer Note */}
      <div className="z-10 px-2 pb-1 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          Tap any dot to inspect or connect
        </span>
        <span className="font-medium text-slate-300">
          WireGuard · Fast Speeds
        </span>
      </div>

      {/* Country Detail Bottom Sheet */}
      <BottomSheet
        isOpen={Boolean(inspectedServer)}
        onClose={() => setInspectedServer(null)}
        title={inspectedServer ? `${inspectedServer.country}` : ''}
      >
        {inspectedServer && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-[#1A2540]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{inspectedServer.flag}</span>
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {inspectedServer.country}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {inspectedServer.cities.length} Available Server{' '}
                    {inspectedServer.cities.length > 1 ? 'Locations' : 'Location'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-semibold px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {inspectedServer.ping} ms
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Load: {inspectedServer.load}%
                </p>
              </div>
            </div>

            {/* City list inside sheet */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select City Gateway
              </h5>
              {inspectedServer.cities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => {
                    onSelectServer(inspectedServer);
                    setInspectedServer(null);
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-white/6 hover:border-blue-500 bg-white dark:bg-[#121A2B] flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {city.name}
                    </span>
                    <p className="text-[11px] font-mono text-slate-400">
                      IP: {city.ip}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">
                      {city.ping} ms
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
