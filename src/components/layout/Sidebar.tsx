
import {
  LayoutDashboard,
  Users,
  Sprout,
  ShoppingBasket,
  Package,
  Workflow,
  Warehouse,
  UserRound,
  ShoppingCart,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  Leaf,
  X,
  UserCircle,
  type LucideIcon,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canAccessModule } from "../../features/auth/permissions";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const mainNavigation: NavigationItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Producteurs", path: "/producers", icon: Sprout },
  { label: "Achats", path: "/purchases", icon: ShoppingBasket },
  { label: "Lots de cacao", path: "/batches", icon: Package },
  { label: "Transformation", path: "/processing", icon: Workflow },
  { label: "Stocks", path: "/inventory", icon: Warehouse },
];

const businessNavigation: NavigationItem[] = [
  { label: "Clients", path: "/customers", icon: UserRound },
  { label: "Ventes", path: "/sales", icon: ShoppingCart },
  { label: "Dépenses", path: "/expenses", icon: Wallet },
  { label: "Finances", path: "/finance", icon: ChartNoAxesCombined },
  { label: "Rapports", path: "/reports", icon: ChartNoAxesCombined },
];

const administrationNavigation: NavigationItem[] = [
  { label: "Utilisateurs", path: "/users", icon: Users },
  { label: "Paramètres", path: "/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const visibleItems = (items: NavigationItem[]) =>
    items.filter((item) => {
      if (item.path === "/") return true;

      return user
        ? canAccessModule(item.path.slice(1), user.role)
        : false;
    });

  const renderNavigation = (items: NavigationItem[]) =>
    visibleItems(items).map(({ label, path, icon: Icon }) => (
      <NavLink
        key={path}
        to={path}
        end={path === "/"}
        onClick={onClose}
        className={({ isActive }) =>
          `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
            isActive
              ? "bg-white/15 text-white shadow-sm"
              : "text-green-100/75 hover:bg-white/10 hover:text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-accent-400" />
            )}

            <Icon
              size={19}
              strokeWidth={isActive ? 2.2 : 1.8}
              className={
                isActive
                  ? "text-accent-400"
                  : "text-green-200/80 transition-colors group-hover:text-white"
              }
            />

            <span className="flex-1">{label}</span>

            {isActive && (
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            )}
          </>
        )}
      </NavLink>
    ));

  const renderSectionTitle = (title: string) => (
    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-green-200/50">
      {title}
    </p>
  );

  const hasBusinessItems = visibleItems(businessNavigation).length > 0;
  const hasAdministrationItems =
    visibleItems(administrationNavigation).length > 0;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#103F26] text-white shadow-2xl shadow-green-950/20 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500 text-green-950 shadow-lg shadow-black/10">
              <Leaf size={25} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-[17px] font-extrabold tracking-tight text-white">
                Cacao Sambirano
              </h1>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[2px] text-green-200/70">
                Agriculture Management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-2 text-green-100 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          <div>
            {renderSectionTitle("Général")}
            <div className="space-y-1">
              {renderNavigation(mainNavigation)}
            </div>
          </div>

          <div>
            {renderSectionTitle("Mon compte")}
            <div className="space-y-1">
              <NavLink
                to="/profile"
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-green-100/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-accent-400" />
                    )}

                    <UserCircle
                      size={19}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={
                        isActive
                          ? "text-accent-400"
                          : "text-green-200/80 group-hover:text-white"
                      }
                    />

                    <span>Mon profil</span>
                  </>
                )}
              </NavLink>
            </div>
          </div>

          {hasBusinessItems && (
            <div>
              {renderSectionTitle("Gestion commerciale")}
              <div className="space-y-1">
                {renderNavigation(businessNavigation)}
              </div>
            </div>
          )}

          {hasAdministrationItems && (
            <div>
              {renderSectionTitle("Administration")}
              <div className="space-y-1">
                {renderNavigation(administrationNavigation)}
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/10 p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-400" />
              <p className="text-xs font-bold text-white">
                Cacao Sambirano
              </p>
            </div>

            <p className="mt-2 text-[11px] leading-relaxed text-green-100/60">
              Gestion intégrée de la filière cacao.
            </p>
          </div>

          <p className="mt-4 text-center text-[10px] font-medium tracking-wide text-green-200/40">
            © 2026 Cacao Sambirano
          </p>
        </div>
      </aside>
    </>
  );
}
