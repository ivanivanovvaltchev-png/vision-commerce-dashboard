"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityEvent, ActivityEventType } from "@/lib/types";
import { CircleDollarSign, Target, UserRound } from "lucide-react";

const ICONS: Record<ActivityEventType, React.ElementType> = {
  sale: CircleDollarSign,
  session: UserRound,
  milestone: Target,
};

const ICON_COLORS: Record<ActivityEventType, string> = {
  sale: "text-[#0ca30c]",
  session: "text-[#2a78d6]",
  milestone: "text-[#eda100]",
};

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad en vivo</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[380px] pr-4">
          {events.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Sin actividad todavía.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {events.map((event) => {
                const Icon = ICONS[event.type];
                return (
                  <div key={event.id} className="flex items-start gap-2 text-sm">
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${ICON_COLORS[event.type]}`} />
                    <div className="min-w-0">
                      <p className="truncate">{event.message}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
