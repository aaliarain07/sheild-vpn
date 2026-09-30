/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export type TabType = 'home' | 'locations' | 'stats' | 'settings';

export type ThemeMode = 'dark' | 'light' | 'system';

export type VpnProtocol = 'auto' | 'wireguard' | 'openvpn_udp' | 'openvpn_tcp';

export type QuickMode = 'streaming' | 'gaming' | 'wifi' | 'privacy';

export interface CityLocation {
  id: string;
  name: string;
  ping: number; // in ms
  load: number; // in percentage 0 - 100
  ip: string;
}

export interface ServerLocation {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  cities: CityLocation[];
  ping: number;
  load: number;
  mapX: number; // 0 to 100% on stylized map
  mapY: number; // 0 to 100% on stylized map
  ip: string;
  recommendedFor?: QuickMode[];
  premium?: boolean;
}

export interface SpeedDataPoint {
  time: string;
  download: number;
  upload: number;
}

export interface DailyUsage {
  day: string;
  gb: number;
}

export interface AppTunnelItem {
  id: string;
  name: string;
  category: 'Browser' | 'Social' | 'Gaming' | 'Streaming' | 'Utility';
  icon: string;
  tunneled: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface VpnSettings {
  autoConnectWifi: boolean;
  killSwitch: boolean;
  launchOnStartup: boolean;
  protocol: VpnProtocol;
  splitTunneling: boolean;
  customDns: 'automatic' | 'cloudflare' | 'quad9' | 'google';
  adTrackerBlocker: boolean;
  theme: ThemeMode;
}

export interface SpeedTestResult {
  id: string;
  timestamp: string;
  downloadSpeed: number; // in Mbps
  uploadSpeed: number; // in Mbps
  ping: number; // in ms
  jitter: number; // in ms
  loss: number; // in %
  serverName: string;
  serverCountry: string;
  serverFlag: string;
  ip: string;
  protocol: string;
  vpnConnected: boolean;
  rating: 'exceptional' | 'great' | 'good' | 'fair';
}
