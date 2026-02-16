import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getAuthHeaders } from "@/store/auth";
import { API_BASE } from "@/lib/api";

const CATEGORIES = [
  "FOOD",
  "BILLS",
  "EDUCATION",
  "HEALTH",
  "TRANSPORT",
  "SHOPPING",
  "ENTERTAINMENT",
  "OTHER",
];

const COLORS = ["#f43f5e", "#a855f7", "#f59e0b", "#22c55e", "#3b82f6", "#ec4899", "#14b8a6", "#64748b"];

export default function Expenses() {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState<{ id: string; amount: number; category: string; description?: string; date: string }[]>([]);
  const [summary, setSummary] = useState<{ total: number; byCategory: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: "", category: "FOOD", description: "" });

  const headers = getAuthHeaders();

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/expenses`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/expenses/summary`, { headers }).then((r) => r.json()),
    ]).then(([e, s]) => {
      setExpenses(Array.isArray(e) ? e : []);
      setSummary(s?.total !== undefined ? s : null);
    }).finally(() => setLoading(false));
  }, [showForm]);

  async function addExpense(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return;
    await fetch(`${API_BASE}/api/expenses`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        category: form.category,
        description: form.description || undefined,
      }),
    });
    setForm({ amount: "", category: "FOOD", description: "" });
    setShowForm(false);
    const [eRes, sRes] = await Promise.all([
      fetch(`${API_BASE}/api/expenses`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/expenses/summary`, { headers }).then((r) => r.json()),
    ]);
    setExpenses(Array.isArray(eRes) ? eRes : []);
    setSummary(sRes?.total !== undefined ? sRes : null);
  }

  const chartData = summary?.byCategory
    ? Object.entries(summary.byCategory).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{t("expenses.title")}</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">{t("expenses.subtitle")}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t("expenses.addExpense")}
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>{t("expenses.newExpense")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addExpense} className="space-y-4">
                <div>
                  <Label>{t("expenses.amount")}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="100"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>{t("expenses.category")}</Label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="mt-2 flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {t(`expenses.${c.toLowerCase()}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>{t("expenses.description")}</Label>
                  <Input
                    placeholder="e.g. Groceries"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{t("expenses.save")}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    {t("expenses.cancel")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" /> {t("expenses.thisMonth")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-rose-600">
              EGP {summary?.total?.toLocaleString() ?? "0"}
            </p>
            {chartData.length > 0 && (
              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name }) => t(`expenses.${name.toLowerCase()}`)}
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `EGP ${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>{t("expenses.recent")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-zinc-500">{t("common.loading")}</p>
            ) : expenses.length === 0 ? (
              <p className="text-zinc-500 py-8">{t("expenses.noExpenses")}</p>
            ) : (
              <ul className="space-y-2">
                {expenses.slice(0, 10).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50"
                  >
                    <div>
                      <p className="font-medium">{t(`expenses.${e.category.toLowerCase()}`)}</p>
                      {e.description && (
                        <p className="text-sm text-zinc-500">{e.description}</p>
                      )}
                    </div>
                    <span className="font-semibold text-rose-600">
                      EGP {e.amount.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
