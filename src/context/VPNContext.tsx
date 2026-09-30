/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  ConnectionStatus,
  ServerLocation,
  CityLocation,
  TabType,
  ThemeMode,
  VpnProtocol,
  QuickMode,
  ToastMessage,
  VpnSettings,
  SpeedDataPoint,
  AppTunnelItem,
} from '../types/vpn.ts';
import { MOCK_SERVERS, MOCK_APPS, QUICK_MODES_CONFIG } from '../data/mockData.ts';
import {
  INTERSTITIAL_EVERY_N_DISCONNECTS,
  INTERSTITIAL_COOLDOWN_MS,
  REWARD_DURATION_MS,
} from '../data/adConfig.ts';

export type AdConsent = 'unknown' | 'personalized' | 'non_personalized' | 'declined';

interface VPNContextType {
  connectionStatus: ConnectionStatus;
  selectedServer: ServerLocation;
  selectedCity: CityLocation;
  favorites: string[];
  selectedMode: QuickMode;
  settings: VpnSettings;
  sessionTimer: number;
  downloadSpeed: number;
  uploadSpeed: number;
  speedHistory: SpeedDataPoint[];
  dataUsedGb: number;
  trackersBlocked: number;
  adsBlocked: number;
  exposedIp: string;
  currentTab: TabType;
  toasts: ToastMessage[];
  onboardingDone: boolean;
  isPremium: boolean;
  showPremiumModal: boolean;
  showSplitTunnelModal: boolean;
  showKillSwitchConfirm: boolean;
  showAndroidModal: boolean;
  setShowAndroidModal: (show: boolean) => void;
  appsList: AppTunnelItem[];
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';

  // AdMob State & Controls
  adConsent: AdConsent;
  setAdConsent: (consent: AdConsent) => void;
  disconnectCount: number;
  lastInterstitialTime: number;
  rewardedUnlockExpiry: number | null;
  showInterstitial: boolean;
  setShowInterstitial: (show: boolean) => void;
  showRewarded: boolean;
  rewardedReason?: string;
  triggerRewardedAd: (reason?: string) => void;
  closeRewardedAd: () => void;
  showAppOpen: boolean;
  setShowAppOpen: (show: boolean) => void;
  showConsent: boolean;
  setShowConsent: (show: boolean) => void;
  canShowAds: boolean;
  hasRewardedAccess: boolean;
  rewardedCountdownFormatted: string | null;
  grantRewardedAccess: () => void;
  revokeRewardedAccess: () => void;
  recordDisconnect: () => void;
  resetDisconnectCount: () => void;
  simulateAppReturn4h: () => void;

  // Actions
  toggleConnection: () => void;
  confirmDisconnectWithKillSwitch: () => void;
  cancelKillSwitchDisconnect: () => void;
  selectServer: (server: ServerLocation, city?: CityLocation) => void;
  toggleFavorite: (serverId: string) => void;
  setMode: (mode: QuickMode) => void;
  updateSetting: <K extends keyof VpnSettings>(key: K, value: VpnSettings[K]) => void;
  setTab: (tab: TabType) => void;
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  setOnboardingDone: (done: boolean) => void;
  setIsPremium: (isPremium: boolean) => void;
  setShowPremiumModal: (show: boolean) => void;
  setShowSplitTunnelModal: (show: boolean) => void;
  toggleAppTunnel: (appId: string) => void;
}

const VPNContext = createContext<VPNContextType | undefined>(undefined);

