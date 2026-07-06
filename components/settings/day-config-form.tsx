"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { sendNtfyNotification } from "@/lib/ntfy";
import { useDashboardStore } from "@/lib/store";
import { DayConfig, ProfitMode, SimulationSpeed } from "@/lib/types";
import { RotateCcw, Smartphone } from "lucide-react";

export function DayConfigForm() {
  const hasHydrated = useDashboardStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return null;
  }

  return <DayConfigFormFields />;
}

function DayConfigFormFields() {
  // El store ya está hidratado cuando este componente monta, así que el valor
  // inicial de useState ya refleja la configuración persistida.
  const config = useDashboardStore((s) => s.config);
  const setConfig = useDashboardStore((s) => s.setConfig);
  const resetDay = useDashboardStore((s) => s.resetDay);

  const [draft, setDraft] = useState<DayConfig>(() => config);

  // Solo actualiza el borrador local (para campos de texto/número mientras se
  // escribe, sin guardar todavía).
  function update<K extends keyof DayConfig>(key: K, value: DayConfig[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  // Actualiza el borrador y lo guarda al instante en el store. Se usa en
  // interruptores/selects (cambios discretos) y al salir de un campo de texto,
  // para que lo que ves en pantalla sea siempre lo que usa el motor de
  // simulación en la próxima venta.
  function commit<K extends keyof DayConfig>(key: K, value: DayConfig[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setConfig({ [key]: value });
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuración del día</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Define los objetivos y el ritmo de la simulación de ventas. Los cambios se guardan
          al instante, no hace falta pulsar ningún botón de guardar.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Objetivos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="targetRevenue">Facturación objetivo del día (€)</Label>
            <Input
              id="targetRevenue"
              type="number"
              min={0}
              value={draft.targetRevenue}
              onChange={(e) => update("targetRevenue", Number(e.target.value))}
              onBlur={(e) => commit("targetRevenue", Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="targetOrders">Número objetivo de pedidos</Label>
            <Input
              id="targetOrders"
              type="number"
              min={0}
              value={draft.targetOrders}
              onChange={(e) => update("targetOrders", Number(e.target.value))}
              onBlur={(e) => commit("targetOrders", Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profitMode">Definir beneficio como</Label>
            <Select
              value={draft.profitMode}
              onValueChange={(value) => commit("profitMode", value as ProfitMode)}
            >
              <SelectTrigger id="profitMode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="margin">Margen (%)</SelectItem>
                <SelectItem value="amount">Importe objetivo (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {draft.profitMode === "margin" ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="targetMargin">Margen objetivo (%)</Label>
              <Input
                id="targetMargin"
                type="number"
                min={0}
                max={100}
                value={draft.targetMargin}
                onChange={(e) => update("targetMargin", Number(e.target.value))}
                onBlur={(e) => commit("targetMargin", Number(e.target.value))}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="targetProfitAmount">Beneficio objetivo (€)</Label>
              <Input
                id="targetProfitAmount"
                type="number"
                min={0}
                value={draft.targetProfitAmount}
                onChange={(e) => update("targetProfitAmount", Number(e.target.value))}
                onBlur={(e) => commit("targetProfitAmount", Number(e.target.value))}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="avgTicket">Ticket medio aproximado (€)</Label>
            <Input
              id="avgTicket"
              type="number"
              min={0}
              value={draft.avgTicket}
              onChange={(e) => update("avgTicket", Number(e.target.value))}
              onBlur={(e) => commit("avgTicket", Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ventana y velocidad de simulación</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="startTime">Hora de inicio</Label>
            <Input
              id="startTime"
              type="time"
              value={draft.startTime}
              onChange={(e) => update("startTime", e.target.value)}
              onBlur={(e) => commit("startTime", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="endTime">Hora de fin</Label>
            <Input
              id="endTime"
              type="time"
              value={draft.endTime}
              onChange={(e) => update("endTime", e.target.value)}
              onBlur={(e) => commit("endTime", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Si pones una hora igual o anterior a la de inicio (ej. 00:00), se entiende que
              la jornada cruza la medianoche.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="speed">Velocidad de simulación</Label>
            <Select
              value={draft.speed}
              onValueChange={(value) => commit("speed", value as SimulationSpeed)}
            >
              <SelectTrigger id="speed">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real">Real — sincronizada con el reloj del día</SelectItem>
                <SelectItem value="medium">Media — la jornada dura ~45 min reales</SelectItem>
                <SelectItem value="fast">Rápida — la jornada dura ~10 min reales</SelectItem>
                <SelectItem value="demo">Demo — la jornada dura ~2 min reales</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sonido de venta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="soundEnabled">Reproducir sonido al entrar una venta</Label>
            <Switch
              id="soundEnabled"
              checked={draft.soundEnabled}
              onCheckedChange={(checked) => commit("soundEnabled", checked)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="soundFile">Archivo de sonido (en public/sounds/)</Label>
            <Input
              id="soundFile"
              value={draft.soundFile}
              onChange={(e) => update("soundFile", e.target.value)}
              onBlur={(e) => commit("soundFile", e.target.value)}
              placeholder="ka-ching.mp3"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Notificaciones push (móvil)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ntfyEnabled">Avisar al móvil en cada venta</Label>
              <p className="text-xs text-muted-foreground">
                Vía ntfy.sh — instala la app &ldquo;ntfy&rdquo; en tu móvil y suscríbete a tu topic.
              </p>
            </div>
            <Switch
              id="ntfyEnabled"
              checked={draft.ntfyEnabled}
              onCheckedChange={(checked) => commit("ntfyEnabled", checked)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ntfyTopic">Topic de ntfy.sh</Label>
            <Input
              id="ntfyTopic"
              value={draft.ntfyTopic}
              onChange={(e) => update("ntfyTopic", e.target.value)}
              onBlur={(e) => commit("ntfyTopic", e.target.value)}
              placeholder="ej. vc-ventas-8f3k2p"
            />
            <p className="text-xs text-muted-foreground">
              ntfy.sh es público: cualquiera que sepa el nombre exacto de tu topic puede
              suscribirse. Usa algo largo y no adivinable, no algo genérico.
            </p>
          </div>
          <TestNotificationButton
            topic={draft.ntfyTopic}
            onBeforeSend={() => commit("ntfyTopic", draft.ntfyTopic)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reiniciar simulación</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Pone a cero pedidos, facturación, beneficio, sesiones y actividad para empezar el
            día desde el principio. No borra tu configuración ni el catálogo de productos.
          </p>
          <ResetButton onConfirm={resetDay} />
        </CardContent>
      </Card>
    </div>
  );
}

function TestNotificationButton({
  topic,
  onBeforeSend,
}: {
  topic: string;
  onBeforeSend: () => void;
}) {
  const [sending, setSending] = useState(false);

  async function handleClick() {
    if (!topic.trim()) {
      toast.error("Escribe primero un topic de ntfy.sh");
      return;
    }
    onBeforeSend();
    setSending(true);
    const result = await sendNtfyNotification(
      topic,
      "Vision Commerce · Prueba",
      "Beneficio neto: 13,48 € · Notificación de prueba"
    );
    setSending(false);
    if (result.ok) {
      toast.success("Notificación de prueba enviada y topic guardado");
    } else {
      toast.error(`Fallo al enviar: ${result.error}`);
    }
  }

  return (
    <Button variant="outline" size="sm" className="w-fit" onClick={handleClick} disabled={sending}>
      {sending ? "Enviando..." : "Enviar notificación de prueba"}
    </Button>
  );
}

function ResetButton({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    onConfirm();
    setOpen(false);
    toast.success("Todos los valores se han reiniciado a cero");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" className="w-fit">
            <RotateCcw className="h-4 w-4" />
            Reiniciar todos los valores a cero
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Reiniciar la simulación?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Se eliminarán todos los pedidos, la actividad y las sesiones generados hasta ahora.
          Esta acción no se puede deshacer.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Sí, reiniciar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
