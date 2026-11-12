
import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Receipt,
  Wallet,
  FileText,
  X,
} from "lucide-react";

import { toast } from "sonner";

import type {
  Expense,
  CreateExpenseInput,
} from "../expenses.types";

import {
  getExpenses,
  createExpense,
  updateExpense,
  updateExpenseStatus,
  deleteExpense,
} from "../expenses.service";

import { getExpenseStats } from "../expenses.stats";

import ExpenseStatsCards from "../components/ExpenseStatsCards";
import ExpensesTable from "../components/ExpensesTable";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseDetails from "../components/ExpenseDetails";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  useEffect(() => {
    refreshExpenses();
  }, []);

  function refreshExpenses() {
    setExpenses(getExpenses());
  }

  const filteredExpenses = expenses.filter((expense) => {
    const searchValue = search.trim().toLowerCase();

    return (
      expense.numero.toLowerCase().includes(searchValue) ||
      expense.libelle.toLowerCase().includes(searchValue) ||
      expense.beneficiaire.toLowerCase().includes(searchValue)
    );
  });

  const stats = getExpenseStats();

  function handleOpenCreateForm() {
    setEditingExpense(null);
    setShowForm(true);
  }

  function handleOpenEditForm(expense: Expense) {
    setEditingExpense(expense);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingExpense(null);
  }

  function handleSubmitExpense(input: CreateExpenseInput) {
    try {
      if (editingExpense) {
        updateExpense(editingExpense.id, input);

        toast.success(
          `La dépense ${editingExpense.numero} a été modifiée.`,
        );
      } else {
        const expense = createExpense(input);

        toast.success(
          `La dépense ${expense.numero} a été enregistrée.`,
        );
      }

      handleCloseForm();
      refreshExpenses();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer la dépense.",
      );
    }
  }

  function handleValidateExpense(expense: Expense) {
    const confirmed = window.confirm(
      `Voulez-vous valider la dépense ${expense.numero} ?`,
    );

    if (!confirmed) return;

    try {
      updateExpenseStatus(expense.id, "VALIDEE");
      refreshExpenses();

      toast.success(`La dépense ${expense.numero} a été validée.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de valider cette dépense.",
      );
    }
  }

  function handleCancelExpense(expense: Expense) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment annuler la dépense ${expense.numero} ?`,
    );

    if (!confirmed) return;

    try {
      updateExpenseStatus(expense.id, "ANNULEE");
      refreshExpenses();

      toast.success(`La dépense ${expense.numero} a été annulée.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible d'annuler cette dépense.",
      );
    }
  }

  function handleDeleteExpense(expense: Expense) {
    const confirmed = window.confirm(
      `Voulez-vous supprimer définitivement la dépense ${expense.numero} ?`,
    );

    if (!confirmed) return;

    try {
      deleteExpense(expense.id);

      if (selectedExpense?.id === expense.id) {
        setSelectedExpense(null);
      }

      refreshExpenses();

      toast.success(`La dépense ${expense.numero} a été supprimée.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer cette dépense.",
      );
    }
  }

  return (
    <div className="space-y-7 pb-8">
      {/* En-tête */}
      <div className="relative overflow-hidden rounded-2xl bg-[#103F26] p-6 shadow-lg shadow-green-950/10 sm:p-8">
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-yellow-400/10" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-green-100">
              <Wallet size={14} className="text-yellow-400" />
              Gestion financière
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Gestion des dépenses
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-green-100/80">
              Enregistrez les charges, contrôlez les dépenses et suivez
              les mouvements financiers de votre entreprise.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateForm}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E5B54B] px-5 py-3 text-sm font-bold text-[#103F26] shadow-md shadow-black/10 transition hover:bg-yellow-300 active:scale-[0.98]"
          >
            <Plus size={19} />
            Nouvelle dépense
          </button>
        </div>

        <div className="relative mt-7 flex flex-wrap items-center gap-4 border-t border-white/15 pt-5 text-xs text-green-100/80">
          <span className="inline-flex items-center gap-2">
            <Receipt size={15} className="text-yellow-400" />
            {expenses.length} dépense(s) enregistrée(s)
          </span>

          <span className="hidden h-4 w-px bg-white/20 sm:block" />

          <span className="inline-flex items-center gap-2">
            <FileText size={15} className="text-yellow-400" />
            Suivi et contrôle des charges
          </span>
        </div>
      </div>

      {/* Statistiques */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Vue financière
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Résumé des dépenses enregistrées.
          </p>
        </div>

        <ExpenseStatsCards stats={stats} />
      </section>

      {/* Historique */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <Receipt size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Historique des dépenses
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Consultez et gérez les dépenses de l'entreprise.
                </p>
              </div>
            </div>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par référence, libellé..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-10 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="px-5 pt-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              Résultats de recherche
            </p>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
              {filteredExpenses.length} résultat(s)
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <ExpensesTable
            expenses={filteredExpenses}
            onEdit={handleOpenEditForm}
            onDelete={handleDeleteExpense}
            onView={setSelectedExpense}
            onValidate={handleValidateExpense}
            onCancel={handleCancelExpense}
          />
        </div>
      </section>

      {/* Formulaire de création et modification */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-950/60 p-3 backdrop-blur-sm sm:p-5">
          <div className="my-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="relative overflow-hidden bg-[#103F26] px-6 py-6">
              <div className="absolute -right-8 -top-16 h-40 w-40 rounded-full bg-white/5" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-green-100">
                    <Receipt size={15} className="text-yellow-400" />
                    Gestion financière
                  </div>

                  <h2 className="text-xl font-extrabold text-white">
                    {editingExpense
                      ? "Modifier la dépense"
                      : "Nouvelle dépense"}
                  </h2>

                  <p className="mt-1 text-sm text-green-100/75">
                    {editingExpense
                      ? `Modification de ${editingExpense.numero}`
                      : "Renseignez les informations de la dépense."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseForm}
                  aria-label="Fermer le formulaire"
                  className="rounded-xl border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-transparent" />
            </div>

            <div className="p-5 sm:p-6">
              <ExpenseForm
                key={editingExpense?.id ?? "new-expense"}
                initialData={editingExpense ?? undefined}
                onSubmit={handleSubmitExpense}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Détails */}
      {selectedExpense && (
        <ExpenseDetails
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
}
