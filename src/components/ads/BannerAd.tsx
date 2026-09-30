/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { useVPN } from '../../context/VPNContext.tsx';
import { MOCK_ADVERTISERS } from '../../data/mockAdvertisers.ts';
import { AD_LOAD_MS, AD_FAIL_RATE, ADMOB_TEST_IDS } from '../../data/adConfig.ts';
import { AdBadge } from './AdBadge.tsx';
import { AdSkeleton } from './AdSkeleton.tsx';

// ============================================================================
// BannerAd (320x50 Adaptive Banner)
// // TODO: replace mock with real AdMob SDK call:
// // const banner = new BannerAd({
// //   adUnitId: ADMOB_TEST_IDS.banner,
// //   adSize: BannerAdSize.ADAPTIVE_BANNER,
// //   requestOptions: { requestNonPersonalizedAdsOnly: adConsent === 'non_personalized' }
// // });
// // banner.show();
// ============================================================================

export const BannerAd: React.FC = () => {
  const { isPremium, adConsent, setShowPremiumModal, addToast } = useVPN();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [adIndex, setAdIndex] = useState(0);

  // If user is premium or consent not yet granted, show nothing
  const canShow = !isPremium && adConsent !== 'unknown' && adConsent !== 'declined';

  useEffect(() => {
    if (!canShow) return;

    setLoading(true);
    setFailed(false);

    // Simulate 800ms AdMob network load and 10% failure rate
    const timer = setTimeout(() => {
      const willFail = Math.random() < AD_FAIL_RATE;
      if (willFail) {
        setFailed(true);
      } else {
        // Pick a sponsor
        setAdIndex(Math.floor(Math.random() * MOCK_ADVERTISERS.length));
      }
      setLoading(false);
    }, AD_LOAD_MS);

    return () => clearTimeout(timer);
  }, [canShow]);

  if (!canShow || failed) {
    return null;
  }

  const advertiser = MOCK_ADVERTISERS[adIndex] || MOCK_ADVERTISERS[0];

  const handleAdClick = () => {
    addToast('Opening Sponsor Link', `Redirecting to ${advertiser.name}…`, 'info');
  };

  return (
    <div className="shrink-0 w-full px-3 py-1.5 bg-slate-100/90 dark:bg-[#0B1220]/90 backdrop-blur-md border-t border-slate-200/80 dark:border-white/6 select-none z-20">
      {loading ? (
        <AdSkeleton height="h-[50px]" label="Loading AdMob 320x50…" />
      ) : (
        <div className="relative h-[50px] w-full rounded-xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/8 px-2.5 flex items-center justify-between shadow-xs">
          {/* Ad content */}
          <button
            type="button"
            onClick={handleAdClick}
            className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer focus:outline-none"
          >
            <div
              className={`w-9 h-9 rounded-lg ${advertiser.iconBg} ${advertiser.iconColor} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
            >
              {advertiser.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1 pr-1">
              <div className="flex items-center gap-1.5">
                <AdBadge />
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {advertiser.name}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {advertiser.headline}
              </p>
            </div>
          </button>

          {/* Right action & remove ads text */}
          <div className="flex flex-col items-end shrink-0 pl-1">
            <button
              type="button"
              onClick={handleAdClick}
              className="px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
            >
              <span>{advertiser.ctaText}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowPremiumModal(true)}
              className="text-[9px] text-slate-400 hover:text-blue-500 transition-colors mt-0.5"
            >
              Remove ads
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
