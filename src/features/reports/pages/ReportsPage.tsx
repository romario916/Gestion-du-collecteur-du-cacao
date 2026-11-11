
import { useState } from "react";
import {
  ShoppingCart,
  Factory,
  TrendingUp,
  Wallet,
  Printer,
  FileBarChart,
} from "lucide-react";

import type { ReportPeriod } from "../reports.types";

import {
  getPurchaseReport,
  getProductionReport,
  getSalesReport,
  getExpenseReport,
  getFinancialReport,
} from "../reports.service";

import ReportStatCard from "../components/ReportStatCard";
import ReportPeriodFilter from "../components/ReportPeriodFilter";
import ExpenseCategoryChart from "../components/ExpenseCategoryChart";
import ReportsSummary from "../components/ReportsSummary";
import FinancialReportCards from "../components/FinancialReportCards";

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitialPeriod(): ReportPeriod {
  const today = new Date();

  return {
    dateDebut: formatLocalDate(
      new Date(today.getFullYear(), today.getMonth(), 1),
    ),
    dateFin: formatLocalDate(today),
  };
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

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>(
    getInitialPeriod,
  );

  const purchaseReport = getPurchaseReport(period);
  const productionReport = getProductionReport(period);
  const salesReport = getSalesReport(period);
  const expenseReport = getExpenseReport(period);
  const financialReport = getFinancialReport(period);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <FileBarChart className="text-blue-600" size={25} />

            <h1 className="text-2xl font-bold text-gray-900">
              Rapports et statistiques
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Analysez les performances et les activités de votre entreprise.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Printer size={17} />
          Imprimer / PDF
        </button>
      </div>

      {/* Filtre de période */}
      <div className="print:hidden">
        <ReportPeriodFilter
          period={period}
          onChange={setPeriod}
        />
      </div>

      {/* Indicateurs principaux */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Indicateurs de la période
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportStatCard
            title="Achats validés"
            value={formatNumber(purchaseReport.nombreAchats)}
            description={`${formatNumber(purchaseReport.quantiteTotaleKg)} kg achetés`}
            icon={ShoppingCart}
            iconColor="text-blue-600"
          />

          <ReportStatCard
            title="Opérations terminées"
            value={formatNumber(productionReport.nombreOperations)}
            description={`${formatNumber(productionReport.quantiteSecheObtenueKg)} kg de cacao sec`}
            icon={Factory}
            iconColor="text-amber-600"
          />

          <ReportStatCard
            title="Ventes confirmées"
            value={formatNumber(salesReport.nombreVentes)}
            description={`${formatNumber(salesReport.quantiteVendueKg)} kg vendus`}
            icon={TrendingUp}
            iconColor="text-green-600"
          />

          <ReportStatCard
            title="Dépenses validées"
            value={formatCurrency(expenseReport.montantTotal)}
            description={`${formatNumber(expenseReport.nombreDepenses)} dépenses`}
            icon={Wallet}
            iconColor="text-red-600"
          />
        </div>
      </div>

      {/* Résumé détaillé */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Résumé des activités
        </h2>

        <ReportsSummary
          purchases={purchaseReport}
          production={productionReport}
          sales={salesReport}
          expenses={expenseReport}
        />
      </div>

      {/* Dépenses par catégorie */}
      <ExpenseCategoryChart report={expenseReport} />

      {/* Résumé financier */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Situation financière
        </h2>

        <FinancialReportCards report={financialReport} />
      </div>

      {/* Pied de rapport */}
      <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
        Rapport généré par Cacao Sambirano ERP
      </div>
    </div>
  );
}
