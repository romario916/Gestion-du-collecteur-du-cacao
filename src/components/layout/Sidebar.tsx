
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

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
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
          `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
            isActive
              ? "bg-white/15 text-white shadow-sm"
              : "text-green-100/75 hover:bg-white/10 hover:text-white"
          }`
        }
      >
        <Icon size={19} strokeWidth={1.8} />
        <span>{label}</span>
      </NavLink>
    ));

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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#14532D] text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Leaf size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Cacao Sambirano
              </h1>
              <p className="text-[10px] uppercase tracking-[2px] text-green-200">
                Agriculture Management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-2 text-green-100 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-7">
          <div>
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-green-200/60">
              Général
            </p>
            <div className="space-y-1">
              {renderNavigation(mainNavigation)}
            </div>
          </div>

          <div>
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-green-200/60">
              Mon compte
            </p>
            <div className="space-y-1">
              <NavLink
                to="/profile"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-green-100/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <UserCircle size={19} strokeWidth={1.8} />
                <span>Mon profil</span>
              </NavLink>
            </div>
          </div>

          {hasBusinessItems && (
            <div>
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-green-200/60">
                Gestion commerciale
              </p>
              <div className="space-y-1">
                {renderNavigation(businessNavigation)}
              </div>
            </div>
          )}

          {hasAdministrationItems && (
            <div>
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-green-200/60">
                Administration
              </p>
              <div className="space-y-1">
                {renderNavigation(administrationNavigation)}
              </div>
            </div>
          )}
        </nav>

        <div className="border-t border-white/10 p-5">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-sm font-semibold">
              Cacao Sambirano
            </p>
            <p className="mt-1 text-xs text-green-100/70">
              Gestion intégrée de la filière cacao.
            </p>
          </div>
          <p className="mt-4 text-center text-[10px] text-green-200/50">
            © 2026 Cacao Sambirano
          </p>
        </div>
      </aside>
    </>
  );
}
