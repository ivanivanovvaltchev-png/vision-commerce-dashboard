import { Badge } from "@/components/ui/badge";
import { fulfillmentStatusLabel } from "@/lib/order-display";
import { OrderStatus } from "@/lib/types";

export function FulfillmentStatusBadge({ status }: { status: OrderStatus }) {
  const label = fulfillmentStatusLabel(status);
  const isFulfilled = label === "Preparado";

  return (
    <Badge
      variant="outline"
      className={
        isFulfilled
          ? "bg-[#2a78d6]/15 text-[#1c5cab] dark:text-[#3987e5] border-[#2a78d6]/30"
          : "bg-muted text-muted-foreground border-border"
      }
    >
      {label}
    </Badge>
  );
}
