"use client";

import { useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3000";
const HIDE_DELAY_MS = 30000;

interface DonationAlertPayload {
  donator_name: string;
  amount_raw: number;
  message?: string | null;
}

export function DonationAlert() {
  const [alertData, setAlertData] = useState<DonationAlertPayload | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const socketOptions = useMemo(
    () => ({
      transports: ["websocket"],
      autoConnect: true,
      reconnectionAttempts: 5,
    }),
    []
  );

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, socketOptions);

    socket.on("newDonation", (payload: DonationAlertPayload) => {
      setAlertData(payload);
      setIsVisible(true);
    });

    return () => {
      socket.off("newDonation");
      socket.disconnect();
    };
  }, [socketOptions]);

  useEffect(() => {
    if (!isVisible || !alertData) {
      return;
    }

    const timer = window.setTimeout(() => setIsVisible(false), HIDE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [alertData, isVisible]);

  const formattedAmount = useMemo(() => {
    if (!alertData) return "";
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(alertData.amount_raw ?? 0);
  }, [alertData]);

  return (
    <AnimatePresence>
      {isVisible && alertData && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="pointer-events-none fixed bottom-6 left-6 z-50 w-[22rem] max-w-[calc(100vw-2rem)]"
        >
          <div
            className="pointer-events-auto rounded-3xl border border-amber-400/60 bg-zinc-950/80 p-5 text-white shadow-[0_25px_60px_rgba(0,0,0,0.55)] ring-1 ring-amber-200/40 backdrop-blur-sm"
            role="alert"
            aria-live="polite"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">NEW DONATION! ☕</p>
            <h3 className="mt-2 text-2xl font-black text-amber-50">
              {alertData.donator_name || "Seseorang baik hati"}
            </h3>
            <p className="mt-1 text-sm text-amber-200/80">{formattedAmount}</p>
            {alertData.message && (
              <p className="mt-3 rounded-2xl bg-white/5 px-4 py-3 text-sm italic text-zinc-200">
                “{alertData.message}”
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
