
import { useState } from "react";
import {
  Bell,
  Menu,
  Search,
  ChevronDown,
  UserRound,
  LogOut,
  Leaf,
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
  "/profile": "Mon profil",
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
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200/70 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Page title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition-all hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Leaf
              size={17}
              className="hidden shrink-0 text-brand-600 sm:block"
            />

            <h2 className="truncate text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              {pageTitle}
            </h2>
          </div>

          <p className="mt-0.5 hidden text-xs font-medium text-gray-400 sm:block">
            Gestion de votre activité agricole
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3.5 py-2.5 transition-all focus-within:border-brand-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-50 md:flex">
          <Search size={17} className="shrink-0 text-gray-400" />

          <input
            type="search"
            placeholder="Rechercher..."
            className="w-36 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 lg:w-48"
            aria-label="Rechercher"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            aria-label="Notifications"
            aria-expanded={showNotifications}
            className={`relative rounded-xl border p-2.5 transition-all ${
              showNotifications
                ? "border-brand-200 bg-brand-50 text-brand-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <p className="text-sm font-bold text-gray-900">
                  Notifications
                </p>

                <span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700">
                  Récent
                </span>
              </div>

              <div className="py-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  <Bell size={18} className="text-gray-400" />
                </div>

                <p className="mt-2 text-xs font-medium text-gray-500">
                  Aucune nouvelle notification pour le moment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="relative border-l border-gray-200 pl-2 sm:pl-3">
          <button
            type="button"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            aria-expanded={showProfile}
            className={`flex items-center gap-2 rounded-xl p-1.5 transition-all ${
              showProfile ? "bg-brand-50" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-white shadow-sm">
              <UserRound size={19} strokeWidth={2} />
            </div>

            <div className="hidden max-w-32 text-left sm:block">
              <p className="truncate text-xs font-bold text-gray-800">
                {user?.nom ?? "Utilisateur"}
              </p>

              <p className="mt-0.5 truncate text-[10px] font-medium text-gray-400">
                {user ? ROLE_LABELS[user.role] : ""}
              </p>
            </div>

            <ChevronDown
              size={15}
              className={`hidden text-gray-400 transition-transform sm:block ${
                showProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 z-50 w-60 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl shadow-gray-200/50">
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-900 text-white">
                    <UserRound size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {user?.nom ?? "Utilisateur"}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <p className="mt-3 inline-flex rounded-lg bg-brand-100 px-2.5 py-1 text-[10px] font-semibold text-brand-800">
                  {user ? ROLE_LABELS[user.role] : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={17} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
