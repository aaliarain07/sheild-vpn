/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types/vpn.ts';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-50 pointer-events-none flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`pointer-events-auto p-3 rounded-2xl shadow-xl border backdrop-blur-md flex items-center justify-between gap-3 ${
                isSuccess
                  ? 'bg-slate-900/95 dark:bg-[#121A2B]/95 border-emerald-500/30 text-slate-100 shadow-emerald-500/10'
                  : isWarning
                  ? 'bg-slate-900/95 dark:bg-[#121A2B]/95 border-amber-500/30 text-slate-100 shadow-amber-500/10'
                  : 'bg-slate-900/95 dark:bg-[#121A2B]/95 border-blue-500/30 text-slate-100 shadow-blue-500/10'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="shrink-0">
                  {isSuccess ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {toast.title}
                  </p>
                  {toast.description && (
                    <p className="text-[11px] text-slate-300 truncate">
                      {toast.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 p-1 rounded-full text-slate-400 hover:text-white transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
