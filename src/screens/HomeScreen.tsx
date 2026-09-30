/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Crown,
  Bell,
  Tv,
  Gamepad2,
  Wifi,
  ShieldAlert,
  AlertOctagon,
  ShieldOff,
  Check,
} from 'lucide-react';
import { useVPN } from '../context/VPNContext.tsx';
import { PowerButton } from '../components/PowerButton.tsx';
import { ServerCard } from '../components/ServerCard.tsx';
import { StatTile } from '../components/StatTile.tsx';
import { QUICK_MODES_CONFIG } from '../data/mockData.ts';
import { QuickMode } from '../types/vpn.ts';

export const HomeScreen: React.FC = () => {
  const {
    connectionStatus,
    selectedServer,
    selectedCity,
    selectedMode,
    sessionTimer,
    downloadSpeed,
    uploadSpeed,
    speedHistory,
    exposedIp,
    isPremium,
    toggleConnection,
    setMode,
    setTab,
    setShowPremiumModal,
    addToast,
    showKillSwitchConfirm,
    confirmDisconnectWithKillSwitch,
    cancelKillSwitchDisconnect,
  } = useVPN();

  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';
  const isDisconnected = connectionStatus === 'disconnected';

  const downloadHistory = speedHistory.map((s) => s.download);
  const uploadHistory = speedHistory.map((s) => s.upload);

  const getModeIcon = (modeId: QuickMode) => {
    switch (modeId) {
      case 'streaming':
        return <Tv className="w-4 h-4" />;
      case 'gaming':
        return <Gamepad2 className="w-4 h-4" />;
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'privacy':
        return <ShieldAlert className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-6 flex flex-col justify-between select-none relative">
      {/* Home Ambient Glow Backdrop */}
      <div
        className={`absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full filter blur-3xl pointer-events-none transition-colors duration-700 ${
          isConnected
            ? 'bg-emerald-500/10'
            : isConnecting
            ? 'bg-cyan-500/12'
            : 'bg-blue-600/5'
        }`}
      />

      {/* TOP BAR */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            ShieldVPN
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Premium Crown Badge */}
          {isPremium ? (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/20 border border-amber-400/40 text-amber-500 dark:text-amber-400 text-xs font-semibold shadow-xs select-none"
              aria-label="Premium Active"
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>PRO</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPremiumModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400/15 to-amber-500/15 border border-amber-400/30 text-amber-500 dark:text-amber-400 text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-xs"
              aria-label="Upgrade to Premium"
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>PRO</span>
            </button>
          )}

          {/* Notification Bell */}
          <button
            type="button"
            onClick={() =>
              addToast(
                'Security Shield Active',
                'All ports monitored. No DNS leak detected.',
                'info'
              )
            }
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 active:scale-95 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* STATUS TEXT UNDER TOP BAR */}
      <div className="relative z-10 text-center mt-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected
                ? 'bg-emerald-500 animate-pulse'
                : isConnecting
                ? 'bg-amber-400 animate-ping'
                : 'bg-slate-400'
            }`}
          />
          <span
            className={`text-xs font-semibold ${
              isConnected
                ? 'text-emerald-500 dark:text-emerald-400'
                : isConnecting
                ? 'text-amber-500 dark:text-amber-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {isConnected
              ? "You're Protected"
              : isConnecting
              ? 'Connecting…'
              : 'Not Protected'}
          </span>
        </div>
      </div>

      {/* CENTERPIECE POWER BUTTON */}
      <div className="relative z-10 my-1">
        <PowerButton
          status={connectionStatus}
          onClick={toggleConnection}
          sessionTimer={sessionTimer}
        />
      </div>

      {/* IP INFO STRIP */}
      <div className="relative z-10 px-1 mb-3">
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-400">IP:</span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200 truncate">
              {isConnected ? selectedCity.ip : exposedIp}
            </span>
          </div>

          <div>
            {isConnected ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <Check className="w-3 h-3 stroke-[3]" />
                Hidden
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                <ShieldOff className="w-3 h-3" />
                Exposed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* LIVE SPEED STAT TILES (WHEN CONNECTED) */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex gap-2.5 mb-3"
        >
          <StatTile
            type="download"
            speed={downloadSpeed}
            history={downloadHistory}
          />
          <StatTile
            type="upload"
            speed={uploadSpeed}
            history={uploadHistory}
          />
        </motion.div>
      )}

      {/* CURRENT SERVER CARD */}
      <div className="relative z-10 mb-3">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {isConnected ? 'Connected Server' : 'Selected Server'}
          </span>
          <button
            type="button"
            onClick={() => setTab('locations')}
            className="text-[11px] font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400"
          >
            Change
          </button>
        </div>
        <ServerCard
          server={selectedServer}
          city={selectedCity}
          status={connectionStatus}
          onClick={() => setTab('locations')}
        />
      </div>

      {/* QUICK MODES HORIZONTAL ROW */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Modes
          </span>
          <span className="text-[10px] text-slate-400">Smart Server Routing</span>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
          {QUICK_MODES_CONFIG.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setMode(mode.id)}
                className={`min-w-[130px] p-2.5 rounded-xl border text-left shrink-0 transition-all duration-200 cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'bg-blue-600/10 dark:bg-blue-500/15 border-blue-500 shadow-sm'
                    : 'bg-white dark:bg-[#121A2B] border-slate-200 dark:border-white/6 hover:border-slate-300 dark:hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-[#1A2540] text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    {getModeIcon(mode.id)}
                  </div>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                    }`}
                  >
                    {mode.badge}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {mode.name}
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* KILL SWITCH CONFIRMATION MODAL */}
      {showKillSwitchConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#121A2B] border border-amber-500/30 p-5 shadow-2xl text-slate-900 dark:text-slate-100"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-3">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold mb-1">Kill Switch Active</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Disconnecting will cut off your device’s internet connection until reconnected or Kill Switch is disabled in settings.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancelKillSwitchDisconnect}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5"
              >
                Keep Protected
              </button>
              <button
                type="button"
                onClick={confirmDisconnectWithKillSwitch}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Disconnect
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
