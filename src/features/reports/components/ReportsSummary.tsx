
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
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-50",
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
      icon: Factory,
      color: "text-amber-600 bg-amber-50",
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
      icon: TrendingUp,
      color: "text-green-600 bg-green-50",
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
      icon: Wallet,
      color: "text-red-600 bg-red-50",
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
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${section.color}`}>
                <Icon size={20} />
              </div>

              <h3 className="font-semibold text-gray-900">
                {section.title}
              </h3>
            </div>

            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm text-gray-500">
                    {item.label}
                  </span>

                  <span className="text-right text-sm font-semibold text-gray-900">
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
