import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onClick: () => void;
  isPro?: boolean;
  count?: number;
  maxCount?: number;
  isNew?: boolean;
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  buttonText,
  onClick,
  isPro = false,
  count,
  maxCount,
  isNew = false,
}: DashboardCardProps) {
  return (
    <Card className="overflow-hidden border border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {isNew && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800"
            >
              New
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {count !== undefined && maxCount !== undefined && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{count}</span> of{" "}
            <span className="font-medium">{maxCount}</span> used
            {!isPro && count >= maxCount && (
              <span className="text-orange-600 ml-2 font-medium">
                Upgrade for more
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          onClick={onClick}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          disabled={
            !isPro &&
            count !== undefined &&
            maxCount !== undefined &&
            count >= maxCount
          }
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
