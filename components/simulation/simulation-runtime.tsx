"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { computeKpis } from "@/lib/derived";
import { randomGeoPoint } from "@/lib/fake-data";
import { sendNtfyNotification } from "@/lib/ntfy";
import {
  computeVirtualTime,
  maybeGenerateOrder,
  tickSessions,
  TICK_INTERVAL_MS,
} from "@/lib/simulation";
import { playSaleSound, unlockAudioOnFirstInteraction } from "@/lib/sound";
import { useDashboardStore } from "@/lib/store";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

const MILESTONE_THRESHOLDS = [25, 50, 75, 100];

/**
 * Motor de simulación global: no renderiza nada, se monta una única vez en el
 * layout raíz para que siga generando pedidos y actividad independientemente
 * de la pantalla en la que esté el usuario (dashboard, ajustes o productos).
 */
export function SimulationRuntime() {
  const hasHydrated = useDashboardStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    return unlockAudioOnFirstInteraction(useDashboardStore.getState().config.soundFile);
  }, [hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;

    const interval = setInterval(() => {
      let state = useDashboardStore.getState();
      if (!state.isRunning) return;

      const now = Date.now();
      const virtualTimeBeforeLoop = computeVirtualTime(state.config, state.simStartedAt, now);

      // En velocidades comprimidas (rápida/media/demo) la "jornada" no está
      // atada al reloj real, así que al terminar se reinicia sola para
      // encadenar un día nuevo en vez de quedarse parada esperando a que
      // alguien pulse "Reiniciar" — así la simulación sigue viva sin
      // importar cuándo se abra la página. En modo real sí se respeta el
      // horario configurado tal cual.
      if (virtualTimeBeforeLoop.hasFinished && state.config.speed !== "real") {
        state.resetDay();
        state.addActivity({
          id: crypto.randomUUID(),
          timestamp: now,
          type: "milestone",
          message: "Nueva jornada iniciada automáticamente",
        });
        state = useDashboardStore.getState();
      }

      const virtualTime = computeVirtualTime(state.config, state.simStartedAt, now);

      state.promoteOrderStatuses(now);

      const sessionsTick = tickSessions(state.currentSessions, state.sessionsToday);
      state.setCurrentSessions(sessionsTick.currentSessions);
      if (sessionsTick.gainedSession) {
        state.incrementSessionsToday();
        const geo = randomGeoPoint();
        state.addActivity({
          id: crypto.randomUUID(),
          timestamp: now,
          type: "session",
          message: `Nueva sesión desde ${geo.city}, ${geo.country}`,
        });
      }

      const order = maybeGenerateOrder(
        state.config,
        state.products,
        state.totals.ordersCount,
        virtualTime,
        state.simStartedAt,
        now
      );

      if (order) {
        state.addOrder(order);
        state.addActivity({
          id: crypto.randomUUID(),
          timestamp: now,
          type: "sale",
          message: `Pago recibido: ${order.productName} · ${order.amount.toFixed(2)} €`,
        });

        toast.success(`Nueva venta: ${order.productName}`, {
          description: `${order.customerName} · ${order.city} · ${order.amount.toFixed(2)} €`,
        });

        if (state.config.soundEnabled) {
          playSaleSound(state.config.soundFile).then((result) => {
            if (!result.ok) {
              toast.error(`No se pudo reproducir el sonido: ${result.error}`);
            }
          });
        }

        if (state.config.ntfyEnabled) {
          sendNtfyNotification(
            state.config.ntfyTopic,
            "Vision Commerce · Nueva venta",
            `Beneficio neto: ${formatCurrency(order.profit)} · ${order.productName}`
          ).then((result) => {
            if (!result.ok) {
              toast.error(`No se pudo avisar al móvil: ${result.error}`);
            }
          });
        }

        const freshState = useDashboardStore.getState();
        const kpis = computeKpis(freshState.totals, freshState.sessionsToday, state.config);

        for (const threshold of MILESTONE_THRESHOLDS) {
          if (kpis.revenueProgress >= threshold && !state.reachedMilestones.includes(threshold)) {
            state.markMilestone(threshold);
            state.addActivity({
              id: crypto.randomUUID(),
              timestamp: now,
              type: "milestone",
              message: `Objetivo de facturación alcanzado al ${threshold}%`,
            });
          }
        }
      }
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [hasHydrated]);

  return null;
}
