import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthHeaders } from "@/store/auth";
import { API_BASE } from "@/lib/api";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: number;
  dueDate?: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  async function load() {
    const r = await fetch(`${API_BASE}/api/tasks`, { headers: getAuthHeaders() });
    const data = await r.json();
    setTasks(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const r = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      if (r.ok) {
        setNewTitle("");
        await load();
      }
    } finally {
      setAdding(false);
    }
  }

  async function toggleStatus(task: Task) {
    const next = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    await fetch(`${API_BASE}/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    await load();
  }

  async function deleteTask(id: string) {
    await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE", headers: getAuthHeaders() });
    await load();
  }

  const pending = tasks.filter((t) => t.status !== "COMPLETED");
  const completed = tasks.filter((t) => t.status === "COMPLETED");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Tasks</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">Manage your household tasks</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Add task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTask} className="flex gap-2">
            <Input
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={adding || !newTitle.trim()}>
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : (
        <>
          <Card className="glass">
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="popLayout">
                {pending.length === 0 ? (
                  <p className="text-zinc-500 py-4">No pending tasks</p>
                ) : (
                  <ul className="space-y-2">
                    {pending.map((t) => (
                      <motion.li
                        key={t.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <button onClick={() => toggleStatus(t)} className="text-zinc-400 hover:text-rose-500">
                          <Circle className="w-5 h-5" />
                        </button>
                        <span className="flex-1 font-medium">{t.title}</span>
                        <Button variant="ghost" size="icon" onClick={() => deleteTask(t.id)}>
                          <Trash2 className="w-4 h-4 text-zinc-500" />
                        </Button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {completed.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {completed.map((t) => (
                    <motion.li
                      key={t.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 opacity-75"
                    >
                      <button onClick={() => toggleStatus(t)} className="text-rose-500">
                        <Check className="w-5 h-5" />
                      </button>
                      <span className="flex-1 line-through text-zinc-500">{t.title}</span>
                      <Button variant="ghost" size="icon" onClick={() => deleteTask(t.id)}>
                        <Trash2 className="w-4 h-4 text-zinc-500" />
                      </Button>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </motion.div>
  );
}
