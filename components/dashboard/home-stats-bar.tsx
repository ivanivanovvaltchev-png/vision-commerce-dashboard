"use client";

import { Button } from "@/components/ui/button";
import { Kpis } from "@/lib/derived";
import { speedLabel, VirtualTime } from "@/lib/simulation";
import { SimulationSpeed } from "@/lib/types";
import { Pause, Play, RotateCcw } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

type Stat = {
  key: string;
  label: string;
  value: string;
  live?: boolean;
};

type Props = {
  kpis: Kpis;
  sessionsToday: number;
  currentSessions: number;
  isRunning: boolean;
  speed: SimulationSpeed;
  startTime: string;
  endTime: string;
  virtualTime: VirtualTime;
  onToggleRunning: () => void;
  onReset: () => void;
};

function statusLabel(
  virtualTime: VirtualTime,
  speed: SimulationSpeed,
  startTime: string,
  endTime: string
): string {
  const isReal = speed === "real";
  if (virtualTime.hasFinished) {
    return isReal ? `Fuera de horario (cerró a las ${endTime})` : "Jornada finalizada";
  }
  if (!virtualTime.hasStarted) {
    return isReal ? `Fuera de horario (abre a las ${startTime})` : "Esperando inicio";
  }
  return "Simulación activa";
}

export function HomeStatsBar({
  kpis,
  sessionsToday,
  currentSessions,
  isRunning,
  speed,
  startTime,
  endTime,
  virtualTime,
  onToggleRunning,
  onReset,
}: Props) {
  const stats: Stat[] = [
    { key: "sessions", label: "Sesiones", value: sessionsToday.toLocaleString("es-ES") },
    { key: "revenue", label: "Ventas totales", value: formatCurrency(kpis.revenue) },
    { key: "profit", label: "Ganancias totales", value: formatCurrency(kpis.profit) },
    { key: "orders", label: "Pedidos", value: kpis.ordersCount.toLocaleString("es-ES") },
    { key: "conversion", label: "Tasa de conversión", value: `${kpis.conversionRate.toFixed(1)}%` },
    {
      key: "live",
      label: "Visitantes en vivo",
      value: currentSessions.toLocaleString("es-ES"),
      live: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-md bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
            Todos los canales
          </span>
          <span className="text-muted-foreground">
            {statusLabel(virtualTime, speed, startTime, endTime)} · Velocidad {speedLabel(speed)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onToggleRunning}>
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Pausar" : "Reanudar"}
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reiniciar jornada
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border bg-card px-4 py-4 sm:grid-cols-3 sm:px-5 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.key} className="flex min-w-0 flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {stat.label}
              {stat.live && (
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#0ca30c]" />
              )}
            </span>
            <span className="truncate text-lg font-semibold tabular-nums sm:text-xl">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
