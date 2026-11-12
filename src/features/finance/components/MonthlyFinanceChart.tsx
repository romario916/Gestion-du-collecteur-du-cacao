
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
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            <h2 className="text-lg font-extrabold text-gray-900">
              Évolution financière
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Recettes, dépenses et résultat net des six derniers mois.
          </p>
        </div>

        <span className="inline-flex w-fit items-center rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-xs font-bold text-green-800">
          Analyse mensuelle
        </span>
      </div>

      <div className="h-[320px] w-full sm:h-[360px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 5,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient
                  id="financeRevenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#16A34A"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="#16A34A"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="financeExpensesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#EAB308"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor="#EAB308"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="financeResultGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#2563EB"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="#2563EB"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 5"
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6B7280",
                  fontSize: 12,
                  fontWeight: 500,
                }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={65}
                tick={{
                  fill: "#9CA3AF",
                  fontSize: 11,
                }}
                tickFormatter={(value: number) =>
                  new Intl.NumberFormat("fr-FR", {
                    notation: "compact",
                  }).format(value)
                }
              />

              <Tooltip
                formatter={(value) => formatAmount(Number(value ?? 0))}
                contentStyle={{
                  borderRadius: "14px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                  padding: "12px 14px",
                  fontSize: "12px",
                }}
                labelStyle={{
                  color: "#14532D",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={9}
                wrapperStyle={{
                  paddingTop: "18px",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                name="Recettes"
                stroke="#16A34A"
                strokeWidth={3}
                fill="url(#financeRevenueGradient)"
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "#FFFFFF",
                }}
              />

              <Area
                type="monotone"
                dataKey="expenses"
                name="Dépenses"
                stroke="#EAB308"
                strokeWidth={3}
                fill="url(#financeExpensesGradient)"
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "#FFFFFF",
                }}
              />

              <Area
                type="monotone"
                dataKey="result"
                name="Résultat net"
                stroke="#2563EB"
                strokeWidth={3}
                fill="url(#financeResultGradient)"
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "#FFFFFF",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl bg-gray-50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
              <span className="text-2xl font-bold">∅</span>
            </div>

            <p className="text-sm font-semibold text-gray-500">
              Aucune donnée financière disponible.
            </p>

            <p className="text-xs text-gray-400">
              Les données apparaîtront après les premières opérations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
