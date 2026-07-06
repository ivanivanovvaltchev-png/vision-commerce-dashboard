import { Badge } from "@/components/ui/badge";
import { paymentStatusLabel } from "@/lib/order-display";
import { OrderStatus } from "@/lib/types";

export function PaymentStatusBadge({ status }: { status: OrderStatus }) {
  const label = paymentStatusLabel(status);
  const isPaid = label === "Pagado";

  return (
    <Badge
      variant="outline"
      className={
        isPaid
          ? "bg-[#0ca30c]/15 text-[#006300] dark:text-[#0ca30c] border-[#0ca30c]/30"
          : "bg-[#fab219]/15 text-[#a15f00] dark:text-[#fab219] border-[#fab219]/30"
      }
    >
      {label}
    </Badge>
  );
}
