
import {
  Users,
  Package,
  ShoppingCart,
  Wallet,
  Wheat,
  ArrowUpRight,
  UserPlus,
  ClipboardList,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getDashboardStats,
  getDashboardRecentActivities,
} from "./dashboard.service";

import { getFinanceStats } from "../finance/finance.service";

import type { DashboardActivity } from "./dashboard.service";

function formatAmount(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} Ar`;
}

function formatQuantity(quantity: number): string {
  return `${quantity.toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })} kg`;
}

function formatActivityDate(date: string): string {
  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const activityConfig = {
  PRODUCTEUR: {
    label: "Producteur",
    icon: UserPlus,
    color: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  ACHAT: {
    label: "Achat",
    icon: ShoppingCart,
    color: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  TRANSFORMATION: {
    label: "Séchage",
    icon: Wheat,
    color: "bg-green-50 text-green-700 ring-green-100",
  },
  VENTE: {
    label: "Vente",
    icon: ClipboardList,
    color: "bg-purple-50 text-purple-700 ring-purple-100",
  },
} satisfies Record<
  DashboardActivity["type"],
  {
    label: string;
    icon: typeof UserPlus;
    color: string;
  }
>;

export default function DashboardPage() {
  const stats = getDashboardStats();
  const financeStats = getFinanceStats();

  const benefice =
    financeStats.totalRevenue -
    (financeStats.totalExpenses + stats.purchases.amount);

  const recentActivities = getDashboardRecentActivities(8);

  const statistics = [
    {
      title: "Producteurs actifs",
      value: stats.producers.active.toLocaleString("fr-FR"),
      description: `${stats.producers.total} producteurs enregistrés`,
      icon: Users,
      iconColor: "bg-green-100 text-green-700",
      accent: "bg-green-500",
    },
    {
      title: "Lots de cacao frais",
      value: stats.batches.total.toLocaleString("fr-FR"),
      description: `${formatQuantity(stats.batches.availableStockKg)} disponibles`,
      icon: Package,
      iconColor: "bg-blue-100 text-blue-700",
      accent: "bg-blue-500",
    },
    {
      title: "Ventes confirmées",
      value: formatAmount(stats.sales.amount),
      description: `${stats.sales.total} ventes confirmées`,
      icon: ShoppingCart,
      iconColor: "bg-amber-100 text-amber-700",
      accent: "bg-amber-500",
    },
    {
      title: "Stock de cacao sec",
      value: formatQuantity(stats.dryStock.availableStockKg),
      description: `${stats.dryStock.total} lots secs enregistrés`,
      icon: Wheat,
      iconColor: "bg-emerald-100 text-emerald-700",
      accent: "bg-emerald-600",
    },
  ];

  const productionData = [
    {
      label: "Total actuel",
      production: stats.processing.totalDryProductionKg,
      stock: stats.dryStock.availableStockKg,
    },
  ];

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 via-white to-amber-50/60 p-5 sm:flex-row sm:items-center sm:p-7">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-800 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Vue d'ensemble
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Bienvenue sur Cacao Sambirano
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
            Suivez et gérez vos activités agricoles en un seul endroit.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-xl border border-white bg-white/90 px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <CalendarDays size={20} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Exercice
            </p>
            <p className="text-sm font-bold text-green-900">
              Année 2026
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Indicateurs clés
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              État actuel de votre activité
            </p>
          </div>

          <TrendingUp size={19} className="text-green-600" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50"
              >
                <div className={`absolute left-0 top-0 h-1 w-full ${stat.accent}`} />

                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconColor}`}>
                    <Icon size={22} strokeWidth={1.9} />
                  </div>

                  <div className="rounded-lg bg-gray-50 p-2 text-gray-300 transition-colors group-hover:text-green-600">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <p className="mt-5 text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <h3 className="mt-1 break-words text-2xl font-extrabold tracking-tight text-gray-900">
                  {stat.value}
                </h3>

                <p className="mt-2 text-xs text-gray-400">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Production and finance */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Production chart */}
        <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2 sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Wheat size={19} />
                </div>

                <h2 className="font-bold text-gray-900">
                  Production et stock sec
                </h2>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Quantités réelles enregistrées en kilogrammes
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] font-medium">
              <span className="flex items-center gap-2 text-gray-500">
                <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                Production totale
              </span>

              <span className="flex items-center gap-2 text-gray-500">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Stock disponible
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={productionData}
                margin={{ top: 10, right: 8, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="productionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#16A34A" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [
                    `${Number(value).toLocaleString("fr-FR")} kg`,
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="production"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  fill="url(#productionGradient)"
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />

                <Area
                  type="monotone"
                  dataKey="stock"
                  stroke="#EAB308"
                  strokeWidth={2.5}
                  fill="transparent"
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Financial summary */}
        <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#14532D] to-[#103F26] p-6 text-white shadow-lg shadow-green-950/10">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[24px] border-white/[0.04]" />
          <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full border-[28px] border-white/[0.04]" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-green-100/70">
                  Résumé financier
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Situation actuelle
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                <Wallet size={22} />
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.07] p-4">
              <p className="text-xs font-medium text-green-100/70">
                Bénéfice net estimé
              </p>

              <p className="mt-2 break-words text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {formatAmount(benefice)}
              </p>

              <p className="mt-2 text-[10px] leading-relaxed text-green-100/60">
                Ventes encaissées - dépenses validées - achats confirmés
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <span className="text-xs text-green-100/70">
                  Montant encaissé
                </span>

                <strong className="text-right text-sm">
                  {formatAmount(financeStats.totalRevenue)}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <span className="text-xs text-green-100/70">
                  Dépenses validées
                </span>

                <strong className="text-right text-sm">
                  {formatAmount(financeStats.totalExpenses)}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <span className="text-xs text-green-100/70">
                  Achats confirmés
                </span>

                <strong className="text-right text-sm">
                  {formatAmount(stats.purchases.amount)}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-green-100/70">
                  Ventes à encaisser
                </span>

                <strong className="text-right text-sm text-amber-300">
                  {formatAmount(financeStats.unpaidSalesAmount)}
                </strong>
              </div>
            </div>

            <p className="mt-6 border-t border-white/10 pt-4 text-[10px] leading-relaxed text-green-100/50">
              Calcul basé sur les ventes encaissées, les dépenses validées et les achats confirmés.
            </p>
          </div>
        </article>
      </section>

      {/* Recent activities */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5 sm:px-6">
          <div>
            <h2 className="font-bold text-gray-900">
              Activités récentes
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Les 8 dernières opérations enregistrées
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <ClipboardList size={19} />
          </div>
        </div>

        {recentActivities.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <div
                  key={activity.id}
                  className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-gray-50/80 sm:flex-row sm:items-center sm:px-6"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${config.color}`}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {activity.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {activity.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${config.color}`}
                    >
                      {config.label}
                    </span>

                    <span className="text-[11px] text-gray-400">
                      {formatActivityDate(activity.date)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
              <Package size={28} />
            </div>

            <p className="mt-3 text-sm font-semibold text-gray-600">
              Aucune activité enregistrée
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Les nouvelles opérations apparaîtront ici automatiquement.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
