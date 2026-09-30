/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronRight, Zap } from 'lucide-react';
import { ServerLocation, CityLocation, ConnectionStatus } from '../types/vpn.ts';

interface ServerCardProps {
  server: ServerLocation;
  city: CityLocation;
  status: ConnectionStatus;
  onClick: () => void;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  city,
  status,
  onClick,
}) => {
  const isConnected = status === 'connected';

  // Helper for ping color
  const getPingColor = (ping: number) => {
    if (ping < 50) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (ping < 120) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-3.5 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-sm hover:border-blue-500/40 dark:hover:border-blue-500/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-between group focus:outline-none"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#1A2540] flex items-center justify-center text-2xl shrink-0 shadow-inner">
          {server.flag}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {server.country}
            </span>
            {server.ping < 25 && (
              <span className="inline-flex items-center text-[10px] text-blue-500 dark:text-blue-400 font-medium bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                <Zap className="w-2.5 h-2.5 mr-0.5" />
                Fastest
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {city.name} · {isConnected ? 'Active Tunnel' : 'Tap to change'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {/* Signal bars */}
        <div className="flex items-end gap-0.5 h-3.5" title={`Signal quality: ${city.ping}ms`}>
          <div className="w-1 h-1.5 rounded-xs bg-emerald-500" />
          <div className="w-1 h-2.5 rounded-xs bg-emerald-500" />
          <div
            className={`w-1 h-3 rounded-xs ${
              city.ping < 120 ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-700'
            }`}
          />
          <div
            className={`w-1 h-3.5 rounded-xs ${
              city.ping < 60 ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-700'
            }`}
          />
        </div>

        {/* Ping badge */}
        <span
          className={`text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-md border font-medium ${getPingColor(
            city.ping
          )}`}
        >
          {city.ping} ms
        </span>

        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  );
};
