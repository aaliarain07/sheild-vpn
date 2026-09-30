/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { useVPN } from '../../context/VPNContext.tsx';
import { MOCK_ADVERTISERS } from '../../data/mockAdvertisers.ts';
import { INTERSTITIAL_SKIP_SECONDS, AD_LOAD_MS, ADMOB_TEST_IDS } from '../../data/adConfig.ts';
import { AdBadge } from './AdBadge.tsx';
import { AdSkeleton } from './AdSkeleton.tsx';

// ============================================================================
// InterstitialAd (Full-Screen Simulated AdMob Overlay)
// // TODO: replace mock with real AdMob SDK call:
// // const interstitial = new InterstitialAd({
// //   adUnitId: ADMOB_TEST_IDS.interstitial,
// //   requestOptions: { requestNonPersonalizedAdsOnly: adConsent === 'non_personalized' }
// // });
// // await interstitial.load();
// // await interstitial.show();
// ============================================================================

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ isOpen, onClose }) => {
  const { addToast } = useVPN();
  const [countdown, setCountdown] = useState(INTERSTITIAL_SKIP_SECONDS);
  const [loading, setLoading] = useState(true);
  const [advertiser] = useState(
    () => MOCK_ADVERTISERS[Math.floor(Math.random() * MOCK_ADVERTISERS.length)]
  );

  useEffect(() => {
    if (!isOpen) {
      setCountdown(INTERSTITIAL_SKIP_SECONDS);
      setLoading(true);
      return;
    }

    // 800ms initial network load
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, AD_LOAD_MS);

    return () => clearTimeout(loadTimer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || loading) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, loading, countdown]);

  if (!isOpen) return null;

  const handleCta = () => {
    addToast('Opening Sponsor Offer', `Redirecting to ${advertiser.name}…`, 'info');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 overflow-hidden flex flex-col bg-slate-950/95 backdrop-blur-md select-none">
        {/* Top Control Bar with 48px hit area close/countdown */}
        <div className="flex items-center justify-between p-4 z-10">
          <div className="flex items-center gap-2">
            <AdBadge />
            <span className="text-[11px] text-slate-400 font-mono">
              AdMob Interstitial
            </span>
          </div>

          <div className="flex items-center">
            {countdown > 0 ? (
              <div className="min-w-[48px] min-h-[48px] flex items-center justify-center px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-medium text-slate-300">
                Skip in {countdown}s
              </div>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="min-w-[48px] min-h-[48px] flex items-center justify-center p-2 rounded-full bg-white/15 hover:bg-white/25 text-white active:scale-90 transition-all cursor-pointer focus:outline-none"
                aria-label="Close advertisement"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Container */}
        {loading ? (
          <div className="flex-1 p-6 flex flex-col justify-center items-center">
            <AdSkeleton height="h-64" label="Loading Interstitial Ad…" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col justify-between p-6"
          >
            {/* Main Creative Card */}
            <div className="my-auto flex flex-col items-center text-center">
              {/* App Icon */}
              <div
                className={`w-24 h-24 rounded-3xl ${advertiser.iconBg} ${advertiser.iconColor} flex items-center justify-center font-bold text-3xl shadow-2xl shadow-blue-500/20 mb-5`}
              >
                {advertiser.name.slice(0, 2).toUpperCase()}
              </div>

              {/* Title & Tagline */}
              <h3 className="text-xl font-bold text-white tracking-tight mb-1">
                {advertiser.name}
              </h3>
              <p className="text-xs text-blue-400 font-medium mb-3">
                {advertiser.category}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 text-xs text-amber-400 mb-4 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{advertiser.rating}</span>
                <span className="text-slate-400">({advertiser.reviewsCount} reviews)</span>
              </div>

              {/* Big Headline */}
              <h4 className="text-base font-semibold text-slate-100 max-w-xs mb-2">
                "{advertiser.headline}"
              </h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                {advertiser.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCta}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>{advertiser.ctaText}</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-slate-500">
                Test ad by Google AdMob · ShieldVPN Partner
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
