/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowRight, Star, ExternalLink, X } from 'lucide-react';
import { useVPN } from '../../context/VPNContext.tsx';
import { MOCK_ADVERTISERS } from '../../data/mockAdvertisers.ts';
import { AD_LOAD_MS, ADMOB_TEST_IDS } from '../../data/adConfig.ts';
import { AdBadge } from './AdBadge.tsx';
import { AdSkeleton } from './AdSkeleton.tsx';

// ============================================================================
// AppOpenAd (Splash-Style App Resume Ad)
// // TODO: replace mock with real AdMob SDK call:
// // const appOpen = new AppOpenAd({
// //   adUnitId: ADMOB_TEST_IDS.appOpen,
// //   requestOptions: { requestNonPersonalizedAdsOnly: adConsent === 'non_personalized' }
// // });
// // await appOpen.load();
// // appOpen.show();
// ============================================================================

interface AppOpenAdProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppOpenAd: React.FC<AppOpenAdProps> = ({ isOpen, onClose }) => {
  const { addToast } = useVPN();
  const [canSkip, setCanSkip] = useState(false);
  const [loading, setLoading] = useState(true);
  const [advertiser] = useState(
    () => MOCK_ADVERTISERS[Math.floor(Math.random() * MOCK_ADVERTISERS.length)]
  );

  useEffect(() => {
    if (!isOpen) {
      setCanSkip(false);
      setLoading(true);
      return;
    }

    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, AD_LOAD_MS);

    // Skip button appears after 2 seconds
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 2000);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(skipTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCta = () => {
    addToast('Opening Sponsor App', `Redirecting to ${advertiser.name}…`, 'info');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 overflow-hidden flex flex-col justify-between bg-slate-950 p-6 select-none">
        {/* Splash App Brand Top Header */}
        <div className="flex items-center justify-between z-10 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">ShieldVPN</span>
              <p className="text-[10px] text-slate-400">Welcome Back</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AdBadge />
            {canSkip ? (
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold cursor-pointer active:scale-95 transition-all flex items-center gap-1"
                aria-label="Skip app open ad"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="text-xs text-slate-500 font-mono py-1 px-2.5 rounded-full bg-white/5">
                Ad • 2s
              </div>
            )}
          </div>
        </div>

        {/* Center Advertiser Creative */}
        {loading ? (
          <div className="my-auto">
            <AdSkeleton height="h-72" label="Loading App Open Sponsor…" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-auto flex flex-col items-center text-center p-4 rounded-3xl bg-slate-900/80 border border-white/8"
          >
            <div
              className={`w-20 h-20 rounded-2xl ${advertiser.iconBg} ${advertiser.iconColor} flex items-center justify-center font-bold text-2xl shadow-xl shadow-cyan-500/20 mb-4`}
            >
              {advertiser.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="inline-flex items-center gap-1 text-[11px] text-amber-400 mb-2 px-2 py-0.5 rounded-full bg-white/5">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-bold">{advertiser.rating}</span>
              <span className="text-slate-400">Top Rated</span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight mb-1">
              {advertiser.name}
            </h3>
            <p className="text-xs text-blue-400 font-medium mb-3">
              {advertiser.category}
            </p>

            <p className="text-sm font-semibold text-slate-200 mb-2">
              "{advertiser.headline}"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mb-5">
              {advertiser.description}
            </p>

            <button
              type="button"
              onClick={handleCta}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
            >
              <span>{advertiser.ctaText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center pb-2">
          <p className="text-[10px] text-slate-500">
            AdMob App Open Ad · Tap Continue above to skip to VPN
          </p>
        </div>
      </div>
    </AnimatePresence>
  );
};
