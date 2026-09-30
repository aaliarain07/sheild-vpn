/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
  MapPin,
  List,
  Map as MapIcon,
  X,
  Sparkles,
  Server,
  Lock,
  Gift,
  Play,
  Crown,
} from 'lucide-react';
import { useVPN } from '../context/VPNContext.tsx';
import { MOCK_SERVERS } from '../data/mockData.ts';
import { ServerLocation, CityLocation } from '../types/vpn.ts';
import { WorldMap } from '../components/WorldMap.tsx';
import { NativeAd } from '../components/ads/NativeAd.tsx';
import { NATIVE_AD_EVERY_N_ROWS } from '../data/adConfig.ts';

export const LocationsScreen: React.FC = () => {
  const {
    selectedServer,
    selectedCity,
    connectionStatus,
    favorites,
    selectServer,
    toggleFavorite,
    isPremium,
    hasRewardedAccess,
    rewardedCountdownFormatted,
    triggerRewardedAd,
    setShowPremiumModal,
    canShowAds,
  } = useVPN();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [search, setSearch] = useState('');
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lockedServerModal, setLockedServerModal] = useState<{
    server: ServerLocation;
    city?: CityLocation;
  } | null>(null);

  const handleServerClick = (srv: ServerLocation, city?: CityLocation) => {
    // If premium server and user has neither premium nor active rewarded access
    if (srv.premium && !hasRewardedAccess) {
      setLockedServerModal({ server: srv, city });
      return;
    }
    selectServer(srv, city);
  };

  // Smooth skeleton loader on initial open (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filtered servers
  const filteredServers = useMemo(() => {
    return MOCK_SERVERS.filter((s) => {
      const q = search.toLowerCase();
      return (
        s.country.toLowerCase().includes(q) ||
        s.cities.some((c) => c.name.toLowerCase().includes(q))
      );
    });
  }, [search]);

  // Fastest server (lowest ping)
  const fastestServer = useMemo(() => {
    return [...MOCK_SERVERS].sort((a, b) => a.ping - b.ping)[0];
  }, []);

  // Favorites list
  const favoriteServers = useMemo(() => {
    return MOCK_SERVERS.filter((s) => favorites.includes(s.id));
  }, [favorites]);

  // Alphabetical grouped servers
  const alphabeticalGroups = useMemo(() => {
    const sorted = [...filteredServers].sort((a, b) =>
      a.country.localeCompare(b.country)
    );
    const groups: { [letter: string]: ServerLocation[] } = {};
    sorted.forEach((srv) => {
      const letter = srv.country[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(srv);
    });
    return groups;
  }, [filteredServers]);

  const getPingBadgeClass = (ping: number) => {
    if (ping < 50) return 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (ping < 120) return 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const handleToggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedCountryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-3 pb-6 flex flex-col select-none relative">
      {/* Rewarded Access Active Top Banner */}
      {hasRewardedAccess && !isPremium && rewardedCountdownFormatted && (
        <div className="mb-3 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-300 flex items-center justify-between text-xs shadow-md shadow-amber-500/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
              <Crown className="w-3.5 h-3.5 fill-current" />
            </div>
            <div>
              <span className="font-semibold block leading-tight">Premium Servers Unlocked</span>
              <span className="text-[10px] text-amber-700/80 dark:text-amber-200/80">Full high-speed WireGuard bandwidth</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 font-mono font-bold text-xs text-amber-500 dark:text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>{rewardedCountdownFormatted}</span>
          </div>
        </div>
      )}

      {/* Search Bar & View Mode Toggle */}
      <div className="space-y-3 mb-4 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Locations
          </h2>

          {/* List / Map Segmented Control */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#121A2B] border border-slate-200 dark:border-white/6">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-[#1A2540] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-[#1A2540] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country, city, or region…"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-100 dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* SKELETON LOADER */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800/60" />
          <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800/60" />
          <div className="h-14 rounded-2xl bg-slate-200 dark:bg-slate-800/60" />
          <div className="h-14 rounded-2xl bg-slate-200 dark:bg-slate-800/60" />
          <div className="h-14 rounded-2xl bg-slate-200 dark:bg-slate-800/60" />
        </div>
      ) : viewMode === 'map' ? (
        /* MAP VIEW */
        <div className="space-y-3">
          <WorldMap
            servers={filteredServers}
            selectedServer={selectedServer}
            status={connectionStatus}
            onSelectServer={(srv) => handleServerClick(srv)}
          />

          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#121A2B] border border-slate-200 dark:border-white/6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Selected Server Telemetry
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedServer.flag}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {selectedServer.country}
                    </span>
                    {selectedServer.premium && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-500 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        <Lock className="w-2.5 h-2.5" />
                        PRO
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedCity.name} · Load {selectedServer.load}%
                  </div>
                </div>
              </div>
              <span
                className={`text-xs font-mono font-medium px-2 py-0.5 rounded-md border ${getPingBadgeClass(
                  selectedServer.ping
                )}`}
              >
                {selectedServer.ping} ms
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-4">
          {/* 1. FASTEST LOCATION PINNED */}
          {!search && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                Fastest Recommendation
              </span>
              <div
                onClick={() => handleServerClick(fastestServer)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between shadow-xs ${
                  selectedServer.id === fastestServer.id
                    ? 'bg-blue-600/10 dark:bg-blue-500/15 border-blue-500'
                    : 'bg-white dark:bg-[#121A2B] border-slate-200 dark:border-white/6 hover:border-blue-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Fastest Location (Auto)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {fastestServer.flag} {fastestServer.country} · {fastestServer.cities[0].name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-medium px-2 py-0.5 rounded-md border ${getPingBadgeClass(
                      fastestServer.ping
                    )}`}
                  >
                    {fastestServer.ping} ms
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. FAVORITES SECTION */}
          {!search && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Favorites ({favoriteServers.length})
                </span>
              </div>

              {favoriteServers.length === 0 ? (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 text-center text-xs text-slate-400">
                  <Star className="w-5 h-5 mx-auto mb-1 text-slate-400 opacity-60" />
                  Tap the star on any location to pin your favorites
                </div>
              ) : (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {favoriteServers.map((srv) => {
                    const isSelected = selectedServer.id === srv.id;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => handleServerClick(srv)}
                        className={`min-w-[135px] p-2.5 rounded-xl border shrink-0 cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600/10 dark:bg-blue-500/15 border-blue-500'
                            : 'bg-white dark:bg-[#121A2B] border-slate-200 dark:border-white/6 hover:border-slate-300 dark:hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-xl shrink-0">{srv.flag}</span>
                          <div className="truncate">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {srv.country}
                              </span>
                              {srv.premium && (
                                <Lock className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {srv.ping} ms
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(srv.id);
                          }}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          aria-label={`Unfavorite ${srv.country}`}
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. ALL LOCATIONS GROUPED ALPHABETICALLY */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              All Locations ({filteredServers.length})
            </span>

            {filteredServers.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-slate-200 dark:border-white/6 text-center">
                <Server className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No servers found
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Try searching for another country or city.
                </p>
              </div>
            ) : (
              (() => {
                let globalIndex = 0;
                return Object.entries(alphabeticalGroups).map(([letter, servers]) => (
                  <div key={letter} className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-400 px-1">
                      {letter}
                    </div>

                    <div className="space-y-1.5">
                      {servers.map((srv) => {
                        const currentIndex = globalIndex++;
                        const showNativeAdHere =
                          canShowAds &&
                          currentIndex > 0 &&
                          currentIndex % NATIVE_AD_EVERY_N_ROWS === 0;

                        const isSelected = selectedServer.id === srv.id;
                        const isExpanded = expandedCountryId === srv.id;
                        const isFav = favorites.includes(srv.id);

                        return (
                          <React.Fragment key={srv.id}>
                            {showNativeAdHere && (
                              <NativeAd index={Math.floor(currentIndex / NATIVE_AD_EVERY_N_ROWS)} />
                            )}
                            <div
                              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                                isSelected
                                  ? 'bg-blue-600/5 dark:bg-blue-500/10 border-blue-500/60'
                                  : 'bg-white dark:bg-[#121A2B] border-slate-200 dark:border-white/6 hover:border-slate-300 dark:hover:border-white/15'
                              }`}
                            >
                          {/* Row Header */}
                          <div
                            onClick={() => handleServerClick(srv)}
                            className="p-3 flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-2xl shrink-0">{srv.flag}</span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate block">
                                    {srv.country}
                                  </span>
                                  {srv.premium && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-500 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                      <Lock className="w-2.5 h-2.5" />
                                      PRO
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  {srv.cities.length}{' '}
                                  {srv.cities.length > 1 ? 'locations' : 'location'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`text-xs font-mono font-medium px-2 py-0.5 rounded-md border ${getPingBadgeClass(
                                  srv.ping
                                )}`}
                              >
                                {srv.ping} ms
                              </span>

                              {/* Star favorite button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(srv.id);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition-colors"
                                aria-label={`Toggle favorite for ${srv.country}`}
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    isFav ? 'text-amber-400 fill-amber-400' : ''
                                  }`}
                                />
                              </button>

                              {/* Expand cities button */}
                              {srv.cities.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleExpand(e, srv.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                                  aria-label={`Expand cities in ${srv.country}`}
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Accordion Cities */}
                          {isExpanded && srv.cities.length > 1 && (
                            <div className="px-3 pb-3 pt-1 border-t border-slate-100 dark:border-white/6 space-y-1.5 bg-slate-50/50 dark:bg-white/2">
                              {srv.cities.map((city) => {
                                const isCitySelected =
                                  isSelected && selectedCity.id === city.id;
                                return (
                                  <div
                                    key={city.id}
                                    onClick={() => handleServerClick(srv, city)}
                                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                      isCitySelected
                                        ? 'bg-blue-600/10 border-blue-500'
                                        : 'bg-white dark:bg-[#121A2B] border-slate-200 dark:border-white/6 hover:border-slate-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                                        {city.name}
                                      </span>
                                      {srv.premium && (
                                        <Lock className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400" />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] text-slate-400">
                                        Load: {city.load}%
                                      </span>
                                      <span
                                        className={`text-[11px] font-mono font-medium px-1.5 py-0.5 rounded border ${getPingBadgeClass(
                                          city.ping
                                        )}`}
                                      >
                                        {city.ping} ms
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ));
          })())}
        </div>
      </div>
    )}

      {/* Locked Server Bottom Sheet / Modal */}
      {lockedServerModal && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="w-full rounded-t-3xl bg-white dark:bg-[#121A2B] border-t border-slate-200 dark:border-white/10 p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom duration-200">
            {/* Grab handle */}
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-white/20 mx-auto -mt-1 mb-2" />

            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{lockedServerModal.server.flag}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {lockedServerModal.server.country}
                    </h3>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-500 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      <Lock className="w-2.5 h-2.5" />
                      PRO SERVER
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lockedServerModal.city ? lockedServerModal.city.name : lockedServerModal.server.cities[0].name} · {lockedServerModal.server.ping} ms ping
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLockedServerModal(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This high-speed server is reserved for premium users. You can unlock all global PRO servers for 1 hour by watching a quick sponsored video, or upgrade to ShieldVPN Ultra for unlimited lifetime access.
            </p>

            {/* Option 1: Watch Video */}
            <button
              type="button"
              onClick={() => {
                setLockedServerModal(null);
                triggerRewardedAd('Unlock Premium Servers (1 Hour)');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-slate-950/20 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="text-left">
                  <span className="block leading-tight">Watch Short Video</span>
                  <span className="text-[10px] font-normal opacity-85">Free 1 hour unlock for all premium servers</span>
                </div>
              </div>
              <Gift className="w-4 h-4" />
            </button>

            {/* Option 2: Upgrade to Premium */}
            <button
              type="button"
              onClick={() => {
                setLockedServerModal(null);
                setShowPremiumModal(true);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-[#1A2540] hover:bg-slate-200 dark:hover:bg-[#202E4E] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 font-semibold text-xs active:scale-[0.98] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Upgrade to ShieldVPN Ultra</span>
              </div>
              <span className="text-[10px] text-blue-500 dark:text-blue-400 underline">View Plans</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
