import { TacticalDashboardResponsive } from "./TacticalDashboardResponsive";

interface TacticalDashboardProps {
  onOpenInsights?: () => void;
}

export function TacticalDashboard({ onOpenInsights }: TacticalDashboardProps) {
  return <TacticalDashboardResponsive onOpenInsights={onOpenInsights} />;
}
