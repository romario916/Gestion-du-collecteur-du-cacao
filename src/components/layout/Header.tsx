
import { useState } from "react";
import {
  Bell,
  Menu,
  Search,
  ChevronDown,
  UserRound,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../features/auth/auth.service";

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/producers": "Producteurs",
  "/purchases": "Achats",
  "/batches": "Lots de cacao",
  "/processing": "Transformation",
  "/inventory": "Gestion des stocks",
  "/customers": "Clients",
  "/sales": "Ventes",
  "/expenses": "Dépenses",
  "/finance": "Finances",
  "/reports": "Rapports",
  "/users": "Utilisateurs",
  "/settings": "Paramètres",
};

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const pageTitle =
    pageTitles[location.pathname] ?? "Cacao Sambirano";

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="truncate text-lg font-bold text-[#17251B] sm:text-xl">
            {pageTitle}
          </h2>
          <p className="hidden text-xs text-gray-400 sm:block">
            Gestion de votre activité agricole
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 md:flex">
          <Search size={17} className="text-gray-400" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="w-36 bg-transparent text-sm outline-none placeholder:text-gray-400 lg:w-48"
            aria-label="Rechercher"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            aria-label="Notifications"
            className="relative rounded-xl border border-gray-100 p-2.5 text-gray-500 transition hover:bg-gray-50"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-14 w-64 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
              <p className="text-sm font-semibold text-gray-800">
                Notifications
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Aucune nouvelle notification pour le moment.
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14532D] text-white">
              <UserRound size={18} />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-gray-800">
                {user?.nom ?? "Utilisateur"}
              </p>
              <p className="text-[10px] text-gray-400">
                {user ? ROLE_LABELS[user.role] : ""}
              </p>
            </div>

            <ChevronDown size={15} className="hidden text-gray-400 sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.nom}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {user?.email}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
