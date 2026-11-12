
import { useState } from "react";
import {
  ShoppingCart,
  Factory,
  TrendingUp,
  Wallet,
  Printer,
  FileBarChart,
  CalendarDays,
  ChartNoAxesCombined,
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
    <div className="space-y-7 pb-8">
      {/* En-tête */}
      <section className="relative overflow-hidden rounded-2xl bg-[#103F26] p-6 text-white shadow-lg sm:p-8 print:bg-white print:text-gray-900 print:shadow-none">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[35px] border-white/5" />

        <div className="pointer-events-none absolute -bottom-32 right-40 h-64 w-64 rounded-full bg-[#E5B54B]/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-xl bg-white/10 p-2.5 print:bg-gray-100">
                <FileBarChart
                  size={24}
                  className="text-[#E5B54B] print:text-green-800"
                />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E5B54B]">
                Analyse et pilotage
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Rapports et statistiques
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-green-100/80 print:text-gray-600">
              Suivez les performances de Cacao Sambirano, analysez
              les activités et consultez les résultats de votre entreprise.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E5B54B] px-5 py-3 text-sm font-bold text-[#103F26] shadow-md transition hover:bg-[#F0C766] active:scale-[0.98] print:hidden"
          >
            <Printer size={18} />
            Imprimer / PDF
          </button>
        </div>

        <div className="relative mt-7 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-green-100/70">
          <CalendarDays size={15} className="text-[#E5B54B]" />
          <span>
            Période d'analyse : du {period.dateDebut} au {period.dateFin}
          </span>
        </div>
      </section>

      {/* Filtre de période */}
      <section className="space-y-3 print:hidden">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-2">
            <CalendarDays size={18} className="text-blue-600" />
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900">
              Période du rapport
            </h2>
            <p className="text-xs text-gray-500">
              Sélectionnez les dates à analyser.
            </p>
          </div>
        </div>

        <ReportPeriodFilter
          period={period}
          onChange={setPeriod}
        />
      </section>

      {/* Indicateurs principaux */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Indicateurs de la période
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Vue globale des principales activités.
            </p>
          </div>

          <div className="hidden items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 sm:flex">
            <ChartNoAxesCombined size={14} />
            Statistiques
          </div>
        </div>

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
      </section>

      {/* Résumé détaillé */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Résumé des activités
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Détails des achats, de la production, des ventes et des dépenses.
          </p>
        </div>

        <ReportsSummary
          purchases={purchaseReport}
          production={productionReport}
          sales={salesReport}
          expenses={expenseReport}
        />
      </section>

      {/* Dépenses par catégorie */}
      <section>
        <ExpenseCategoryChart report={expenseReport} />
      </section>

      {/* Situation financière */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-green-50 p-2">
              <Wallet size={19} className="text-green-700" />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              Situation financière
            </h2>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Synthèse des résultats financiers sur la période sélectionnée.
          </p>
        </div>

        <FinancialReportCards report={financialReport} />
      </section>

      {/* Pied de rapport */}
      <footer className="border-t border-gray-200 pt-5 text-center">
        <p className="text-xs font-semibold text-gray-500">
          Cacao Sambirano ERP
        </p>
        <p className="mt-1 text-[11px] text-gray-400">
          Rapport généré automatiquement à partir des données de l'entreprise.
        </p>
      </footer>
    </div>
  );
}
