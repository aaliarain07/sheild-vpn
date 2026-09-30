/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ChevronDown, ChevronUp, Lock, Check } from 'lucide-react';
import { useVPN } from '../../context/VPNContext.tsx';

// ============================================================================
// ConsentDialog (Simulated Google UMP / GDPR / ePrivacy Consent Dialog)
// // TODO: replace mock with real Google UMP SDK call:
// // const consentInfo = await UserMessagingPlatform.requestConsentInfoUpdate();
// // if (consentInfo.isConsentFormAvailable) {
// //   await UserMessagingPlatform.loadAndShowConsentFormIfRequired();
// // }
// // When requesting ads later:
// // requestOptions: {
// //   requestNonPersonalizedAdsOnly: adConsent === 'non_personalized'
// // }
// ============================================================================

interface ConsentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsentDialog: React.FC<ConsentDialogProps> = ({ isOpen, onClose }) => {
  const { setAdConsent, addToast } = useVPN();
  const [showManage, setShowManage] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState<'personalized' | 'non_personalized'>('non_personalized');

  if (!isOpen) return null;

  const handleConsent = () => {
    // User agreed to standard ad personalization
    setAdConsent('personalized');
    addToast('Ad Preferences Saved', 'Personalized advertising enabled', 'info');
    onClose();
  };

  const handleDecline = () => {
    // User requested non-personalized contextual ads only
    // // In real AdMob: requestConfiguration.requestNonPersonalizedAdsOnly = true;
    setAdConsent('non_personalized');
    addToast('Ad Preferences Saved', 'Non-personalized ads selected', 'info');
    onClose();
  };

  const handleSaveManage = () => {
    setAdConsent(selectedPreference);
    addToast(
      'Ad Preferences Saved',
      selectedPreference === 'personalized' ? 'Personalized ads enabled' : 'Contextual non-personalized ads',
      'info'
    );
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 overflow-hidden flex flex-col justify-end bg-black/75 backdrop-blur-xs select-none">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative z-10 w-full max-h-[90%] rounded-t-3xl bg-white dark:bg-[#121A2B] border-t border-slate-200 dark:border-white/10 shadow-2xl p-5 flex flex-col overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                We use ads to keep ShieldVPN free
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Google User Messaging Platform (UMP)
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            ShieldVPN and our advertising partners use device identifiers and cookies to show non-intrusive ads that sponsor free high-speed bandwidth. Your private VPN tunnel traffic is never inspected or used for advertising.
          </p>

          {/* Manage Options Accordion */}
          {showManage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1A2540] border border-slate-200 dark:border-white/6 space-y-3">
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Choose Ad Experience
              </h4>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedPreference('personalized')}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    selectedPreference === 'personalized'
                      ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 font-medium'
                      : 'border-slate-200 dark:border-white/6 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-semibold block">Personalized Ads</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Tailored to your interests using advertising ID
                    </span>
                  </div>
                  {selectedPreference === 'personalized' && <Check className="w-4 h-4 text-blue-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPreference('non_personalized')}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    selectedPreference === 'non_personalized'
                      ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 font-medium'
                      : 'border-slate-200 dark:border-white/6 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-semibold block">Non-Personalized Ads</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Contextual ads only; no behavioral tracking
                    </span>
                  </div>
                  {selectedPreference === 'non_personalized' && <Check className="w-4 h-4 text-blue-500" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveManage}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleConsent}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              Consent
            </button>

            <button
              type="button"
              onClick={handleDecline}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-50 dark:hover:bg-white/5 active:scale-[0.98] transition-all"
            >
              Do not consent (non-personalized ads)
            </button>

            <button
              type="button"
              onClick={() => setShowManage(!showManage)}
              className="w-full py-1 text-center text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 transition-colors flex items-center justify-center gap-1"
            >
              <span>Manage options</span>
              {showManage ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
