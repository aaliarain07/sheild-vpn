/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// Google AdMob Configuration
// Ad unit IDs: Google's official TEST IDs while USE_TEST_ADS = true.
// App ID: your real AdMob App ID (safe to use with test ad units).
// Set USE_TEST_ADS = false ONLY for the release build.
// Never tap your own live ads.
//
// Native init (Capacitor):
//   import { AdMob } from '@capacitor-community/admob';
//   await AdMob.initialize();
// ============================================================================

export const USE_TEST_ADS = true;

const APP_ID_ANDROID = 'ca-app-pub-7253187584075184~6112684957'; // real App ID

// Google's official sample ad unit IDs (safe to tap)
const TEST_UNITS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
  native: 'ca-app-pub-3940256099942544/2247696110',
  appOpen: 'ca-app-pub-3940256099942544/9257395921',
} as const;

// Your real ad unit IDs (release builds only)
const LIVE_UNITS = {
  banner: 'ca-app-pub-7253187584075184/9507995321',
  interstitial: 'ca-app-pub-7253187584075184/8745577992',
  rewarded: 'ca-app-pub-7253187584075184/2664394539',
  native: 'ca-app-pub-7253187584075184/5468763689',
  appOpen: 'ca-app-pub-7253187584075184/2173439945',
} as const;

export const ADMOB_IDS = {
  appIdAndroid: APP_ID_ANDROID,
  ...(USE_TEST_ADS ? TEST_UNITS : LIVE_UNITS),
} as const;

if (!USE_TEST_ADS && import.meta.env.DEV) {
  console.warn('[AdMob] Live ad units active in a dev build. Set USE_TEST_ADS = true.');
}

// Ad frequency capping, cooldowns, and timing rules
export const INTERSTITIAL_EVERY_N_DISCONNECTS = 3;
export const INTERSTITIAL_COOLDOWN_MS = 180000; // 3 minutes
export const REWARD_DURATION_MS = 3600000; // 1 hour (60 mins)
export const REWARDED_WATCH_SECONDS = 5;
export const INTERSTITIAL_SKIP_SECONDS = 5;
export const APP_OPEN_MIN_AWAY_MS = 14400000; // 4 hours
export const NATIVE_AD_EVERY_N_ROWS = 6;
export const AD_FAIL_RATE = 0.1; // 10% simulated load failure rate
export const AD_LOAD_MS = 800; // 800ms shimmer skeleton placeholder