export const VPNProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [selectedServer, setSelectedServer] = useState<ServerLocation>(MOCK_SERVERS[3]); // Netherlands by default (Fastest)
  const [selectedCity, setSelectedCity] = useState<CityLocation>(MOCK_SERVERS[3].cities[0]);
  const [favorites, setFavorites] = useState<string[]>(['us', 'gb', 'nl', 'jp', 'ch']);
  const [selectedMode, setSelectedMode] = useState<QuickMode>('streaming');

  // AdMob State
  const [adConsent, setAdConsent] = useState<AdConsent>('unknown');
  const [disconnectCount, setDisconnectCount] = useState<number>(0);
  const [lastInterstitialTime, setLastInterstitialTime] = useState<number>(0);
  const [rewardedUnlockExpiry, setRewardedUnlockExpiry] = useState<number | null>(null);
  const [showInterstitial, setShowInterstitial] = useState<boolean>(false);
  const [showRewarded, setShowRewarded] = useState<boolean>(false);
  const [rewardedReason, setRewardedReason] = useState<string | undefined>(undefined);
  const [showAppOpen, setShowAppOpen] = useState<boolean>(false);
  const [showConsent, setShowConsent] = useState<boolean>(false);

  const [settings, setSettings] = useState<VpnSettings>({
    autoConnectWifi: true,
    killSwitch: false,
    launchOnStartup: true,
    protocol: 'wireguard',
    splitTunneling: true,
    customDns: 'cloudflare',
    adTrackerBlocker: true,
    theme: 'dark',
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState<SpeedDataPoint[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      time: `${20 - i}s ago`,
      download: 0,
      upload: 0,
    }));
  });

  const [dataUsedGb, setDataUsedGb] = useState(1.42);
  const [trackersBlocked, setTrackersBlocked] = useState(842);
  const [adsBlocked, setAdsBlocked] = useState(1289);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSplitTunnelModal, setShowSplitTunnelModal] = useState(false);
  const [showKillSwitchConfirm, setShowKillSwitchConfirm] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [appsList, setAppsList] = useState<AppTunnelItem[]>(MOCK_APPS);

  const exposedIp = '98.142.204.81';

  // Haptic feedback helper
  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignored if browser permissions block vibration
      }
    }
  }, []);

  const addToast = useCallback((title: string, description?: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // AdMob Helpers & Calculations
  const canShowAds = !isPremium && adConsent !== 'unknown' && adConsent !== 'declined';
  const hasRewardedAccess = isPremium || (rewardedUnlockExpiry !== null && rewardedUnlockExpiry > Date.now());

  const [nowMs, setNowMs] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const rewardedCountdownFormatted = React.useMemo(() => {
    if (!rewardedUnlockExpiry || isPremium) return null;
    const diff = Math.max(0, rewardedUnlockExpiry - nowMs);
    const totalSecs = Math.floor(diff / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [rewardedUnlockExpiry, isPremium, nowMs]);

  // Rewarded access expiration watcher
  useEffect(() => {
    if (rewardedUnlockExpiry && Date.now() >= rewardedUnlockExpiry) {
      setRewardedUnlockExpiry(null);
      addToast('Rewarded Access Expired', 'Premium servers are now locked. Watch an ad to unlock.', 'warning');
    }
  }, [nowMs, rewardedUnlockExpiry, addToast]);

  // Trigger Consent Dialog once right after onboarding completes
  useEffect(() => {
    if (onboardingDone && adConsent === 'unknown' && !isPremium) {
      setShowConsent(true);
    }
  }, [onboardingDone, adConsent, isPremium]);

  // Grant 1 hour rewarded access
  const grantRewardedAccess = useCallback(() => {
    setRewardedUnlockExpiry(Date.now() + REWARD_DURATION_MS);
    addToast('Premium servers unlocked for 1 hour', 'Enjoy high-speed access to all global locations.', 'success');
  }, [addToast]);

  const revokeRewardedAccess = useCallback(() => {
    setRewardedUnlockExpiry(null);
    addToast('Rewarded Access Revoked', 'Premium servers are now locked', 'warning');
  }, [addToast]);

  const resetDisconnectCount = useCallback(() => {
    setDisconnectCount(0);
    addToast('Disconnect Counter Reset', 'Count reset to 0/3', 'info');
  }, [addToast]);

  const triggerRewardedAd = useCallback((reason?: string) => {
    setRewardedReason(reason);
    setShowRewarded(true);
  }, []);

  const closeRewardedAd = useCallback(() => {
    setShowRewarded(false);
    setRewardedReason(undefined);
  }, []);

  // Disconnect counter & Interstitial trigger
  const recordDisconnect = useCallback(() => {
    setDisconnectCount((prev) => {
      const nextCount = prev + 1;
      const canShow = !isPremium && adConsent !== 'unknown' && adConsent !== 'declined';
      const isAnyModal =
        showKillSwitchConfirm ||
        showPremiumModal ||
        showInterstitial ||
        showRewarded ||
        showAppOpen ||
        showConsent;

      const matchesFreq = nextCount % INTERSTITIAL_EVERY_N_DISCONNECTS === 0;
      const timeSinceLast = Date.now() - lastInterstitialTime;
      const cooldownPassed = timeSinceLast >= INTERSTITIAL_COOLDOWN_MS;

      if (canShow && !isAnyModal && matchesFreq && cooldownPassed) {
        setLastInterstitialTime(Date.now());
        // Show the ad about 600ms after the "VPN Disconnected" toast
        setTimeout(() => {
          setShowInterstitial(true);
        }, 600);
      }
      return nextCount;
    });
  }, [
    isPremium,
    adConsent,
    showKillSwitchConfirm,
    showPremiumModal,
    showInterstitial,
    showRewarded,
    showAppOpen,
    showConsent,
    lastInterstitialTime,
  ]);

  const simulateAppReturn4h = useCallback(() => {
    if (isPremium) {
      addToast('Premium Active', 'Premium users do not see App Open ads', 'info');
      return;
    }
    setShowAppOpen(true);
    addToast('Simulating App Return', '4+ hours away trigger activated', 'info');
  }, [isPremium, addToast]);

  // Resolved theme
  const [systemIsDark, setSystemIsDark] = useState(true);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const match = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemIsDark(match.matches);
      const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
      match.addEventListener('change', listener);
      return () => match.removeEventListener('change', listener);
    }
  }, []);

  const resolvedTheme: 'dark' | 'light' =
    settings.theme === 'system' ? (systemIsDark ? 'dark' : 'light') : settings.theme;

  // Live timer & data telemetry simulation
  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (connectionStatus === 'connected') {
      interval = setInterval(() => {
        setSessionTimer((t) => t + 1);

        // Realistic speed fluctuations based on server ping
        const baseDl = Math.max(30, 115 - Math.round(selectedCity.ping * 0.35));
        const varianceDl = (Math.random() - 0.45) * 22;
        const newDl = Math.max(12, Math.round((baseDl + varianceDl) * 10) / 10);

        const baseUl = Math.max(10, 38 - Math.round(selectedCity.ping * 0.12));
        const varianceUl = (Math.random() - 0.5) * 8;
        const newUl = Math.max(5, Math.round((baseUl + varianceUl) * 10) / 10);

        setDownloadSpeed(newDl);
        setUploadSpeed(newUl);

        // Update 60-second speed line history
        setSpeedHistory((prev) => {
          const nowStr = `${new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}`;
          const next = [...prev.slice(1), { time: nowStr, download: newDl, upload: newUl }];
          return next;
        });

        // Increment data used slightly
        setDataUsedGb((prev) => Math.round((prev + newDl / 8000) * 100) / 100);

        // Increment blocked stats randomly
        if (Math.random() > 0.6) {
          setTrackersBlocked((prev) => prev + 1);
        }
        if (Math.random() > 0.45) {
          setAdsBlocked((prev) => prev + 1);
        }
      }, 1000);
    } else {
      setDownloadSpeed(0);
      setUploadSpeed(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionStatus, selectedCity]);

  // Connect & Disconnect handlers
  const handleConnect = useCallback(() => {
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
    }

    // TODO: replace with native WireGuard connect call
    // nativeVpnPlugin.connect({ endpoint: selectedCity.ip, protocol: settings.protocol });
    setConnectionStatus('connecting');
    triggerHaptic([20, 25, 20]);
    addToast('Securing Tunnel…', `Connecting to ${selectedCity.name}, ${selectedServer.country}`, 'info');

    connectTimeoutRef.current = setTimeout(() => {
      setConnectionStatus('connected');
      triggerHaptic([40, 50, 40]);
      addToast('Protected & Encrypted', `Connected to ${selectedCity.name} · IP ${selectedCity.ip}`, 'success');
    }, 2500);
  }, [selectedCity, selectedServer, addToast, triggerHaptic]);

  const handleDisconnect = useCallback(() => {
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
    }

    // TODO: replace with native WireGuard disconnect call
    // nativeVpnPlugin.disconnect();
    setConnectionStatus('disconnected');
    setSessionTimer(0);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    triggerHaptic(25);
    addToast('VPN Disconnected', 'Your network connection is no longer encrypted', 'warning');
    recordDisconnect();
  }, [addToast, triggerHaptic, recordDisconnect]);

  const toggleConnection = useCallback(() => {
    if (connectionStatus === 'disconnected') {
      handleConnect();
    } else if (connectionStatus === 'connecting') {
      if (connectTimeoutRef.current) {
        clearTimeout(connectTimeoutRef.current);
      }
      setConnectionStatus('disconnected');
      triggerHaptic(20);
      addToast('Connection Cancelled', undefined, 'info');
    } else if (connectionStatus === 'connected') {
      // Check kill switch
      if (settings.killSwitch) {
        setShowKillSwitchConfirm(true);
      } else {
        handleDisconnect();
      }
    }
  }, [connectionStatus, settings.killSwitch, handleConnect, handleDisconnect, triggerHaptic, addToast]);

  const confirmDisconnectWithKillSwitch = useCallback(() => {
    setShowKillSwitchConfirm(false);
    handleDisconnect();
  }, [handleDisconnect]);

  const cancelKillSwitchDisconnect = useCallback(() => {
    setShowKillSwitchConfirm(false);
  }, []);

  const selectServer = useCallback(
    (server: ServerLocation, city?: CityLocation) => {
      const targetCity = city || server.cities[0];
      setSelectedServer(server);
      setSelectedCity(targetCity);

      if (connectionStatus === 'connected') {
        // Smooth seamless reconnect
        addToast('Reconnecting…', `Switching to ${targetCity.name}, ${server.country}`, 'info');
        setConnectionStatus('connecting');
        triggerHaptic([20, 20]);

        if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
        connectTimeoutRef.current = setTimeout(() => {
          setConnectionStatus('connected');
          triggerHaptic([35, 45]);
          addToast('Location Updated', `Connected to ${targetCity.name} (${server.flag})`, 'success');
        }, 1600);
      } else {
        addToast('Location Selected', `${targetCity.name}, ${server.country}`, 'info');
      }

      setCurrentTab('home');
    },
    [connectionStatus, addToast, triggerHaptic]
  );

  const toggleFavorite = useCallback(
    (serverId: string) => {
      const isFav = favorites.includes(serverId);
      const server = MOCK_SERVERS.find((s) => s.id === serverId);
      if (isFav) {
        setFavorites((prev) => prev.filter((id) => id !== serverId));
        addToast('Removed from Favorites', server?.country, 'info');
      } else {
        setFavorites((prev) => [...prev, serverId]);
        addToast('Added to Favorites ★', server?.country, 'success');
      }
    },
    [favorites, addToast]
  );

  const setMode = useCallback(
    (mode: QuickMode) => {
      setSelectedMode(mode);
      const conf = QUICK_MODES_CONFIG.find((m) => m.id === mode);
      if (conf) {
        const suggested = MOCK_SERVERS.find((s) => s.id === conf.suggestedServerId);
        if (suggested) {
          selectServer(suggested);
          addToast(`Switched to ${conf.name}`, `Optimized server: ${suggested.country}`, 'info');
        }
      }
    },
    [selectServer, addToast]
  );

  const updateSetting = useCallback(
    <K extends keyof VpnSettings>(key: K, value: VpnSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      if (key === 'killSwitch') {
        if (value) {
          addToast('Kill Switch Enabled', 'All internet traffic will be blocked if VPN drops', 'success');
        } else {
          addToast('Kill Switch Disabled', 'Internet will persist even if VPN drops', 'info');
        }
      }
    },
    [addToast]
  );

  const toggleAppTunnel = useCallback((appId: string) => {
    setAppsList((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, tunneled: !app.tunneled } : app))
    );
  }, []);

  return (
    <VPNContext.Provider
      value={{
        connectionStatus,
        selectedServer,
        selectedCity,
        favorites,
        selectedMode,
        settings,
        sessionTimer,
        downloadSpeed,
        uploadSpeed,
        speedHistory,
        dataUsedGb,
        trackersBlocked,
        adsBlocked,
        exposedIp,
        currentTab,
        toasts,
        onboardingDone,
        isPremium,
        showPremiumModal,
        showSplitTunnelModal,
        showKillSwitchConfirm,
        appsList,
        theme: settings.theme,
        resolvedTheme,
        adConsent,
        setAdConsent,
        disconnectCount,
        lastInterstitialTime,
        rewardedUnlockExpiry,
        showInterstitial,
        setShowInterstitial,
        showRewarded,
        rewardedReason,
        triggerRewardedAd,
        closeRewardedAd,
        showAppOpen,
        setShowAppOpen,
        showConsent,
        setShowConsent,
        canShowAds,
        hasRewardedAccess,
        rewardedCountdownFormatted,
        grantRewardedAccess,
        revokeRewardedAccess,
        recordDisconnect,
        resetDisconnectCount,
        simulateAppReturn4h,
        toggleConnection,
        confirmDisconnectWithKillSwitch,
        cancelKillSwitchDisconnect,
        selectServer,
        toggleFavorite,
        setMode,
        updateSetting,
        setTab: setCurrentTab,
        addToast,
        removeToast,
        setOnboardingDone,
        setIsPremium,
        setShowPremiumModal,
        setShowSplitTunnelModal,
        showAndroidModal,
        setShowAndroidModal,
        toggleAppTunnel,
      }}
    >
      {children}
    </VPNContext.Provider>
  );
};

export const useVPN = () => {
  const context = useContext(VPNContext);
  if (!context) {
    throw new Error('useVPN must be used within a VPNProvider');
  }
  return context;
};
