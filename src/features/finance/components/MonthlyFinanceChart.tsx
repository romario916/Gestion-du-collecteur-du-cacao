
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import type { MonthlyFinance } from "../finance.types";

interface MonthlyFinanceChartProps {
  data: MonthlyFinance[];
}

function formatAmount(value: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(value)} Ar`;
}

export default function MonthlyFinanceChart({
  data,
}: MonthlyFinanceChartProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Évolution financière
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Recettes, dépenses et résultat net des six derniers mois
        </p>
      </div>

      <div className="h-[320px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#10B981"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="#10B981"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="expensesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#EF4444"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="#EF4444"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="resultGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#3B82F6"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="#3B82F6"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                tickFormatter={(value: number) =>
                  new Intl.NumberFormat("fr-FR", {
                    notation: "compact",
                  }).format(value)
                }
              />

              <Tooltip
                formatter={(value) => formatAmount(Number(value ?? 0))}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                }}
              />

              <Legend />

              <Area
                type="monotone"
                dataKey="revenue"
                name="Recettes"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />

              <Area
                type="monotone"
                dataKey="expenses"
                name="Dépenses"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#expensesGradient)"
              />

              <Area
                type="monotone"
                dataKey="result"
                name="Résultat net"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#resultGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Aucune donnée financière disponible.
          </div>
        )}
      </div>
    </div>
  );
}
