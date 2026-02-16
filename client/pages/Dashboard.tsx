import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Wallet,
  Baby,
  Store,
  Phone,
  Bell,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { getAuthHeaders } from "@/store/auth";

interface Task { id: string; title: string; status: string; dueDate?: string }
interface Summary { total: number; byCategory: Record<string, number> }

export default function Dashboard() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expenseSummary, setExpenseSummary] = useState<Summary | null>(null);
  const [notifications, setNotifications] = useState<{ id: string; title: string; isRead: boolean }[]>([]);

  useEffect(() => {
    const headers = getAuthHeaders();
    Promise.all([
      fetch("/api/tasks", { headers }).then((r) => r.json()),
      fetch("/api/expenses/summary", { headers }).then((r) => r.json()),
      fetch("/api/notifications", { headers }).then((r) => r.json()),
    ]).then(([t, e, n]) => {
      setTasks(Array.isArray(t) ? t.filter((x: Task) => x.status !== "COMPLETED").slice(0, 5) : []);
      setExpenseSummary(e?.total !== undefined ? e : null);
      setNotifications(Array.isArray(n) ? n.slice(0, 5) : []);
    });
  }, []);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Hello, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Here&apos;s what&apos;s happening with your home today
        </p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { path: "/tasks", icon: CheckSquare, label: "Today's Tasks", value: String(tasks.length), colorClass: "bg-rose-100 dark:bg-rose-950/50 text-rose-600" },
          { path: "/expenses", icon: Wallet, label: "Monthly Spend", value: expenseSummary ? `EGP ${expenseSummary.total.toLocaleString()}` : "—", colorClass: "bg-lavender-100 dark:bg-lavender-950/50 text-lavender-600" },
          { path: "/kids", icon: Baby, label: "Kids", value: "—", colorClass: "bg-gold-100 dark:bg-gold-900/30 text-gold-600" },
          { path: "/marketplace", icon: Store, label: "Book Service", value: "View", colorClass: "bg-rose-100 dark:bg-rose-950/50 text-rose-600" },
        ].map((b) => {
          const Icon = b.icon;
          return (
            <motion.div key={b.path} variants={item}>
              <Link to={b.path}>
                <Card className="glass hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">{b.label}</p>
                      <p className="text-2xl font-bold mt-1">{b.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${b.colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Today&apos;s Tasks
              </CardTitle>
              <Button size="sm" variant="ghost" asChild>
                <Link to="/tasks">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No pending tasks. Add one!</p>
              ) : (
                <ul className="space-y-3">
                  {tasks.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50"
                    >
                      <span className="font-medium">{t.title}</span>
                      <span className="text-xs text-zinc-500">{t.status}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Button variant="ghost" className="w-full mt-4" asChild>
                <Link to="/tasks">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No new notifications</p>
              ) : (
                <ul className="space-y-2">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`p-3 rounded-xl ${!n.isRead ? "bg-rose-50 dark:bg-rose-950/30" : "bg-zinc-50 dark:bg-zinc-800/50"}`}
                    >
                      <p className="text-sm">{n.title}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card className="glass bg-gradient-to-r from-rose-50 to-lavender-50 dark:from-rose-950/30 dark:to-lavender-950/30 border-rose-200/50">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-rose-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Need help fast?</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Book a service or call emergency</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/marketplace">
                  <Store className="w-4 h-4 mr-2" /> Book Service
                </Link>
              </Button>
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" /> Emergency
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
