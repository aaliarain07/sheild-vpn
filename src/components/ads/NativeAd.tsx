/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { useVPN } from '../../context/VPNContext.tsx';
import { MOCK_ADVERTISERS } from '../../data/mockAdvertisers.ts';
import { AD_LOAD_MS, AD_FAIL_RATE, ADMOB_TEST_IDS } from '../../data/adConfig.ts';
import { AdBadge } from './AdBadge.tsx';
import { AdSkeleton } from './AdSkeleton.tsx';

// ============================================================================
// NativeAd (Styled to match server rows in Locations list)
// // TODO: replace mock with real AdMob SDK call:
// // const nativeAd = new NativeAdLoader({
// //   adUnitId: ADMOB_TEST_IDS.native,
// //   requestOptions: { requestNonPersonalizedAdsOnly: adConsent === 'non_personalized' }
// // });
// // nativeAd.load();
// ============================================================================

interface NativeAdProps {
  index?: number;
}

export const NativeAd: React.FC<NativeAdProps> = ({ index = 0 }) => {
  const { isPremium, adConsent, addToast } = useVPN();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const canShow = !isPremium && adConsent !== 'unknown' && adConsent !== 'declined';
  const advertiser = MOCK_ADVERTISERS[index % MOCK_ADVERTISERS.length] || MOCK_ADVERTISERS[0];

  useEffect(() => {
    if (!canShow) return;

    setLoading(true);
    setFailed(false);

    const timer = setTimeout(() => {
      const willFail = Math.random() < AD_FAIL_RATE;
      if (willFail) {
        setFailed(true);
      }
      setLoading(false);
    }, AD_LOAD_MS);

    return () => clearTimeout(timer);
  }, [canShow]);

  if (!canShow || failed) return null;

  if (loading) {
    return <AdSkeleton height="h-16" label="Loading Sponsored Ad…" className="my-1.5" />;
  }

  const handleClick = () => {
    addToast('Opening Sponsor App', `Redirecting to ${advertiser.name}…`, 'info');
  };

  return (
    <div
      onClick={handleClick}
      className="p-3 rounded-2xl border border-slate-200 dark:border-white/8 bg-gradient-to-r from-blue-500/5 via-slate-50 dark:via-[#141E33] to-cyan-500/5 hover:border-blue-500/40 cursor-pointer transition-all flex items-center justify-between shadow-xs select-none my-1.5"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl ${advertiser.iconBg} ${advertiser.iconColor} flex items-center justify-center font-bold text-sm shrink-0 shadow-xs`}
        >
          {advertiser.name.slice(0, 2).toUpperCase()}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate block">
              {advertiser.name}
            </span>
            <AdBadge />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
            {advertiser.headline}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1 active:scale-95 transition-transform"
        >
          <span>{advertiser.ctaText}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
