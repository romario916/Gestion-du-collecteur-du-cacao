
import {
  ShoppingCart,
  Factory,
  TrendingUp,
  Wallet,
} from "lucide-react";

import type {
  PurchaseReport,
  ProductionReport,
  SalesReport,
  ExpenseReport,
} from "../reports.types";

interface ReportsSummaryProps {
  purchases: PurchaseReport;
  production: ProductionReport;
  sales: SalesReport;
  expenses: ExpenseReport;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(value);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MGA",
    maximumFractionDigits: 0,
  }).format(value);

export default function ReportsSummary({
  purchases,
  production,
  sales,
  expenses,
}: ReportsSummaryProps) {
  const sections = [
    {
      title: "Achats",
      subtitle: "Approvisionnement en cacao frais",
      icon: ShoppingCart,
      color: "text-blue-700",
      background: "bg-blue-50",
      border: "border-t-blue-500",
      items: [
        {
          label: "Nombre d'achats",
          value: formatNumber(purchases.nombreAchats),
        },
        {
          label: "Quantité achetée",
          value: `${formatNumber(purchases.quantiteTotaleKg)} kg`,
        },
        {
          label: "Montant total",
          value: formatCurrency(purchases.montantTotal),
        },
      ],
    },
    {
      title: "Production",
      subtitle: "Transformation et séchage",
      icon: Factory,
      color: "text-amber-700",
      background: "bg-amber-50",
      border: "border-t-amber-500",
      items: [
        {
          label: "Opérations terminées",
          value: formatNumber(production.nombreOperations),
        },
        {
          label: "Cacao frais utilisé",
          value: `${formatNumber(production.quantiteFraicheUtiliseeKg)} kg`,
        },
        {
          label: "Cacao sec obtenu",
          value: `${formatNumber(production.quantiteSecheObtenueKg)} kg`,
        },
        {
          label: "Perte de poids",
          value: `${formatNumber(production.perteTotaleKg)} kg`,
        },
        {
          label: "Rendement moyen",
          value: `${formatNumber(production.rendementMoyen)} %`,
        },
      ],
    },
    {
      title: "Ventes",
      subtitle: "Commercialisation du cacao sec",
      icon: TrendingUp,
      color: "text-green-700",
      background: "bg-green-50",
      border: "border-t-green-600",
      items: [
        {
          label: "Nombre de ventes",
          value: formatNumber(sales.nombreVentes),
        },
        {
          label: "Quantité vendue",
          value: `${formatNumber(sales.quantiteVendueKg)} kg`,
        },
        {
          label: "Chiffre d'affaires encaissé",
          value: formatCurrency(sales.chiffreAffaires),
        },
        {
          label: "Montant en attente",
          value: formatCurrency(sales.montantEnAttente),
        },
      ],
    },
    {
      title: "Dépenses",
      subtitle: "Suivi des charges de l'entreprise",
      icon: Wallet,
      color: "text-red-700",
      background: "bg-red-50",
      border: "border-t-red-500",
      items: [
        {
          label: "Nombre de dépenses",
          value: formatNumber(expenses.nombreDepenses),
        },
        {
          label: "Montant total validé",
          value: formatCurrency(expenses.montantTotal),
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {sections.map((section) => {
        const Icon = section.icon;

        return (
          <div
            key={section.title}
            className={`overflow-hidden rounded-2xl border border-gray-200 border-t-[3px] ${section.border} bg-white shadow-sm transition duration-200 hover:shadow-md`}
          >
            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <div className={`rounded-xl p-3 ${section.background} ${section.color}`}>
                <Icon size={21} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-gray-900">
                  {section.title}
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  {section.subtitle}
                </p>
              </div>
            </div>

            <div className="space-y-0 px-5 py-2">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4 border-b border-gray-100 py-3.5 last:border-0"
                >
                  <span className="text-sm text-gray-500">
                    {item.label}
                  </span>

                  <span className="text-right text-sm font-bold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
