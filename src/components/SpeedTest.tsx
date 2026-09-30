/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  RotateCcw,
  Square,
  ArrowDown,
  ArrowUp,
  Activity,
  Zap,
  Clock,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Server,
  Wifi,
} from 'lucide-react';
import { useVPN } from '../context/VPNContext.tsx';
import { SpeedTestResult } from '../types/vpn.ts';
import { Speedometer } from './Speedometer.tsx';

// Initial realistic past history entries
const INITIAL_HISTORY: SpeedTestResult[] = [
  {
    id: 'st-hist-1',
    timestamp: 'Today, 2:45 PM',
    downloadSpeed: 148.4,
    uploadSpeed: 64.2,
    ping: 22,
    jitter: 3,
    loss: 0.0,
    serverName: 'Amsterdam 1',
    serverCountry: 'Netherlands',
    serverFlag: '🇳🇱',
    ip: '185.220.101.5',
    protocol: 'WireGuard',
    vpnConnected: true,
    rating: 'exceptional',
  },
  {
    id: 'st-hist-2',
    timestamp: 'Yesterday, 8:20 PM',
    downloadSpeed: 118.8,
    uploadSpeed: 52.6,
    ping: 35,
    jitter: 4,
    loss: 0.0,
    serverName: 'Frankfurt Central',
    serverCountry: 'Germany',
    serverFlag: '🇩🇪',
    ip: '194.26.29.112',
    protocol: 'WireGuard',
    vpnConnected: true,
    rating: 'exceptional',
  },
  {
    id: 'st-hist-3',
    timestamp: '2 days ago',
    downloadSpeed: 86.2,
    uploadSpeed: 38.0,
    ping: 58,
    jitter: 7,
    loss: 0.1,
    serverName: 'London Docklands',
    serverCountry: 'United Kingdom',
    serverFlag: '🇬🇧',
    ip: '185.125.190.4',
    protocol: 'OpenVPN UDP',
    vpnConnected: true,
    rating: 'great',
  },
];

