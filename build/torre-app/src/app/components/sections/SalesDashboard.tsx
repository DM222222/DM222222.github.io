import { SalesDashboardResponsive } from "./SalesDashboardResponsive";

interface SalesDashboardProps {
  onOpenInsights?: () => void;
}

export function SalesDashboard({ onOpenInsights }: SalesDashboardProps) {
  return <SalesDashboardResponsive onOpenInsights={onOpenInsights} />;
}
