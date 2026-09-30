/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Power, ShieldCheck, RefreshCw } from 'lucide-react';
import { ConnectionStatus } from '../types/vpn.ts';

interface PowerButtonProps {
  status: ConnectionStatus;
  onClick: () => void;
  sessionTimer: number;
}

const formatTimer = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const PowerButton: React.FC<PowerButtonProps> = ({
  status,
  onClick,
  sessionTimer,
}) => {
  const isDisconnected = status === 'disconnected';
  const isConnecting = status === 'connecting';
  const isConnected = status === 'connected';

  return (
    <div className="flex flex-col items-center justify-center my-4 relative">
      {/* Background radial ambient glow */}
      <div
        className={`absolute -inset-10 rounded-full transition-opacity duration-700 pointer-events-none filter blur-2xl ${
          isConnected
            ? 'bg-emerald-500/15 opacity-100'
            : isConnecting
            ? 'bg-blue-500/20 opacity-100'
            : 'bg-slate-500/5 opacity-40'
        }`}
      />

      {/* Ripple wave animations */}
      {isConnecting && (
        <>
          <div className="absolute w-44 h-44 rounded-full border border-cyan-400/40 animate-ripple pointer-events-none" />
          <div
            className="absolute w-44 h-44 rounded-full border border-blue-500/30 animate-ripple pointer-events-none"
            style={{ animationDelay: '0.8s' }}
          />
        </>
      )}

      {isConnected && (
        <div className="absolute w-48 h-48 rounded-full border border-emerald-500/25 animate-ripple pointer-events-none" />
      )}

      {/* Main button container */}
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
        className={`relative z-10 w-44 h-44 rounded-full flex flex-col items-center justify-center cursor-pointer transition-shadow duration-300 focus:outline-none select-none ${
          isDisconnected
            ? 'bg-slate-900/90 dark:bg-[#121A2B] border-2 border-slate-700/60 shadow-lg shadow-black/30 animate-breathe'
            : isConnecting
            ? 'bg-slate-900 dark:bg-[#101827] shadow-xl shadow-cyan-500/20'
            : 'bg-gradient-to-b from-[#132228] to-[#0F1B22] border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/25'
        }`}
        aria-label={
          isDisconnected
            ? 'Connect to VPN'
            : isConnecting
            ? 'Cancel connection'
            : 'Disconnect from VPN'
        }
      >
        {/* Rotating gradient ring during connecting */}
        {isConnecting && (
          <div className="absolute -inset-[3px] rounded-full overflow-hidden pointer-events-none">
            <div className="absolute -inset-[100%] animate-spin-slow bg-[conic-gradient(from_0deg,#06B6D4,#3B82F6,#06B6D4)] opacity-90" />
            <div className="absolute inset-[3px] rounded-full bg-slate-950 dark:bg-[#0B1220]" />
          </div>
        )}

        {/* Inner concentric ring */}
        <div
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            isDisconnected
              ? 'bg-slate-800/60 text-slate-400 border border-white/5'
              : isConnecting
              ? 'bg-slate-900/80 text-cyan-400 border border-cyan-500/30'
              : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40'
          }`}
        >
          <AnimatePresence mode="wait">
            {isDisconnected && (
              <motion.div
                key="power-off"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center"
              >
                <Power className="w-12 h-12 stroke-[2.2] text-slate-400 transition-colors" />
              </motion.div>
            )}

            {isConnecting && (
              <motion.div
                key="power-connecting"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center"
              >
                <RefreshCw className="w-11 h-11 text-cyan-400 animate-spin" />
              </motion.div>
            )}

            {isConnected && (
              <motion.div
                key="power-on"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.25, type: 'spring', bounce: 0.35 }}
                className="flex flex-col items-center justify-center"
              >
                <ShieldCheck className="w-13 h-13 stroke-[2.2] text-emerald-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Label beneath icon inside button */}
        <div className="relative z-10 mt-1">
          <span
            className={`text-[11px] font-semibold tracking-wider uppercase ${
              isDisconnected
                ? 'text-slate-400'
                : isConnecting
                ? 'text-cyan-400'
                : 'text-emerald-400'
            }`}
          >
            {isDisconnected ? 'Connect' : isConnecting ? 'Connecting' : 'Connected'}
          </span>
        </div>
      </motion.button>

      {/* Live Session Timer (HH:MM:SS) under centerpiece */}
      <div className="h-7 mt-3 flex items-center justify-center">
        {isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tabular-nums font-semibold tracking-wide"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{formatTimer(sessionTimer)}</span>
          </motion.div>
        ) : isConnecting ? (
          <span className="text-xs text-amber-400/90 font-medium animate-pulse">
            Establishing 256-bit handshake…
          </span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Tap to protect all network traffic
          </span>
        )}
      </div>
    </div>
  );
};
