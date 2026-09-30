/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, CheckCircle2, Star, Sparkles, ExternalLink } from 'lucide-react';
import { useVPN } from '../../context/VPNContext.tsx';
import { MOCK_ADVERTISERS } from '../../data/mockAdvertisers.ts';
import { REWARDED_WATCH_SECONDS, AD_LOAD_MS, ADMOB_TEST_IDS } from '../../data/adConfig.ts';
import { AdBadge } from './AdBadge.tsx';
import { AdSkeleton } from './AdSkeleton.tsx';

// ============================================================================
// RewardedAd (Rewarded Video Ad with 5s watch required for 1hr server access)
// // TODO: replace mock with real AdMob SDK call:
// // const rewarded = new RewardedAd({
// //   adUnitId: ADMOB_TEST_IDS.rewarded,
// //   requestOptions: { requestNonPersonalizedAdsOnly: adConsent === 'non_personalized' }
// // });
// // await rewarded.load();
// // rewarded.show((rewardItem) => {
// //   grantRewardedAccess();
// // });
// ============================================================================

interface RewardedAdProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export const RewardedAd: React.FC<RewardedAdProps> = ({ isOpen, onClose, reason }) => {
  const { grantRewardedAccess, addToast } = useVPN();
  const [secondsLeft, setSecondsLeft] = useState(REWARDED_WATCH_SECONDS);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [advertiser] = useState(
    () => MOCK_ADVERTISERS[Math.floor(Math.random() * MOCK_ADVERTISERS.length)]
  );

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(REWARDED_WATCH_SECONDS);
      setCompleted(false);
      setLoading(true);
      return;
    }

    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, AD_LOAD_MS);

    return () => clearTimeout(loadTimer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || loading || completed) return;

    if (secondsLeft > 0) {
      const timer = setTimeout(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCompleted(true);
    }
  }, [isOpen, loading, secondsLeft, completed]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!completed) {
      addToast('Ad closed early, no reward earned', 'Watch the full 5 seconds to unlock premium servers', 'warning');
      onClose();
    } else {
      onClose();
    }
  };

  const handleClaim = () => {
    grantRewardedAccess();
    onClose();
  };

  const progressPercent = Math.min(100, Math.round(((REWARDED_WATCH_SECONDS - secondsLeft) / REWARDED_WATCH_SECONDS) * 100));

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 overflow-hidden flex flex-col bg-slate-950/98 backdrop-blur-md select-none">
        {/* Top Header with Progress and Close */}
        <div className="p-4 z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AdBadge />
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" />
                Rewarded Video
              </span>
            </div>

            {/* Close button with 48px hit area */}
            <button
              type="button"
              onClick={handleClose}
              className="min-w-[48px] min-h-[48px] flex items-center justify-center p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 active:scale-95 transition-all cursor-pointer focus:outline-none"
              aria-label="Close rewarded ad"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: 'linear', duration: 0.9 }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>
              {completed ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Reward Earned!
                </span>
              ) : (
                <span>Reward in {secondsLeft}s…</span>
              )}
            </span>
            <span>{reason || 'Unlock Premium Servers (1 Hour)'}</span>
          </div>
        </div>

        {/* Creative Section */}
        {loading ? (
          <div className="flex-1 p-6 flex flex-col justify-center items-center">
            <AdSkeleton height="h-64" label="Loading Rewarded Sponsor Video…" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-between p-6"
          >
            {/* Center Creative */}
            <div className="my-auto flex flex-col items-center text-center">
              <div
                className={`w-22 h-22 rounded-3xl ${advertiser.iconBg} ${advertiser.iconColor} flex items-center justify-center font-bold text-3xl shadow-xl shadow-cyan-500/20 mb-4`}
              >
                {advertiser.name.slice(0, 2).toUpperCase()}
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-1">
                {advertiser.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-3">
                {advertiser.category}
              </p>

              <div className="flex items-center gap-1 text-xs text-amber-400 mb-3 px-2.5 py-1 rounded-full bg-white/5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{advertiser.rating}</span>
                <span className="text-slate-400">({advertiser.reviewsCount})</span>
              </div>

              <h4 className="text-sm font-semibold text-slate-200 max-w-xs mb-2">
                {advertiser.headline}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                {advertiser.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-col gap-2.5">
              {completed ? (
                <button
                  type="button"
                  onClick={handleClaim}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Claim 1 Hour Free Access</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => addToast('Opening Sponsor Link', advertiser.name, 'info')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>{advertiser.ctaText}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              <p className="text-center text-[10px] text-slate-500">
                Rewarded test ad by Google AdMob · Complete watch to unlock
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
