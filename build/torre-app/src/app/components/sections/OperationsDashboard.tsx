import { OperationsDashboardResponsive } from "./OperationsDashboardResponsive";

interface OperationsDashboardProps {
  onOpenInsights?: () => void;
}

export function OperationsDashboard({ onOpenInsights }: OperationsDashboardProps) {
  return <OperationsDashboardResponsive onOpenInsights={onOpenInsights} />;
}
