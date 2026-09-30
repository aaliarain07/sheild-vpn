/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import {
  ShieldCheck,
  Lock,
  Cpu,
  ShieldAlert,
  Globe2,
  HardDrive,
  Clock,
  Ban,
  EyeOff,
  Check,
  Minus,
  Activity,
  BarChart3,
  Zap,
  Play,
} from 'lucide-react';
import { useVPN } from '../context/VPNContext.tsx';
import { MOCK_WEEKLY_USAGE } from '../data/mockData.ts';
import { SpeedTest } from '../components/SpeedTest.tsx';

export const StatsScreen: React.FC = () => {
  const {
    connectionStatus,
    sessionTimer,
    dataUsedGb,
    trackersBlocked,
    adsBlocked,
    speedHistory,
    settings,
    selectedServer,
    selectedCity,
  } = useVPN();

  const isConnected = connectionStatus === 'connected';
  const [activeView, setActiveView] = useState<'overview' | 'speedtest'>('overview');

  // Format hours protected
  const hoursProtected = useMemo(() => {
    const totalHours = 14.5 + sessionTimer / 3600;
    return totalHours.toFixed(1);
  }, [sessionTimer]);

  const securityItems = [
    {
      name: 'Encryption Cipher',
      value: 'AES-256-GCM',
      active: true,
      icon: Lock,
    },
    {
      name: 'Tunnel Protocol',
      value: settings.protocol === 'wireguard' ? 'WireGuard' : 'OpenVPN UDP',
      active: true,
      icon: Cpu,
    },
    {
      name: 'Kill Switch',
      value: settings.killSwitch ? 'Active' : 'Standby',
      active: settings.killSwitch,
      icon: ShieldAlert,
    },
    {
      name: 'DNS Leak Shield',
      value: settings.customDns === 'cloudflare' ? 'Cloudflare 1.1.1.1' : 'Zero-Log DNS',
      active: true,
      icon: Globe2,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-3 pb-6 flex flex-col space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {activeView === 'speedtest' ? 'Speed Benchmark' : 'Your Protection'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeView === 'speedtest'
              ? 'Test real-time bandwidth & latency performance'
              : 'Real-time telemetry and privacy defense metrics'}
          </p>
        </div>

        {isConnected && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Segmented View Switcher */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shrink-0">
        <button
          type="button"
          onClick={() => setActiveView('overview')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeView === 'overview'
              ? 'bg-white dark:bg-[#1A2540] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Protection Metrics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('speedtest')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
            activeView === 'speedtest'
              ? 'bg-white dark:bg-[#1A2540] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Speed Test</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </button>
      </div>

      {activeView === 'speedtest' ? (
        <SpeedTest />
      ) : (
        <>
          {/* Quick Speed Test Launcher Card */}
          <div
            onClick={() => setActiveView('speedtest')}
            className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/25 flex items-center justify-between cursor-pointer hover:border-cyan-500/50 transition-all shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Speed Benchmark Tool</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-semibold">
                    NEW
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-300">
                  Measure real-time latency, download & upload speeds
                </p>
              </div>
            </div>
            <button
              type="button"
              className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
            >
              <span>Test</span>
              <Play className="w-3 h-3 fill-current" />
            </button>
          </div>

          {/* TRUST BADGE STRIP */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600/15 via-cyan-500/10 to-emerald-500/10 border border-blue-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isConnected ? 'Your IP is fully masked' : 'ShieldVPN Ready'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-300">
                  {isConnected
                    ? `Secured via ${selectedCity.name}, ${selectedServer.country}`
                    : 'Connect to encrypt traffic & block snoopers'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-semibold">
              100% PRIVATE
            </span>
          </div>

      {/* 2X2 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Data Used */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Data Transferred</span>
            <HardDrive className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {dataUsedGb.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">GB</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">High-speed tunnel</p>
        </div>

        {/* Time Protected */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Time Protected</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {hoursProtected}
            </span>
            <span className="text-xs text-slate-400 font-semibold">hrs</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Total session time</p>
        </div>

        {/* Trackers Blocked */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Trackers Neutralized</span>
            <EyeOff className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {trackersBlocked.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Third-party cookies</p>
        </div>

        {/* Ads Blocked */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Intrusive Ads Blocked</span>
            <Ban className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {adsBlocked.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Bandwidth saved</p>
        </div>
      </div>

      {/* REAL-TIME SPEED CHART (LAST 60 SECONDS) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Live Throughput (60s)
            </h3>
            <p className="text-[11px] text-slate-400">
              {isConnected
                ? 'Active WireGuard stream speeds'
                : 'Connect VPN to start live telemetry stream'}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> DL (Mbps)
            </span>
            <span className="flex items-center gap-1 text-blue-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> UL (Mbps)
            </span>
          </div>
        </div>

        <div className="h-40 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={speedHistory}
              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 9, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 'dataMax + 20']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '12px',
                  fontSize: '11px',
                }}
              />
              <Area
                type="monotone"
                dataKey="download"
                stroke="#06B6D4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#dlGrad)"
                name="Download"
              />
              <Area
                type="monotone"
                dataKey="upload"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#ulGrad)"
                name="Upload"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* WEEKLY USAGE BAR CHART */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Weekly Bandwidth Usage
            </h3>
            <p className="text-[11px] text-slate-400">Total data consumed Mon–Sun</p>
          </div>
          <span className="text-xs font-mono font-semibold text-blue-500">
            44.9 GB Total
          </span>
        </div>

        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MOCK_WEEKLY_USAGE}
              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(val) => [`${val} GB`, 'Usage']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '12px',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="gb" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECURITY STATUS CARD */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Security Specifications
        </h3>

        <div className="space-y-2">
          {securityItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {item.value}
                    </p>
                  </div>
                </div>

                <div>
                  {item.active ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                      <Minus className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  )}
</div>
);
};