export const SpeedTest: React.FC = () => {
  const {
    connectionStatus,
    selectedServer,
    selectedCity,
    settings,
    exposedIp,
    addToast,
  } = useVPN();

  const isConnected = connectionStatus === 'connected';

  // Test state machine
  const [phase, setPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Results for current run
  const [currentPing, setCurrentPing] = useState<number>(0);
  const [currentJitter, setCurrentJitter] = useState<number>(0);
  const [finalDl, setFinalDl] = useState<number>(0);
  const [finalUl, setFinalUl] = useState<number>(0);

  // History state
  const [history, setHistory] = useState<SpeedTestResult[]>(INITIAL_HISTORY);
  const [showHistory, setShowHistory] = useState(true);

  // Animation frame and timer references
  const animRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger tactile haptics if supported
  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignored
      }
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Cancel / Stop active test
  const stopTest = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase('idle');
    setCurrentSpeed(0);
    setProgress(0);
    triggerHaptic(30);
    addToast('Speed Test Cancelled', undefined, 'info');
  }, [addToast]);

  // Run Benchmark Sequence
  const startSpeedTest = useCallback(() => {
    if (phase !== 'idle' && phase !== 'complete') return;

    triggerHaptic([30, 40]);
    addToast('Starting Benchmark…', `Testing through ${selectedCity.name}, ${selectedServer.country}`, 'info');

    // Reset current values
    setPhase('ping');
    setProgress(0);
    setCurrentSpeed(0);

    const basePing = isConnected ? selectedCity.ping : 24;
    const targetPing = Math.max(12, Math.round(basePing + (Math.random() * 8 - 4)));
    const targetJitter = Math.max(2, Math.round(targetPing * 0.12 + Math.random() * 3));

    // Phase 1: PING (1.5 seconds)
    const pingStartTime = performance.now();
    const runPing = () => {
      const elapsed = performance.now() - pingStartTime;
      const pct = Math.min(100, (elapsed / 1500) * 100);
      setProgress(pct);

      // Random jittering needle preview
      const simPingVal = Math.round(targetPing * (0.8 + Math.random() * 0.4));
      setCurrentPing(simPingVal);
      setCurrentJitter(Math.max(1, Math.round(targetJitter + (Math.random() * 2 - 1))));

      if (elapsed < 1500) {
        animRef.current = requestAnimationFrame(runPing);
      } else {
        // Ping locked in
        setCurrentPing(targetPing);
        setCurrentJitter(targetJitter);
        triggerHaptic(25);

        // Move to DOWNLOAD
        setPhase('download');
        setProgress(0);

        // Compute realistic download target based on server ping & protocol
        // Fast servers (<35ms ping) get 140-210 Mbps; slower servers get 60-120 Mbps
        const baseDlTarget = Math.max(45, 185 - Math.round(targetPing * 0.7));
        const variance = (Math.random() - 0.5) * 35;
        const targetDl = Math.max(25, Math.round((baseDlTarget + variance) * 10) / 10);

        const dlStartTime = performance.now();
        const runDownload = () => {
          const dlElapsed = performance.now() - dlStartTime;
          const dlPct = Math.min(100, (dlElapsed / 3400) * 100);
          setProgress(dlPct);

          // Ease ramp with high frequency noise
          const progressRatio = dlElapsed / 3400;
          const ramp = Math.min(1, Math.sin((progressRatio * Math.PI) / 2));
          const noise = (Math.random() - 0.48) * 18 * (progressRatio > 0.4 ? 1 : progressRatio * 2);
          const liveDl = Math.max(5, Math.round((targetDl * ramp + noise) * 10) / 10);
          setCurrentSpeed(liveDl);

          if (dlElapsed < 3400) {
            animRef.current = requestAnimationFrame(runDownload);
          } else {
            // Download locked
            setFinalDl(targetDl);
            triggerHaptic(30);

            // Move to UPLOAD
            setPhase('upload');
            setProgress(0);
            setCurrentSpeed(0);

            // Target Upload (typically 35%-60% of DL)
            const targetUl = Math.max(12, Math.round((targetDl * 0.48 + (Math.random() * 12 - 6)) * 10) / 10);
            const ulStartTime = performance.now();

            const runUpload = () => {
              const ulElapsed = performance.now() - ulStartTime;
              const ulPct = Math.min(100, (ulElapsed / 2800) * 100);
              setProgress(ulPct);

              const ulProgressRatio = ulElapsed / 2800;
              const ulRamp = Math.min(1, Math.sin((ulProgressRatio * Math.PI) / 2));
              const ulNoise = (Math.random() - 0.5) * 8 * (ulProgressRatio > 0.4 ? 1 : ulProgressRatio * 2);
              const liveUl = Math.max(4, Math.round((targetUl * ulRamp + ulNoise) * 10) / 10);
              setCurrentSpeed(liveUl);

              if (ulElapsed < 2800) {
                animRef.current = requestAnimationFrame(runUpload);
              } else {
                // Completed!
                setFinalUl(targetUl);
                setPhase('complete');
                setProgress(100);
                triggerHaptic([40, 50, 40]);

                // Determine rating
                let rating: SpeedTestResult['rating'] = 'fair';
                if (targetDl >= 100) rating = 'exceptional';
                else if (targetDl >= 50) rating = 'great';
                else if (targetDl >= 25) rating = 'good';

                const newResult: SpeedTestResult = {
                  id: `st-${Date.now()}`,
                  timestamp: 'Just now',
                  downloadSpeed: targetDl,
                  uploadSpeed: targetUl,
                  ping: targetPing,
                  jitter: targetJitter,
                  loss: 0.0,
                  serverName: isConnected ? selectedCity.name : 'Direct Connection',
                  serverCountry: isConnected ? selectedServer.country : 'Local ISP',
                  serverFlag: isConnected ? selectedServer.flag : '🌐',
                  ip: isConnected ? selectedCity.ip : exposedIp,
                  protocol: isConnected ? (settings.protocol === 'wireguard' ? 'WireGuard' : 'OpenVPN') : 'Unencrypted',
                  vpnConnected: isConnected,
                  rating,
                };

                setHistory((prev) => [newResult, ...prev.slice(0, 19)]);
                addToast('Speed Test Complete', `${targetDl} Mbps DL · ${targetUl} Mbps UL`, 'success');
              }
            };

            animRef.current = requestAnimationFrame(runUpload);
          }
        };

        animRef.current = requestAnimationFrame(runDownload);
      }
    };

    animRef.current = requestAnimationFrame(runPing);
  }, [
    phase,
    isConnected,
    selectedCity,
    selectedServer,
    settings.protocol,
    exposedIp,
    addToast,
  ]);

  const clearHistory = () => {
    setHistory([]);
    addToast('Test History Cleared', undefined, 'info');
  };

  const getRatingBadge = (rating: SpeedTestResult['rating']) => {
    switch (rating) {
      case 'exceptional':
        return {
          label: 'Exceptional (4K HDR)',
          badge: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
        };
      case 'great':
        return {
          label: 'Great (Fast HD)',
          badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
        };
      case 'good':
        return {
          label: 'Good (Standard)',
          badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        };
      default:
        return {
          label: 'Fair (Basic)',
          badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        };
    }
  };

  const isTesting = phase === 'ping' || phase === 'download' || phase === 'upload';

  return (
    <div className="space-y-4">
      {/* Active Server Info Header Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl shrink-0">
            {isConnected ? selectedServer.flag : '🌐'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block">
                {isConnected ? `${selectedCity.name}, ${selectedServer.country}` : 'Local ISP (Unprotected)'}
              </span>
              {isConnected ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate">
              {isConnected ? `${selectedCity.ip} · ${settings.protocol}` : `${exposedIp} · Public Direct`}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 pl-2">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
            Server Ping
          </span>
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            ~{isConnected ? selectedCity.ping : 24} ms
          </span>
        </div>
      </div>

      {/* Speedometer Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-sm flex flex-col items-center relative overflow-hidden">
        {/* Animated Radial Gauge */}
        <Speedometer
          value={currentSpeed}
          maxValue={350}
          unit="Mbps"
          phase={phase}
          progress={progress}
          ping={currentPing}
          jitter={currentJitter}
        />

        {/* Live / Final Results 3-Col Metric Pills */}
        <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-white/6">
          {/* Download */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/3 text-center border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-cyan-500 dark:text-cyan-400 mb-0.5">
              <ArrowDown className="w-3 h-3" />
              <span>DOWNLOAD</span>
            </div>
            <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
              {phase === 'download'
                ? currentSpeed.toFixed(1)
                : phase === 'complete'
                ? finalDl.toFixed(1)
                : '--'}
            </div>
            <span className="text-[9px] text-slate-400 font-mono">Mbps</span>
          </div>

          {/* Upload */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/3 text-center border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-purple-500 dark:text-purple-400 mb-0.5">
              <ArrowUp className="w-3 h-3" />
              <span>UPLOAD</span>
            </div>
            <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
              {phase === 'upload'
                ? currentSpeed.toFixed(1)
                : phase === 'complete'
                ? finalUl.toFixed(1)
                : '--'}
            </div>
            <span className="text-[9px] text-slate-400 font-mono">Mbps</span>
          </div>

          {/* Ping */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/3 text-center border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-amber-500 dark:text-amber-400 mb-0.5">
              <Activity className="w-3 h-3" />
              <span>LATENCY</span>
            </div>
            <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
              {currentPing > 0 ? currentPing : '--'}
            </div>
            <span className="text-[9px] text-slate-400 font-mono">ms</span>
          </div>
        </div>

        {/* Quality Rating Banner (when completed) */}
        {phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 block leading-tight">
                  High Performance Connection
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Ideal for 4K streaming, lag-free gaming & fast downloads
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              GRADE A+
            </span>
          </motion.div>
        )}

        {/* Action Button: Start or Stop or Test Again */}
        <div className="w-full mt-4 flex items-center gap-2.5">
          {isTesting ? (
            <button
              type="button"
              onClick={stopTest}
              className="w-full py-3.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Cancel Speed Test</span>
            </button>
          ) : phase === 'complete' ? (
            <button
              type="button"
              onClick={startSpeedTest}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Run Speed Test Again</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startSpeedTest}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Speed Benchmark</span>
            </button>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Test History ({history.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                aria-label="Clear all speed test history"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="p-1 text-slate-400 hover:text-slate-200"
              aria-label="Toggle history view"
            >
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showHistory && (
          <div className="space-y-2">
            {history.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 text-center text-xs text-slate-400">
                <Activity className="w-6 h-6 mx-auto mb-1 text-slate-400 opacity-50" />
                No speed tests saved yet. Run your first benchmark above!
              </div>
            ) : (
              history.map((item) => {
                const ratingBadge = getRatingBadge(item.rating);
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl shrink-0">{item.serverFlag}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate block">
                            {item.serverName}, {item.serverCountry}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <span>{item.timestamp}</span>
                          <span>•</span>
                          <span>{item.protocol}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Download */}
                      <div className="text-right font-mono">
                        <div className="flex items-center justify-end gap-0.5 text-cyan-500 font-bold text-xs">
                          <ArrowDown className="w-2.5 h-2.5" />
                          <span>{item.downloadSpeed.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-end gap-0.5 text-purple-400 text-[10px]">
                          <ArrowUp className="w-2.5 h-2.5" />
                          <span>{item.uploadSpeed.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Ping pill */}
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-mono text-[10px] font-bold">
                        {item.ping}ms
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
