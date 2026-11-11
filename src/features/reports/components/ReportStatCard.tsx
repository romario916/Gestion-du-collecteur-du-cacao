
import type { LucideIcon } from "lucide-react";

interface ReportStatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
}

export default function ReportStatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-blue-600",
}: ReportStatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {description}
          </p>
        </div>

        <div className={`rounded-lg bg-gray-100 p-3 ${iconColor}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}
