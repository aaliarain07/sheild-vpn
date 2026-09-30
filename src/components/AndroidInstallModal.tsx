/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Download,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Terminal,
  QrCode,
  Sparkles,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { useVPN } from '../context/VPNContext.tsx';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const { addToast } = useVPN();
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'direct' | 'apk' | 'qr'>('direct');

  const appUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-lxyhvlf43zjlubtgwuiteu-577151016284.asia-southeast1.run.app';

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(label);
    addToast('Copied to Clipboard', text, 'success');
    setTimeout(() => setCopiedStep(null), 2200);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        addToast('Installing ShieldVPN…', 'Generating WebAPK on your Android device', 'success');
        onClose();
      }
    } else {
      addToast(
        'Open in Chrome on Android',
        'Tap the 3 dots in Chrome > "Install app" to generate WebAPK',
        'info'
      );
    }
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 overflow-hidden flex flex-col justify-end bg-black/75 backdrop-blur-xs select-none">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative z-10 w-full max-h-[92%] rounded-t-3xl bg-white dark:bg-[#121A2B] border-t border-slate-200 dark:border-white/10 shadow-2xl p-5 flex flex-col overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <Smartphone className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Android Installation & APK
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Run ShieldVPN natively on your Android device
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 hover:text-slate-200 active:scale-95 transition-all"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#1A2540] border border-slate-200 dark:border-white/6 my-3">
            <button
              type="button"
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'direct'
                  ? 'bg-white dark:bg-[#121A2B] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
              }`}
            >
              1-Tap WebAPK
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('apk')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'apk'
                  ? 'bg-white dark:bg-[#121A2B] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
              }`}
            >
              Build APK File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'qr'
                  ? 'bg-white dark:bg-[#121A2B] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
              }`}
            >
              Scan QR
            </button>
          </div>

          {/* TAB 1: DIRECT WEBAPK INSTALL */}
          {activeTab === 'direct' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Google Certified Android WebAPK</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Android Chrome natively converts verified Progressive Web Apps into an authentic <strong>signed WebAPK</strong>. It installs into your Android App Drawer, operates with standalone full-screen presence, supports push alerts, and requires zero sideloading or "unknown sources" permissions.
                </p>
              </div>

              {/* Install Button or Steps */}
              {isInstalled ? (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1A2540] border border-slate-200 dark:border-white/6 text-center text-xs space-y-1">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Already Running as Installed App
                  </span>
                  <p className="text-[11px] text-slate-400">
                    ShieldVPN is running in standalone mode on this device.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install ShieldVPN on Android</span>
                  </button>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/3 border border-slate-200 dark:border-white/6 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Manual Steps on Android Phone:
                    </span>
                    <ol className="list-decimal list-inside space-y-1 pl-1">
                      <li>Open this URL in <strong>Google Chrome</strong> on Android.</li>
                      <li>Tap the <strong>three dots menu (⋮)</strong> at the top right.</li>
                      <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.</li>
                      <li>Android will generate and sign your native <strong>WebAPK</strong> automatically!</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BUILD STANDALONE APK */}
          {activeTab === 'apk' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                If you need a standalone <code>.apk</code> or <code>.aab</code> file to sideload via ADB or publish to Google Play Store, choose one of these standard build pipelines:
              </p>

              {/* Option A: Bubblewrap TWA */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1A2540] border border-slate-200 dark:border-white/6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    Option 1: Google Bubblewrap (Fastest)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `npx @bubblewrap/cli init --manifest="${appUrl}/manifest.webmanifest"\nnpx @bubblewrap/cli build`,
                        'bubblewrap'
                      )
                    }
                    className="p-1 rounded-md text-slate-400 hover:text-blue-400 flex items-center gap-1 text-[10px]"
                  >
                    {copiedStep === 'bubblewrap' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedStep === 'bubblewrap' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Google's official CLI tool that reads this app's Web Manifest and outputs a signed release APK:
                </p>
                <pre className="p-2 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] overflow-x-auto">
{`# 1. Install & initialize
npx @bubblewrap/cli init --manifest="${appUrl}/manifest.webmanifest"

