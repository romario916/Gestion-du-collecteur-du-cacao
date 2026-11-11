
import { useEffect, useState } from "react";

import {
  Plus,
  Search,
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
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-green-700">
            Gestion financière
          </p>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">
            Gestion des dépenses
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enregistrez les charges et suivez les dépenses de l'entreprise.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <Plus size={18} />
          Nouvelle dépense
        </button>
      </div>

      <ExpenseStatsCards stats={stats} />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-gray-900">
              Historique des dépenses
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Retrouvez toutes les dépenses enregistrées dans l'application.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une dépense..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        
<ExpensesTable
  expenses={filteredExpenses}
  onEdit={handleOpenEditForm}
  onDelete={handleDeleteExpense}
  onView={setSelectedExpense}
  onValidate={handleValidateExpense}
  onCancel={handleCancelExpense}
/>

      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-bold text-gray-900">
                {editingExpense ? "Modifier la dépense" : "Nouvelle dépense"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingExpense
                  ? `Modification de ${editingExpense.numero}`
                  : "Renseignez les informations de la dépense."}
              </p>
            </div>

            <div className="p-6">
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

      {selectedExpense && (
        <ExpenseDetails
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
}
