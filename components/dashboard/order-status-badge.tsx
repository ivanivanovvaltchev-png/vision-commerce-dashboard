import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/lib/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Processing: "bg-[#fab219]/15 text-[#a15f00] dark:text-[#fab219] border-[#fab219]/30",
  Paid: "bg-[#2a78d6]/15 text-[#1c5cab] dark:text-[#3987e5] border-[#2a78d6]/30",
  Fulfilled: "bg-[#0ca30c]/15 text-[#006300] dark:text-[#0ca30c] border-[#0ca30c]/30",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  Processing: "Processing",
  Paid: "Paid",
  Fulfilled: "Fulfilled",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={STATUS_STYLES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
