import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  ShoppingCart,
  Store,
  Baby,
  Users,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

const navKeys = ["dashboard", "tasks", "expenses", "shopping", "services", "kids", "community"] as const;
const navPaths = ["/dashboard", "/tasks", "/expenses", "/shopping", "/marketplace", "/kids", "/community"];
const navIcons = [LayoutDashboard, CheckSquare, Wallet, ShoppingCart, Store, Baby, Users];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const isRtl = document.documentElement.dir === "rtl";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="w-full lg:w-64 glass border-b lg:border-b-0 lg:border-r border-zinc-200/50 dark:border-zinc-800/50 p-4">
        <div className="flex items-center justify-between mb-8 px-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-lavender-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-rose-500/30">
              HQ
            </div>
            <span className="font-display font-bold text-xl text-zinc-800 dark:text-zinc-100">
              {t("app.name")}
            </span>
          </Link>
          <LanguageSwitcher />
        </div>

        <nav className="space-y-1">
          {navPaths.map((path, i) => {
            const isActive = location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(path));
            const Icon = navIcons[i];
            const key = navKeys[i];
            return (
              <Link key={path} to={path}>
                <motion.div
                  whileHover={{ x: isRtl ? -4 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                    isActive
                      ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{t(`nav.${key}`)}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{user?.name}</p>
            <p className="text-xs text-zinc-500">{user?.email || user?.phone}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start" onClick={logout}>
            <LogOut className="w-4 h-4" />
            {t("nav.logout")}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
