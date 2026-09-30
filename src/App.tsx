/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VPNProvider, useVPN } from './context/VPNContext.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';
import { LocationsScreen } from './screens/LocationsScreen.tsx';
import { StatsScreen } from './screens/StatsScreen.tsx';
import { SettingsScreen } from './screens/SettingsScreen.tsx';
import { OnboardingScreen } from './screens/OnboardingScreen.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { ToastContainer } from './components/Toast.tsx';
import { PremiumModal } from './components/PremiumModal.tsx';
import { SplitTunnelModal } from './components/SplitTunnelModal.tsx';
import { BannerAd } from './components/ads/BannerAd.tsx';
import { InterstitialAd } from './components/ads/InterstitialAd.tsx';
import { RewardedAd } from './components/ads/RewardedAd.tsx';
import { AppOpenAd } from './components/ads/AppOpenAd.tsx';
import { ConsentDialog } from './components/ads/ConsentDialog.tsx';
import { AndroidInstallModal } from './components/AndroidInstallModal.tsx';

const AppContent: React.FC = () => {
  const {
    currentTab,
    setTab,
    onboardingDone,
    toasts,
    removeToast,
    showPremiumModal,
    setShowPremiumModal,
    showSplitTunnelModal,
    setShowSplitTunnelModal,
    showAndroidModal,
    setShowAndroidModal,
    resolvedTheme,
    canShowAds,
    showInterstitial,
    setShowInterstitial,
    showRewarded,
    closeRewardedAd,
    rewardedReason,
    showAppOpen,
    setShowAppOpen,
    showConsent,
    setShowConsent,
  } = useVPN();

  // Sync dark class on document element
  useEffect(() => {
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [resolvedTheme]);

  return (
    <div
      className={`min-h-[100dvh] w-full flex items-center justify-center p-0 sm:p-4 transition-colors duration-300 ${
        resolvedTheme === 'dark' ? 'bg-[#060A12]' : 'bg-slate-200'
      }`}
    >
      {/* Mobile-first phone container (max-width 420px, centered, full height) */}
      <div
        className={`w-full max-w-[420px] h-[100dvh] sm:h-[880px] sm:max-h-[94vh] sm:rounded-[36px] overflow-hidden flex flex-col relative shadow-2xl transition-colors duration-300 ${
          resolvedTheme === 'dark'
            ? 'bg-[#0B1220] text-slate-100 sm:border sm:border-slate-800/80 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
            : 'bg-[#F8FAFC] text-slate-900 sm:border sm:border-slate-300 sm:shadow-2xl'
        }`}
      >
        {/* Toast notifications anchored at top */}
        <ToastContainer toasts={toasts} onDismiss={removeToast} />

        {/* First launch onboarding or main view */}
        {!onboardingDone ? (
          <OnboardingScreen />
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Screen View Area with smooth page transitions */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <AnimatePresence mode="wait">
                {currentTab === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col h-full overflow-hidden"
                  >
                    <HomeScreen />
                  </motion.div>
                )}

                {currentTab === 'locations' && (
                  <motion.div
                    key="locations"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col h-full overflow-hidden"
                  >
                    <LocationsScreen />
                  </motion.div>
                )}

                {currentTab === 'stats' && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col h-full overflow-hidden"
                  >
                    <StatsScreen />
                  </motion.div>
                )}

                {currentTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col h-full overflow-hidden"
                  >
                    <SettingsScreen />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Adaptive Banner Ad (Home, Locations, Stats only) */}
            {canShowAds && (currentTab === 'home' || currentTab === 'locations' || currentTab === 'stats') && (
              <BannerAd />
            )}

            {/* Bottom Navigation */}
            <BottomNav currentTab={currentTab} onSelectTab={setTab} />

            {/* Modals */}
            <PremiumModal
              isOpen={showPremiumModal}
              onClose={() => setShowPremiumModal(false)}
            />

            <SplitTunnelModal
              isOpen={showSplitTunnelModal}
              onClose={() => setShowSplitTunnelModal(false)}
            />

            {/* AdMob Overlays & Consent Dialog */}
            <InterstitialAd
              isOpen={showInterstitial}
              onClose={() => setShowInterstitial(false)}
            />

            <RewardedAd
              isOpen={showRewarded}
              onClose={closeRewardedAd}
              reason={rewardedReason}
            />

            <AppOpenAd
              isOpen={showAppOpen}
              onClose={() => setShowAppOpen(false)}
            />

            <ConsentDialog
              isOpen={showConsent}
              onClose={() => setShowConsent(false)}
            />

            <AndroidInstallModal
              isOpen={showAndroidModal}
              onClose={() => setShowAndroidModal(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <VPNProvider>
      <AppContent />
    </VPNProvider>
  );
}
