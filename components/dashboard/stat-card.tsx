import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  badgeText,
  badgeVariant = "default",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("border border-border bg-card shadow-none", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground/60" />}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
          {badgeText && (
            <Badge variant={badgeVariant} className="text-[10px] font-normal px-1.5 py-0">
              {badgeText}
            </Badge>
          )}
        </div>
        {description && (
          <p className="mt-1 text-[11px] text-muted-foreground truncate">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
