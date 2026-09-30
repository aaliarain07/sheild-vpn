/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Globe, Zap, ArrowRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { useVPN } from '../context/VPNContext.tsx';

export const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { setOnboardingDone } = useVPN();

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((s) => s + 1);
    } else {
      setOnboardingDone(true);
    }
  };

  const handleSkip = () => {
    setOnboardingDone(true);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-blue-600/15 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-cyan-500/10 filter blur-3xl pointer-events-none" />

      {/* Top Header with Skip */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">ShieldVPN</span>
        </div>

        {currentStep < 2 && (
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1 rounded-full bg-white/5 transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Main Slide Content */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              {/* Animated Shield Graphic */}
              <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping" />
                <div className="absolute inset-4 rounded-full border border-cyan-500/30 animate-pulse" />
                <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-600/20 to-cyan-500/10 border border-blue-500/40 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  <ShieldCheck className="w-16 h-16 text-cyan-400 stroke-[1.8]" />
                </div>
                <div className="absolute bottom-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-[11px] font-mono text-emerald-400 flex items-center gap-1 shadow-md">
                  <Lock className="w-3 h-3" />
                  AES-256-GCM
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                Browse privately
              </h2>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Cloak your real IP address and encrypt your internet traffic from ISPs, hackers, and public Wi-Fi snoopers.
              </p>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              {/* Animated Globe Graphic */}
              <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-blue-500/30 animate-spin-slow" />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-blue-900/40 to-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                  <Globe className="w-16 h-16 text-blue-400 stroke-[1.8]" />
                </div>
                {/* Floating location badges */}
                <div className="absolute -top-1 right-2 px-2 py-0.5 rounded-md bg-slate-900/90 border border-white/10 text-[10px] text-white flex items-center gap-1 shadow-md">
                  <span>🇺🇸</span> New York 28ms
                </div>
                <div className="absolute -bottom-1 left-2 px-2 py-0.5 rounded-md bg-slate-900/90 border border-white/10 text-[10px] text-white flex items-center gap-1 shadow-md">
                  <span>🇳🇱</span> Amsterdam 16ms
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                Fast servers worldwide
              </h2>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Servers in 20+ countries optimized for streaming and gaming with Fast WireGuard speeds.
              </p>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              {/* Connect Button Preview */}
              <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-b from-blue-500/20 to-cyan-500/20 border-2 border-emerald-400/80 flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/30">
                  <Zap className="w-12 h-12 text-emerald-400 mb-1" />
                  <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-widest">
                    Ready
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                One tap to protect
              </h2>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Connect instantly with a single touch. ShieldVPN automatically routes you through the fastest nearby node.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls: Dots & Action CTA */}
      <div className="relative z-10 flex flex-col items-center gap-5 pb-2">
        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStep === idx
                  ? 'w-7 bg-blue-500 shadow-sm shadow-blue-500/50'
                  : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {currentStep === 2 ? (
            <>
              <span>Get Started</span>
              <Sparkles className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
