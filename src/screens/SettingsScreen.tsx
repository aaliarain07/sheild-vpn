/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Crown,
  Wifi,
  ShieldAlert,
  Power,
  Cpu,
  Layers,
  Globe2,
  Ban,
  Sun,
  Moon,
  Smartphone,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  Star,
  FileText,
  Lock,
  LogOut,
  ExternalLink,
  Wrench,
  Play,
  Gift,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useVPN } from '../context/VPNContext.tsx';
import { Toggle } from '../components/Toggle.tsx';
import { VpnProtocol, ThemeMode } from '../types/vpn.ts';

export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSetting,
    setShowPremiumModal,
    setShowSplitTunnelModal,
    appsList,
    addToast,
    isPremium,
    setIsPremium,
    adConsent,
    setShowConsent,
    disconnectCount,
    resetDisconnectCount,
    setShowInterstitial,
    triggerRewardedAd,
    hasRewardedAccess,
    rewardedCountdownFormatted,
    grantRewardedAccess,
    revokeRewardedAccess,
    simulateAppReturn4h,
  } = useVPN();

  const [advancedExpanded, setAdvancedExpanded] = useState(false);

  const protocols: { id: VpnProtocol; name: string; tag: string }[] = [
    { id: 'auto', name: 'Automatic', tag: 'Recommended' },
    { id: 'wireguard', name: 'WireGuard', tag: 'Fast WireGuard speeds' },
    { id: 'openvpn_udp', name: 'OpenVPN (UDP)', tag: 'High Speed' },
    { id: 'openvpn_tcp', name: 'OpenVPN (TCP)', tag: 'Reliable' },
  ];

  const dnsOptions: { id: typeof settings.customDns; name: string; ip: string }[] = [
    { id: 'automatic', name: 'Shield Zero-Log DNS', ip: 'Default' },
    { id: 'cloudflare', name: 'Cloudflare 1.1.1.1', ip: '1.1.1.1' },
    { id: 'quad9', name: 'Quad9 Security', ip: '9.9.9.9' },
    { id: 'google', name: 'Google Public DNS', ip: '8.8.8.8' },
  ];

  const themes: { id: ThemeMode; name: string; icon: typeof Sun }[] = [
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'system', name: 'System', icon: Smartphone },
  ];

  const tunneledCount = appsList.filter((a) => a.tunneled).length;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-3 pb-8 flex flex-col space-y-4 select-none">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Preferences, security rules & account controls
        </p>
      </div>

      {/* 1. ACCOUNT CARD */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-blue-500/20">
              AR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Alex Robinson
                </h4>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  isPremium
                    ? 'bg-amber-500/15 text-amber-500'
                    : 'bg-blue-500/10 text-blue-500 dark:text-blue-400'
                }`}>
                  {isPremium ? 'Ultra Tier' : 'Free Tier'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                alex.robinson@example.com
              </p>
            </div>
          </div>
        </div>

        {/* Upgrade to Premium Button or Premium Active */}
        {isPremium ? (
          <div className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500/15 to-emerald-600/15 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 fill-current text-amber-400" />
              <span>Premium Active</span>
            </div>
            <span className="text-[11px] font-normal opacity-90">Unlimited Plan</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPremiumModal(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/15 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 fill-current" />
              <span>Upgrade to ShieldVPN Ultra</span>
            </div>
            <span className="text-[11px] underline">View Plans</span>
          </button>
        )}
      </div>

      {/* 2. CONNECTION SECTION */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          Connection & Tunnels
        </span>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs space-y-4">
          {/* Auto-connect on untrusted Wi-Fi */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  Auto-connect on Wi-Fi
                </span>
                <span className="text-[11px] text-slate-400">
                  Protect when connecting to untrusted networks
                </span>
              </div>
            </div>
            <Toggle
              checked={settings.autoConnectWifi}
              onChange={(val) => updateSetting('autoConnectWifi', val)}
              label="Auto-connect Wi-Fi"
            />
          </div>

          <div className="h-px bg-slate-100 dark:bg-white/6" />

          {/* Kill Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  Network Kill Switch
                </span>
                <span className="text-[11px] text-slate-400">
                  Blocks internet if the VPN disconnects abruptly
                </span>
              </div>
            </div>
            <Toggle
              checked={settings.killSwitch}
              onChange={(val) => updateSetting('killSwitch', val)}
              label="Kill Switch"
            />
          </div>

          <div className="h-px bg-slate-100 dark:bg-white/6" />

          {/* Launch on Startup */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center">
                <Power className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  Launch on Startup
                </span>
                <span className="text-[11px] text-slate-400">
                  Run ShieldVPN automatically on device boot
                </span>
              </div>
            </div>
            <Toggle
              checked={settings.launchOnStartup}
              onChange={(val) => updateSetting('launchOnStartup', val)}
              label="Launch on Startup"
            />
          </div>

          <div className="h-px bg-slate-100 dark:bg-white/6" />

          {/* Protocol Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                VPN Protocol
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {protocols.map((proto) => {
                const isSelected = settings.protocol === proto.id;
                return (
                  <button
                    key={proto.id}
                    type="button"
                    onClick={() => {
                      updateSetting('protocol', proto.id);
                      addToast('Protocol Changed', `Using ${proto.name}`, 'info');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-600/10 dark:bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'bg-slate-50 dark:bg-white/2 border-slate-200 dark:border-white/6 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-semibold">{proto.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {proto.tag}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRIVACY & SECURITY SECTION */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          Privacy & Security
        </span>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs space-y-4">
          {/* Split Tunneling */}
          <div
            onClick={() => setShowSplitTunnelModal(true)}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  Split Tunneling
                </span>
                <span className="text-[11px] text-slate-400">
                  {tunneledCount} of {appsList.length} apps routed via VPN
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-blue-500 font-medium">Manage</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-white/6" />

          {/* CyberSec Ad & Tracker Blocker */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Ban className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  Ad & Tracker Blocker
                </span>
                <span className="text-[11px] text-slate-400">
                  Filter phishing domains, popups, and trackers
                </span>
              </div>
            </div>
            <Toggle
              checked={settings.adTrackerBlocker}
              onChange={(val) => updateSetting('adTrackerBlocker', val)}
              label="Blocker toggle"
            />
          </div>

          <div className="h-px bg-slate-100 dark:bg-white/6" />

          {/* DNS Settings */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                DNS Leak Armor
              </span>
            </div>

            <div className="space-y-1.5">
              {dnsOptions.map((opt) => {
                const isSelected = settings.customDns === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      updateSetting('customDns', opt.id);
                      addToast('DNS Updated', opt.name, 'info');
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600/10 dark:bg-blue-500/15 border-blue-500'
                        : 'bg-slate-50 dark:bg-white/2 border-slate-200 dark:border-white/6 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-200">
                      {opt.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {opt.ip}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. APPEARANCE SECTION */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          Appearance
        </span>

        <div className="p-3 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs">
          <div className="grid grid-cols-3 gap-2">
            {themes.map((th) => {
              const Icon = th.icon;
              const isSelected = settings.theme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => updateSetting('theme', th.id)}
                  className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-blue-600/10 dark:bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'bg-slate-50 dark:bg-white/2 border-slate-200 dark:border-white/6 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-semibold">{th.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. EXPANDABLE ADVANCED SECTION */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={() => setAdvancedExpanded(!advancedExpanded)}
          className="w-full p-3 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs flex items-center justify-between text-left"
        >
          <div>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
              Advanced Network Diagnostics
            </span>
            <span className="text-[10px] text-slate-400">
              MTU size, port hopping, obfuscation
            </span>
          </div>
          {advancedExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {advancedExpanded && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1A2540] border border-slate-200 dark:border-white/6 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">
                WireGuard MTU
              </span>
              <span className="font-mono text-slate-400">1420 Bytes (Auto)</span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-white/6" />
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">
                Obfuscation Mode (Stealth)
              </span>
              <span className="text-emerald-500 font-medium">Bypass DPI Active</span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-white/6" />
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">
                IPv6 Leak Protection
              </span>
              <span className="text-emerald-500 font-medium">Blocked at Adapter</span>
            </div>
          </div>
        )}
      </div>

      {/* 6. SUPPORT & LEGAL */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          Support & Trust
        </span>

        <div className="p-3 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 shadow-xs space-y-1">
          {[
            {
              title: 'Help Center & Guides',
              icon: HelpCircle,
              action: () => addToast('Opening Knowledgebase', 'Navigating to 24/7 support articles', 'info'),
            },
            {
              title: '24/7 Live Support Chat',
              icon: MessageSquare,
              action: () => addToast('Connecting Support', 'Average response time: <2 mins', 'info'),
            },
            {
              title: 'Rate ShieldVPN',
              icon: Star,
              action: () => addToast('Thank you!', 'We appreciate your feedback.', 'success'),
            },
            {
              title: 'Privacy Policy',
              icon: Lock,
              action: () => addToast('Audited Policy', 'Independent audit by PwC verified no logs.', 'info'),
            },
            {
              title: 'Terms of Service',
              icon: FileText,
              action: () => addToast('Terms of Service', 'Standard consumer security license.', 'info'),
            },
            {
              title: 'Ad Privacy Preferences (UMP)',
              icon: ShieldCheck,
              action: () => setShowConsent(true),
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={item.action}
                className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {item.title}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. DEVELOPER / ADMOB CONTROLS */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wrench className="w-3 h-3 text-blue-400" />
            Developer / AdMob Controls
          </span>
          <span className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">
            TEST MODE
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121A2B] border border-blue-500/20 dark:border-blue-500/30 shadow-xs space-y-3.5">
          {/* Toggle Premium */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Crown className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  Simulate Premium User
                </span>
                <span className="text-[10px] text-slate-400">
                  {isPremium ? 'Ads completely disabled, all servers unlocked' : 'Free tier (ads enabled)'}
                </span>
              </div>
            </div>
            <Toggle
              checked={isPremium}
              onChange={(val) => {
                setIsPremium(val);
                addToast(
                  val ? 'Simulating Premium Tier' : 'Switched to Free Tier',
                  val ? 'All ads hidden & servers unlocked' : 'Ads active on free tier',
                  val ? 'success' : 'info'
                );
              }}
              label="Simulate Premium"
            />
          </div>

          <div className="h-px bg-slate-200 dark:bg-white/6" />

          {/* Disconnect Counter & Reset */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Disconnect Counter
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Count: {disconnectCount} (Next ad at {(Math.floor(disconnectCount / 3) + 1) * 3})
              </span>
            </div>
            <button
              type="button"
              onClick={resetDisconnectCount}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/8 hover:bg-slate-200 dark:hover:bg-white/12 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1 active:scale-95 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Counter</span>
            </button>
          </div>

          <div className="h-px bg-slate-200 dark:bg-white/6" />

          {/* Force Ad Triggers */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Force Show Ad Formats
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowInterstitial(true)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#1A2540] hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-200 dark:border-white/6"
              >
                <span>Interstitial Ad</span>
              </button>

              <button
                type="button"
                onClick={() => triggerRewardedAd('Developer Testing')}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#1A2540] hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-200 dark:border-white/6"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Rewarded Video</span>
              </button>
            </div>

            <button
              type="button"
              onClick={simulateAppReturn4h}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-[#1A2540] hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-200 dark:border-white/6"
            >
              <span>Simulate App Return after 4h (App Open Ad)</span>
            </button>
          </div>

          <div className="h-px bg-slate-200 dark:bg-white/6" />

          {/* Ad Consent State */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Google UMP Consent
              </span>
              <span className="text-[10px] text-slate-400 capitalize font-mono">
                Status: {adConsent}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowConsent(true)}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-semibold active:scale-95 transition-all"
            >
              Change Consent
            </button>
          </div>

          <div className="h-px bg-slate-200 dark:bg-white/6" />

          {/* 1-Hour Rewarded Server Pass */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                1-Hour Rewarded Pass
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {hasRewardedAccess
                  ? isPremium
                    ? 'Unlimited (Premium)'
                    : `Active (${rewardedCountdownFormatted || '60:00'})`
                  : 'Locked'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={grantRewardedAccess}
                className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 dark:text-emerald-400 text-xs font-semibold active:scale-95 transition-all"
              >
                Grant 1h
              </button>
              {hasRewardedAccess && !isPremium && (
                <button
                  type="button"
                  onClick={revokeRewardedAccess}
                  className="px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 dark:text-rose-400 text-xs font-semibold active:scale-95 transition-all"
                >
                  Revoke
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER & LOGOUT */}
      <div className="pt-2 pb-4 text-center space-y-3">
        <button
          type="button"
          onClick={() => addToast('Logged Out', 'Demo session ended safely', 'info')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log out</span>
        </button>

        <p className="text-[10px] text-slate-400">
          ShieldVPN Client v4.2.1 (Build 890) · WireGuard Core 1.0.20
        </p>
      </div>
    </div>
  );
};
