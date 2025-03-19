import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Clock, Video } from "lucide-react";

interface UsageStatsProps {
  videoCount: number;
  videoLimit: number;
  minutesProcessed: number;
  minutesLimit: number;
  isPro: boolean;
}

export function UsageStats({
  videoCount = 0,
  videoLimit = 3,
  minutesProcessed = 0,
  minutesLimit = 30,
  isPro = false,
}: UsageStatsProps) {
  const videoPercentage = Math.min(100, (videoCount / videoLimit) * 100);
  const minutesPercentage = Math.min(
    100,
    (minutesProcessed / minutesLimit) * 100,
  );

  return (
    <Card className="border border-border/50 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <PieChart className="mr-2 h-5 w-5 text-muted-foreground" />
          Usage Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Video className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Videos</span>
            </div>
            <span className="text-sm font-medium">
              {videoCount} / {isPro ? "Unlimited" : videoLimit}
            </span>
          </div>
          {!isPro && <Progress value={videoPercentage} className="h-2" />}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Minutes Processed</span>
            </div>
            <span className="text-sm font-medium">
              {minutesProcessed} / {isPro ? "Unlimited" : minutesLimit}
            </span>
          </div>
          {!isPro && <Progress value={minutesPercentage} className="h-2" />}
        </div>
      </CardContent>
    </Card>
  );
}
