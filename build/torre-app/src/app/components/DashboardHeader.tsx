import { Building2, Bell, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "./ui/badge";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  userName?: string;
  alertCount?: number;
  onAlertClick?: () => void;
}

export function DashboardHeader({ 
  onMenuClick, 
  showMenuButton = true,
  userName = "Usuário",
  alertCount = 3,
  onAlertClick
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <div className="hidden md:block">
            <h1 className="font-semibold">Cliente</h1>
            <p className="text-xs text-muted-foreground">Torre de Controle</p>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left md:ml-4">
          <h2 className="font-semibold md:hidden truncate">Torre de Controle</h2>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative" 
            onClick={onAlertClick}
          >
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {alertCount}
              </Badge>
            )}
          </Button>

          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}