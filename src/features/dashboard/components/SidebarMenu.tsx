import React from "react";
import { Button } from "@/components/ui/button";
import { Grid, Tag, Gift, Users, MessageSquare } from "lucide-react";

interface SidebarMenuProps {
  onSelectItem: (item: string) => void;
  selectedItem: string;
}

export function SidebarMenu({
  onSelectItem = () => {},
  selectedItem = "projects",
}: SidebarMenuProps) {
  const menuItems = [
    {
      id: "projects",
      label: "All Projects",
      icon: <Grid className="h-5 w-5" />,
    },
    {
      id: "pricing",
      label: "Pricing Plans",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      id: "free",
      label: "Get 15 free videos",
      icon: <Gift className="h-5 w-5" />,
    },
    {
      id: "affiliate",
      label: "Affiliate",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "request",
      label: "Feature Request",
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-1.5 w-full mt-2">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant={selectedItem === item.id ? "secondary" : "ghost"}
          className={`w-full justify-start transition-all ${selectedItem === item.id ? "bg-secondary font-medium" : "hover:bg-muted/70"}`}
          onClick={() => onSelectItem(item.id)}
        >
          <span
            className={`mr-2.5 ${selectedItem === item.id ? "text-primary" : "text-muted-foreground"}`}
          >
            {item.icon}
          </span>
          {item.label}
        </Button>
      ))}
    </div>
  );
}
