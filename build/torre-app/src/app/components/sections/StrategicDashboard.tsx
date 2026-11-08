import { StrategicDashboardResponsive } from "./StrategicDashboardResponsive";

interface StrategicDashboardProps {
  onOpenInsights?: () => void;
}

export function StrategicDashboard({ onOpenInsights }: StrategicDashboardProps) {
  return <StrategicDashboardResponsive onOpenInsights={onOpenInsights} />;
}