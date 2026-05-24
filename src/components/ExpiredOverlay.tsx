/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { TimerOff, ShoppingCart } from 'lucide-react';

interface ExpiredOverlayProps {
  isOpen: boolean;
  onRefresh: () => void;
  message?: string;
  title?: string;
}

export default function ExpiredOverlay({ 
  isOpen, 
  onRefresh, 
  title = "Reservation Expired", 
  message = "The stock hold has timed out and items have been returned to the live inventory. Please restart your selection process." 
}: ExpiredOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#001c30]/75 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-8 text-center border-2 border-[#ba1a1a]"
          >
            {/* Warning Icon Badge */}
            <div className="w-20 h-20 bg-[#ffdad6] text-[#ba1a1a] rounded-full flex items-center justify-center mx-auto mb-6">
              <TimerOff className="w-10 h-10 animate-pulse" />
            </div>

            {/* Modal Message */}
            <h2 className="font-sans font-bold text-2xl text-[#0b1c30] mb-3">
              {title}
            </h2>
            <p className="text-sm text-[#464555] leading-relaxed mb-6">
              {message}
            </p>

            {/* Interactive control */}
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-2 bg-[#3525cd] hover:bg-[#4f46e5] text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all w-full justify-center active:scale-95 shadow-md cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              Return to Product List
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
