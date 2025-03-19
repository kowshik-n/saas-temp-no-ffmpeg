import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface TrialPlanProps {
  onUpgrade: () => void;
  videoUploads: number;
  videoLimit: number;
  clipUploads: number;
  clipLimit: number;
}

export function TrialPlan({
  onUpgrade = () => {},
  videoUploads = 0,
  videoLimit = 3,
  clipUploads = 0,
  clipLimit = 1,
}: TrialPlanProps) {
  return (
    <Card className="border border-border/50 shadow-sm mb-6 bg-gradient-to-br from-orange-50/50 to-amber-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-orange-700">
          Trial Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Video upload</span>
            <span className="font-medium">
              {videoUploads}/{videoLimit}
            </span>
          </div>
          <Progress
            value={(videoUploads / videoLimit) * 100}
            className="h-2 bg-orange-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Magic clips upload</span>
            <span className="font-medium">
              {clipUploads}/{clipLimit}
            </span>
          </div>
          <Progress
            value={(clipUploads / clipLimit) * 100}
            className="h-2 bg-orange-100"
          />
        </div>

        <Button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
        >
          Upgrade plan
        </Button>
      </CardContent>
    </Card>
  );
}
