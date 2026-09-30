/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Shield, ArrowLeft, Globe, Tv, Music, Gamepad2, Send, MessageSquare, PlayCircle, CreditCard, Share2, PhoneCall } from 'lucide-react';
import { useVPN } from '../context/VPNContext.tsx';
import { Toggle } from './Toggle.tsx';

interface SplitTunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SplitTunnelModal: React.FC<SplitTunnelModalProps> = ({ isOpen, onClose }) => {
  const { appsList, toggleAppTunnel } = useVPN();
  const [search, setSearch] = useState('');

  const filteredApps = appsList.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.category.toLowerCase().includes(search.toLowerCase())
  );

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'globe': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'tv': return <Tv className="w-5 h-5 text-rose-400" />;
      case 'music': return <Music className="w-5 h-5 text-emerald-400" />;
      case 'gamepad-2': return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'send': return <Send className="w-5 h-5 text-sky-400" />;
      case 'message-square': return <MessageSquare className="w-5 h-5 text-indigo-400" />;
      case 'play-circle': return <PlayCircle className="w-5 h-5 text-red-400" />;
      case 'credit-card': return <CreditCard className="w-5 h-5 text-amber-400" />;
      case 'share-2': return <Share2 className="w-5 h-5 text-blue-400" />;
      case 'phone-call': return <PhoneCall className="w-5 h-5 text-emerald-400" />;
      default: return <Shield className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 260 }}
          className="absolute inset-0 z-50 bg-white dark:bg-[#0B1220] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-slate-200 dark:border-white/6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 -ml-1 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                aria-label="Back to settings"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Split Tunneling
              </h3>
            </div>
            <span className="text-xs font-mono text-blue-500 font-medium">
              {appsList.filter((a) => a.tunneled).length} / {appsList.length} Active
            </span>
          </div>

          {/* Description banner */}
          <div className="p-4 bg-slate-50 dark:bg-[#121A2B] border-b border-slate-200 dark:border-white/6 shrink-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Select which applications route their traffic through the encrypted VPN tunnel. Disabled apps connect directly via your local ISP.
            </p>

            {/* Search Input */}
            <div className="relative mt-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search installed applications…"
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-[#1A2540] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Apps list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {filteredApps.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">No applications found matching "{search}"</p>
              </div>
            ) : (
              filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#1A2540] flex items-center justify-center shrink-0">
                      {getAppIcon(app.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {app.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {app.category} · {app.tunneled ? 'VPN Protected' : 'Direct ISP'}
                      </p>
                    </div>
                  </div>

                  <Toggle
                    checked={app.tunneled}
                    onChange={() => toggleAppTunnel(app.id)}
                    label={`Tunnel ${app.name}`}
                  />
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
