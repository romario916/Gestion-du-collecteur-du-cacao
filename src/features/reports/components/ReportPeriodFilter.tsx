
import { CalendarDays, Filter } from "lucide-react";

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

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Filter size={18} className="text-blue-600" />

        <h3 className="font-semibold text-gray-900">
          Filtrer les rapports
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="report-start-date"
            className="mb-2 block text-sm font-medium text-gray-600"
          >
            Date de début
          </label>

          <div className="relative">
            <CalendarDays
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="report-end-date"
            className="mb-2 block text-sm font-medium text-gray-600"
          >
            Date de fin
          </label>

          <div className="relative">
            <CalendarDays
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="report-preset"
            className="mb-2 block text-sm font-medium text-gray-600"
          >
            Période prédéfinie
          </label>

          <select
            id="report-preset"
            defaultValue=""
            onChange={(event) =>
              handlePresetChange(event.target.value)
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
  );
}
