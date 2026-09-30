/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Check, X, Shield, Zap, Sparkles } from 'lucide-react';
import { useVPN } from '../context/VPNContext.tsx';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly' | 'lifetime'>('yearly');
  const { addToast, setIsPremium } = useVPN();

  const handleSubscribe = () => {
    setIsPremium(true);
    onClose();
    addToast('Premium Activated!', 'Welcome to ShieldVPN Ultra with unlimited bandwidth.', 'success');
  };

  const handleRestore = () => {
    addToast('Restoring Purchases', 'Checking App Store / Play Store credentials…', 'info');
    setTimeout(() => {
      addToast('No Previous Purchases', 'Please select a plan to activate.', 'warning');
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-h-[92%] rounded-t-3xl bg-slate-900 dark:bg-[#0E1626] border-t border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden text-slate-100"
          >
            {/* Grab handle */}
            <div className="pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-slate-700" />
            </div>

            {/* Gradient Header */}
            <div className="relative px-6 pt-4 pb-5 bg-gradient-to-b from-blue-600/30 via-cyan-600/10 to-transparent flex flex-col items-center text-center">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                aria-label="Close premium modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3">
                <Crown className="w-7 h-7 fill-slate-950" />
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight">
                Unlock ShieldVPN Ultra
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mt-1">
                Fast WireGuard speeds, dedicated streaming nodes, and zero data limits.
              </p>
            </div>

            {/* Scrollable features & plans */}
            <div className="px-6 py-2 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              {/* Feature list */}
              <div className="space-y-2 py-1">
                {[
                  'Fast WireGuard speeds without throttling',
                  'Servers in 20+ countries',
                  'Built-in CyberSec Ad, malware & tracker blocking',
                  'Connect up to 10 devices simultaneously',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Plan Cards */}
              <div role="radiogroup" aria-label="Subscription plans" className="space-y-2.5 pt-2">
                {/* Yearly */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedPlan === 'yearly'}
                  onClick={() => setSelectedPlan('yearly')}
                  className={`w-full text-left p-3.5 rounded-2xl border cursor-pointer transition-all relative flex items-center justify-between focus:outline-none ${
                    selectedPlan === 'yearly'
                      ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-[#141E33] border-white/6 hover:border-white/15'
                  }`}
                >
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-bold tracking-wider uppercase shadow-sm">
                    Best Value -60%
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">12 Months</span>
                      <span className="text-[11px] text-emerald-400 font-medium">Save $96</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Billed $59.88 annually ($4.99 / mo)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-white">$4.99</span>
                    <span className="text-[11px] text-slate-400">/mo</span>
                  </div>
                </button>

                {/* Monthly */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedPlan === 'monthly'}
                  onClick={() => setSelectedPlan('monthly')}
                  className={`w-full text-left p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between focus:outline-none ${
                    selectedPlan === 'monthly'
                      ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-[#141E33] border-white/6 hover:border-white/15'
                  }`}
                >
                  <div>
                    <span className="text-sm font-bold text-white">1 Month</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Flexible monthly billing, cancel anytime
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-white">$12.99</span>
                    <span className="text-[11px] text-slate-400">/mo</span>
                  </div>
                </button>

                {/* Lifetime */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedPlan === 'lifetime'}
                  onClick={() => setSelectedPlan('lifetime')}
                  className={`w-full text-left p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between focus:outline-none ${
                    selectedPlan === 'lifetime'
                      ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-[#141E33] border-white/6 hover:border-white/15'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">Lifetime Pass</span>
                      <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded-md font-semibold">
                        Exclusive
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      One-time payment, all future updates included
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-white">$149</span>
                    <span className="text-[11px] text-slate-400"> once</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 border-t border-white/6 bg-slate-900/90 dark:bg-[#0B1220] flex flex-col gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleSubscribe}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Start 7-Day Free Trial
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleRestore}
                  className="hover:text-slate-200 transition-colors"
                >
                  Restore purchase
                </button>
                <span>30-Day Money-Back Guarantee</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
