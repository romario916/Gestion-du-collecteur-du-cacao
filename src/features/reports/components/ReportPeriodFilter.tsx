
import { CalendarDays, Filter, Clock3 } from "lucide-react";

import type { ReportPeriod } from "../reports.types";

interface ReportPeriodFilterProps {
  period: ReportPeriod;
  onChange: (period: ReportPeriod) => void;
}

function getMonthStart(date: Date): string {
  return new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
}

function getMonthEnd(date: Date): string {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);
}

export default function ReportPeriodFilter({
  period,
  onChange,
}: ReportPeriodFilterProps) {
  function handlePresetChange(value: string) {
    const today = new Date();

    if (value === "this-month") {
      onChange({
        dateDebut: getMonthStart(today),
        dateFin: today.toISOString().slice(0, 10),
      });
      return;
    }

    if (value === "last-month") {
      const previousMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      );

      onChange({
        dateDebut: getMonthStart(previousMonth),
        dateFin: getMonthEnd(previousMonth),
      });
      return;
    }

    if (value === "this-year") {
      onChange({
        dateDebut: `${today.getFullYear()}-01-01`,
        dateFin: today.toISOString().slice(0, 10),
      });
    }
  }

  const inputClassName =
    "w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-3 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
        <div className="rounded-xl bg-green-50 p-2.5">
          <Filter size={19} className="text-green-800" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Filtrer les rapports
          </h3>

          <p className="mt-0.5 text-xs text-gray-500">
            Définissez la période de vos statistiques.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
        <div>
          <label
            htmlFor="report-start-date"
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600"
          >
            Date de début
          </label>

          <div className="relative">
            <CalendarDays
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700"
            />

            <input
              id="report-start-date"
              type="date"
              value={period.dateDebut}
              max={period.dateFin}
              onChange={(event) =>
                onChange({
                  ...period,
                  dateDebut: event.target.value,
                })
              }
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="report-end-date"
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600"
          >
            Date de fin
          </label>

          <div className="relative">
            <CalendarDays
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700"
            />

            <input
              id="report-end-date"
              type="date"
              value={period.dateFin}
              min={period.dateDebut}
              onChange={(event) =>
                onChange({
                  ...period,
                  dateFin: event.target.value,
                })
              }
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="report-preset"
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600"
          >
            Période prédéfinie
          </label>

          <div className="relative">
            <Clock3
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700"
            />

            <select
              id="report-preset"
              defaultValue=""
              onChange={(event) =>
                handlePresetChange(event.target.value)
              }
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
            >
              <option value="" disabled>
                Choisir une période
              </option>
              <option value="this-month">Ce mois</option>
              <option value="last-month">Mois précédent</option>
              <option value="this-year">Cette année</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-3">
        <CalendarDays size={14} className="text-green-700" />

        <span className="text-xs text-gray-500">
          Les statistiques sont actualisées selon la période sélectionnée.
        </span>
      </div>
    </div>
  );
}
