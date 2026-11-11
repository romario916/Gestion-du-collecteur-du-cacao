
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage";

import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./features/dashboard/DashboardPage";
import ModulePage from "./features/ModulePage";
import UsersPage from "./features/users/pages/UsersPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import ProducersPage from "./features/producers/pages/ProducersPage";
import PurchasesPage from "./features/purchases/PurchasesPage";
import BatchesPage from "./features/batches/BatchesPage";
import ProcessingPage from "./features/processing/ProcessingPage";
import InventoryPage from "./features/inventory/InventoryPage";
import CustomersPage from "./features/customers/CustomersPage";
import SalesPage from "./features/sales/pages/SalesPage";
import ExpensesPage from "./features/expenses/pages/ExpensesPage";
import FinancePage from "./features/finance/pages/FinancePage";
import ReportsPage from "./features/reports/pages/ReportsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="producers" element={<ProducersPage />} />
              <Route path="purchases" element={<PurchasesPage />} />
              <Route path="batches" element={<BatchesPage />} />
              <Route path="processing" element={<ProcessingPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="reports" element={<ReportsPage />} />

              <Route path=":module" element={<ModulePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
