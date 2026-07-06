"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { estimateAverageProfit } from "@/lib/simulation";
import { Product } from "@/lib/types";

type Draft = Omit<Product, "id">;

const EMPTY_DRAFT: Draft = { name: "", price: 0, cost: 0, probability: 50 };

type Props = {
  product?: Product;
  onSubmit: (draft: Draft) => void;
  trigger: React.ReactElement;
};

export function ProductFormDialog({ product, onSubmit, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(product ?? EMPTY_DRAFT);
  const [advanced, setAdvanced] = useState(Boolean(product?.fixedQuantity));

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setDraft(product ?? EMPTY_DRAFT);
      setAdvanced(Boolean(product?.fixedQuantity));
    }
  }

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  const simpleMargin = draft.price > 0 ? ((draft.price - draft.cost) / draft.price) * 100 : 0;
  const estimatedProfit = estimateAverageProfit({ id: "preview", ...draft });

  function handleSubmit() {
    if (!draft.name.trim() || draft.price <= 0) return;

    const payload: Draft = advanced
      ? draft
      : {
          name: draft.name,
          price: draft.price,
          cost: draft.cost,
          probability: draft.probability,
        };

    onSubmit(payload);
    setOpen(false);
  }

  function toggleAdvanced(checked: boolean) {
    setAdvanced(checked);
    if (checked && !draft.fixedQuantity) {
      update("fixedQuantity", 1);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Editar producto" : "Nuevo producto"}</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ej. Sudadera Oversize"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">
                Precio {advanced ? "del pedido" : ""} (€)
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                value={draft.price}
                onChange={(e) => update("price", Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cost">
                Coste {advanced ? "de producto" : ""} (€)
              </Label>
              <Input
                id="cost"
                type="number"
                min={0}
                step="0.01"
                value={draft.cost}
                onChange={(e) => update("cost", Number(e.target.value))}
              />
            </div>
          </div>

          {!advanced && (
            <p className="text-sm text-muted-foreground">
              Margen calculado:{" "}
              <span className="font-medium text-foreground">{simpleMargin.toFixed(1)}%</span>
            </p>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Probabilidad de venta</Label>
              <span className="text-sm tabular-nums text-muted-foreground">
                {draft.probability}
              </span>
            </div>
            <Slider
              value={[draft.probability]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => {
                const next = Array.isArray(value) ? value[0] : value;
                update("probability", next);
              }}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="advanced">Economía avanzada de pedido</Label>
              <p className="text-xs text-muted-foreground">
                Para packs con gastos logísticos, CPA y regalos (tipo COD/Dropea).
              </p>
            </div>
            <Switch id="advanced" checked={advanced} onCheckedChange={toggleAdvanced} />
          </div>

          {advanced && (
            <div className="flex flex-col gap-4 rounded-md border border-dashed p-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fixedQuantity">Unidades del pack</Label>
                <Input
                  id="fixedQuantity"
                  type="number"
                  min={1}
                  value={draft.fixedQuantity ?? 1}
                  onChange={(e) => update("fixedQuantity", Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="logisticsCost">Envío + COD + fulfillment (€)</Label>
                  <Input
                    id="logisticsCost"
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.logisticsCost ?? 0}
                    onChange={(e) => update("logisticsCost", Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="logisticsVatRate">IVA sobre logística (%)</Label>
                  <Input
                    id="logisticsVatRate"
                    type="number"
                    min={0}
                    max={100}
                    value={draft.logisticsVatRate ?? 0}
                    onChange={(e) => update("logisticsVatRate", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="adCost">CPA — coste de adquisición (€)</Label>
                <Input
                  id="adCost"
                  type="number"
                  min={0}
                  step="0.01"
                  value={draft.adCost ?? 0}
                  onChange={(e) => update("adCost", Number(e.target.value))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="giftCost">Coste de regalos incluidos (€)</Label>
                <Input
                  id="giftCost"
                  type="number"
                  min={0}
                  step="0.01"
                  value={draft.giftCost ?? 0}
                  onChange={(e) => update("giftCost", Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  No se muestra al cliente, solo se descuenta del beneficio.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="giftShippingMin">Envío regalo mín. (€)</Label>
                  <Input
                    id="giftShippingMin"
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.giftShippingMin ?? 0}
                    onChange={(e) => update("giftShippingMin", Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="giftShippingMax">Envío regalo máx. (€)</Label>
                  <Input
                    id="giftShippingMax"
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.giftShippingMax ?? 0}
                    onChange={(e) => update("giftShippingMax", Number(e.target.value))}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Beneficio neto medio estimado:{" "}
                <span className="font-medium text-foreground">
                  {estimatedProfit.toFixed(2)} €
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{product ? "Guardar cambios" : "Crear producto"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
