/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Globe, BarChart3, Settings } from 'lucide-react';
import { TabType } from '../types/vpn.ts';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Home',
      icon: Shield,
    },
    {
      id: 'locations' as TabType,
      label: 'Locations',
      icon: Globe,
    },
    {
      id: 'stats' as TabType,
      label: 'Stats',
      icon: BarChart3,
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="shrink-0 h-16 w-full border-t border-slate-200/80 dark:border-white/6 bg-white/85 dark:bg-[#0B1220]/85 backdrop-blur-md px-3 z-30"
    >
      <div className="grid grid-cols-4 h-full items-center">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 cursor-pointer transition-colors group focus-visible:outline-none`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-active:scale-90 ${
                    isActive
                      ? 'text-blue-500 dark:text-blue-400 fill-blue-500/20 stroke-[2.3]'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 shadow-sm shadow-blue-500" />
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