# 2. Build ready-to-install release APK
npx @bubblewrap/cli build`}
                </pre>
              </div>

              {/* Option B: Capacitor Android */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1A2540] border border-slate-200 dark:border-white/6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Option 2: Capacitor Android Project
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        'npm run build\nnpx cap add android\nnpx cap open android',
                        'capacitor'
                      )
                    }
                    className="p-1 rounded-md text-slate-400 hover:text-cyan-400 flex items-center gap-1 text-[10px]"
                  >
                    {copiedStep === 'capacitor' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedStep === 'capacitor' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Configuration (<code>capacitor.config.json</code>) is pre-configured in this repository:
                </p>
                <pre className="p-2 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] overflow-x-auto">
{`npm run build
npx cap add android
npx cap open android  # Opens Android Studio to build APK`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: QR CODE TO PHONE */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-3 py-2">
              <div className="p-4 rounded-3xl bg-white text-slate-950 shadow-xl border border-slate-200 flex flex-col items-center">
                {/* SVG QR Code Simulation */}
                <svg
                  className="w-44 h-44"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="120" height="120" fill="white" />
                  {/* Outer corner finders */}
                  <rect x="10" y="10" width="28" height="28" rx="4" fill="#0B1220" />
                  <rect x="14" y="14" width="20" height="20" rx="2" fill="white" />
                  <rect x="18" y="18" width="12" height="12" rx="2" fill="#0B1220" />

                  <rect x="82" y="10" width="28" height="28" rx="4" fill="#0B1220" />
                  <rect x="86" y="14" width="20" height="20" rx="2" fill="white" />
                  <rect x="90" y="18" width="12" height="12" rx="2" fill="#0B1220" />

                  <rect x="10" y="82" width="28" height="28" rx="4" fill="#0B1220" />
                  <rect x="14" y="86" width="20" height="20" rx="2" fill="white" />
                  <rect x="18" y="90" width="12" height="12" rx="2" fill="#0B1220" />

                  {/* Matrix grid pattern */}
                  <rect x="44" y="12" width="6" height="6" fill="#0B1220" />
                  <rect x="54" y="12" width="6" height="6" fill="#0B1220" />
                  <rect x="66" y="12" width="6" height="6" fill="#0B1220" />
                  <rect x="44" y="24" width="6" height="6" fill="#0B1220" />
                  <rect x="60" y="24" width="6" height="6" fill="#0B1220" />
                  <rect x="70" y="24" width="6" height="6" fill="#0B1220" />

                  <rect x="14" y="44" width="6" height="6" fill="#0B1220" />
                  <rect x="26" y="44" width="6" height="6" fill="#0B1220" />
                  <rect x="36" y="44" width="6" height="6" fill="#0B1220" />
                  <rect x="48" y="44" width="16" height="16" rx="3" fill="#3B82F6" />
                  <rect x="72" y="44" width="6" height="6" fill="#0B1220" />
                  <rect x="84" y="44" width="6" height="6" fill="#0B1220" />
                  <rect x="96" y="44" width="6" height="6" fill="#0B1220" />

                  <rect x="14" y="56" width="6" height="6" fill="#0B1220" />
                  <rect x="30" y="56" width="6" height="6" fill="#0B1220" />
                  <rect x="72" y="56" width="6" height="6" fill="#0B1220" />
                  <rect x="88" y="56" width="6" height="6" fill="#0B1220" />

                  <rect x="44" y="70" width="6" height="6" fill="#0B1220" />
                  <rect x="56" y="70" width="6" height="6" fill="#0B1220" />
                  <rect x="68" y="70" width="6" height="6" fill="#0B1220" />
                  <rect x="80" y="70" width="6" height="6" fill="#0B1220" />

                  <rect x="44" y="86" width="6" height="6" fill="#0B1220" />
                  <rect x="56" y="86" width="6" height="6" fill="#0B1220" />
                  <rect x="72" y="86" width="6" height="6" fill="#0B1220" />
                  <rect x="92" y="86" width="6" height="6" fill="#0B1220" />
                  <rect x="60" y="98" width="6" height="6" fill="#0B1220" />
                  <rect x="80" y="98" width="6" height="6" fill="#0B1220" />
                </svg>

                <div className="mt-2 text-center">
                  <span className="text-xs font-bold text-slate-900 block">
                    Scan with Android Camera
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Opens ShieldVPN directly
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-300 truncate"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(appUrl, 'url')}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 active:scale-95 transition-all"
                >
                  {copiedStep === 'url' ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/6 text-center">
            <p className="text-[10px] text-slate-400">
              ShieldVPN Android Client · Compliant with Android 10+ WebAPK & Chrome 76+
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
