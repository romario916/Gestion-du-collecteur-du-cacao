
import {
  Users,
  Package,
  ShoppingCart,
  Wallet,
  Wheat,
  ArrowUpRight,
  UserPlus,
  ClipboardList,
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
    color: "bg-blue-50 text-blue-600",
  },
  ACHAT: {
    label: "Achat",
    icon: ShoppingCart,
    color: "bg-amber-50 text-amber-600",
  },
  TRANSFORMATION: {
    label: "Séchage",
    icon: Wheat,
    color: "bg-green-50 text-green-600",
  },
  VENTE: {
    label: "Vente",
    icon: ClipboardList,
    color: "bg-purple-50 text-purple-600",
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
  const recentActivities = getDashboardRecentActivities(8);

  const statistics = [
    {
      title: "Producteurs actifs",
      value: stats.producers.active.toLocaleString("fr-FR"),
      description: `${stats.producers.total} producteurs enregistrés`,
      icon: Users,
    },
    {
      title: "Lots de cacao frais",
      value: stats.batches.total.toLocaleString("fr-FR"),
      description: `${formatQuantity(stats.batches.availableStockKg)} disponibles`,
      icon: Package,
    },
    {
      title: "Ventes confirmées",
      value: formatAmount(stats.sales.amount),
      description: `${stats.sales.total} ventes confirmées`,
      icon: ShoppingCart,
    },
    {
      title: "Stock de cacao sec",
      value: formatQuantity(stats.dryStock.availableStockKg),
      description: `${stats.dryStock.total} lots secs enregistrés`,
      icon: Wheat,
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
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#16A34A]">
            Vue d'ensemble
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17251B] sm:text-3xl">
            Bienvenue sur Cacao Sambirano
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Suivez et gérez vos activités agricoles en un seul endroit.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          Année : <strong className="text-[#14532D]">2026</strong>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#16A34A]">
                  <Icon size={21} />
                </div>

                <ArrowUpRight size={19} className="text-gray-300" />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                {stat.title}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#17251B]">
                {stat.value}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                {stat.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#17251B]">
                Production et stock sec
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Quantités réelles enregistrées en kilogrammes
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-2 text-gray-500">
                <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                Production totale
              </span>

              <span className="flex items-center gap-2 text-gray-500">
                <span className="h-2 w-2 rounded-full bg-[#D9A441]" />
                Stock disponible
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionData}>
                <defs>
                  <linearGradient
                    id="productionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#16A34A"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="#16A34A"
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
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />

                <Tooltip
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
                />

                <Area
                  type="monotone"
                  dataKey="stock"
                  stroke="#D9A441"
                  strokeWidth={2.5}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl bg-[#14532D] p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100/70">
                Résumé financier
              </p>

              <h2 className="mt-1 text-lg font-bold">
                Situation actuelle
              </h2>
            </div>

            <Wallet size={23} className="text-green-200" />
          </div>

          <div className="mt-8">
            <p className="text-xs text-green-100/70">
              Montant encaissé
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatAmount(stats.sales.collected)}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-3">
              <span className="text-sm text-green-100/70">
                Ventes à encaisser
              </span>

              <strong className="text-right">
                {formatAmount(stats.sales.unpaid)}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-3">
              <span className="text-sm text-green-100/70">
                Achats confirmés
              </span>

              <strong className="text-right">
                {formatAmount(stats.purchases.amount)}
              </strong>
            </div>
          </div>

          <p className="mt-7 text-xs leading-5 text-green-100/60">
            Données issues des modules de ventes et d'achats.
            Les dépenses ne sont pas encore intégrées.
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:px-6">
          <h2 className="font-bold text-[#17251B]">
            Activités récentes
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Les 8 dernières opérations enregistrées
          </p>
        </div>

        {recentActivities.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <div
                  key={activity.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:px-6"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.color}`}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#17251B]">
                      {activity.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {activity.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
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
            <Package
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-medium text-gray-600">
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
