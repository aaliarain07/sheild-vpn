/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useMemo } from 'react';
import { useVPN } from '../context/VPNContext.tsx';
import {
  INTERSTITIAL_EVERY_N_DISCONNECTS,
  INTERSTITIAL_COOLDOWN_MS,
  APP_OPEN_MIN_AWAY_MS,
  REWARD_DURATION_MS,
} from '../data/adConfig.ts';

// ============================================================================
// useAds Hook
// Centralized frequency capping, cooldown rules, and AdMob integration points.
//
// Native SDK Setup:
// // TODO: replace mock with real AdMob SDK initialization:
// // await MobileAds.initialize();
// // await UserMessagingPlatform.loadAndShowConsentFormIfRequired();
// ============================================================================

export const useAds = () => {
  const {
    isPremium,
    adConsent,
    disconnectCount,
    lastInterstitialTime,
    rewardedUnlockExpiry,
    showInterstitial,
    setShowInterstitial,
    showRewarded,
    triggerRewardedAd,
    closeRewardedAd,
    showAppOpen,
    setShowAppOpen,
    showConsent,
    setShowConsent,
    grantRewardedAccess,
    revokeRewardedAccess,
    recordDisconnect,
    resetDisconnectCount,
    setAdConsent,
    showKillSwitchConfirm,
    showPremiumModal,
    connectionStatus,
    addToast,
    setIsPremium,
  } = useVPN();

  // Rule: Premium users see NO ads. Ads also require user consent check completed.
  const canShowAds = useMemo(() => {
    return !isPremium && adConsent !== 'unknown';
  }, [isPremium, adConsent]);

  // Check if any modal / dialog or connecting state is active
  const isAnyModalOpen = useMemo(() => {
    return (
      showKillSwitchConfirm ||
      showPremiumModal ||
      showInterstitial ||
      showRewarded ||
      showAppOpen ||
      showConsent ||
      connectionStatus === 'connecting'
    );
  }, [
    showKillSwitchConfirm,
    showPremiumModal,
    showInterstitial,
    showRewarded,
    showAppOpen,
    showConsent,
    connectionStatus,
  ]);

  // Evaluates whether an interstitial ad is eligible to display
  // // TODO: in real AdMob, call: await InterstitialAd.load({ adUnitId }) before showing
  const shouldShowInterstitial = useCallback(
    (afterDisconnectCount: number): boolean => {
      if (!canShowAds) return false;
      if (isAnyModalOpen) return false;

      // Frequency cap: every N disconnects
      const matchesFrequency = afterDisconnectCount > 0 && afterDisconnectCount % INTERSTITIAL_EVERY_N_DISCONNECTS === 0;
      if (!matchesFrequency) return false;

      // Cooldown cap: at least 3 minutes between interstitials
      const timeSinceLast = Date.now() - lastInterstitialTime;
      if (timeSinceLast < INTERSTITIAL_COOLDOWN_MS) return false;

      return true;
    },
    [canShowAds, isAnyModalOpen, lastInterstitialTime]
  );

  // Rewarded server unlock check
  const hasRewardedAccess = useMemo(() => {
    if (isPremium) return true;
    return rewardedUnlockExpiry !== null && rewardedUnlockExpiry > Date.now();
  }, [isPremium, rewardedUnlockExpiry]);

  // Formatted countdown mm:ss for rewarded access
  const rewardedCountdownFormatted = useMemo(() => {
    if (!rewardedUnlockExpiry || isPremium) return null;
    const remainingMs = Math.max(0, rewardedUnlockExpiry - Date.now());
    const totalSecs = Math.floor(remainingMs / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [rewardedUnlockExpiry, isPremium]);

  // Trigger App Open Ad (e.g. user returns to app after 4+ hours)
  // // TODO: in real AdMob, call AppOpenAd.load({ adUnitId }) on resume
  const triggerAppOpenIfEligible = useCallback(
    (timeAwayMs: number = APP_OPEN_MIN_AWAY_MS) => {
      if (!canShowAds || isAnyModalOpen) return false;
      if (timeAwayMs >= APP_OPEN_MIN_AWAY_MS) {
        setShowAppOpen(true);
        return true;
      }
      return false;
    },
    [canShowAds, isAnyModalOpen, setShowAppOpen]
  );

  return {
    canShowAds,
    isAnyModalOpen,
    shouldShowInterstitial,
    hasRewardedAccess,
    rewardedCountdownFormatted,
    showInterstitial,
    setShowInterstitial,
    showRewarded,
    triggerRewardedAd,
    closeRewardedAd,
    showAppOpen,
    setShowAppOpen,
    showConsent,
    setShowConsent,
    grantRewardedAccess,
    revokeRewardedAccess,
    recordDisconnect,
    resetDisconnectCount,
    disconnectCount,
    adConsent,
    setAdConsent,
    triggerAppOpenIfEligible,
    setIsPremium,
  };
};
