
import type { LucideIcon } from "lucide-react";

interface ReportStatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
}

const getIconBackground = (color: string) => {
  if (color.includes("blue")) return "bg-blue-50";
  if (color.includes("amber") || color.includes("yellow")) return "bg-amber-50";
  if (color.includes("green")) return "bg-green-50";
  if (color.includes("red")) return "bg-red-50";

  return "bg-gray-100";
};

const getBorderColor = (color: string) => {
  if (color.includes("blue")) return "border-t-blue-500";
  if (color.includes("amber") || color.includes("yellow")) return "border-t-amber-500";
  if (color.includes("green")) return "border-t-green-600";
  if (color.includes("red")) return "border-t-red-500";

  return "border-t-gray-400";
};

export default function ReportStatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-blue-600",
}: ReportStatCardProps) {
  return (
    <div
      className={`group rounded-xl border border-gray-200 border-t-[3px] ${getBorderColor(iconColor)} bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-500">
            {title}
          </p>

          <p className="mt-3 break-words text-2xl font-extrabold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            {description}
          </p>
        </div>

        <div
          className={`shrink-0 rounded-xl p-3 ${getIconBackground(iconColor)} ${iconColor} transition-transform duration-200 group-hover:scale-110`}
        >
          <Icon size={22} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
