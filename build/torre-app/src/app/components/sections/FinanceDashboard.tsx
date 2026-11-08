import { FinanceDashboardResponsive } from "./FinanceDashboardResponsive";

interface FinanceDashboardProps {
  onOpenInsights?: () => void;
}

export function FinanceDashboard({ onOpenInsights }: FinanceDashboardProps) {
  return <FinanceDashboardResponsive onOpenInsights={onOpenInsights} />;
}
