import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ShoppingCart, Package, Plus, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthHeaders } from "@/store/auth";
import { API_BASE } from "@/lib/api";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  isPurchased: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
}

export default function Shopping() {
  const { t } = useTranslation();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeList, setActiveList] = useState<ShoppingList | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [loading, setLoading] = useState(true);

  const headers = getAuthHeaders();

  async function loadLists() {
    const r = await fetch(`${API_BASE}/api/shopping/lists`, { headers });
    const data = await r.json();
    setLists(Array.isArray(data) ? data : []);
    if (data?.[0] && !activeList) setActiveList(data[0]);
  }

  useEffect(() => {
    loadLists().finally(() => setLoading(false));
  }, []);

  async function createList() {
    const r = await fetch(`${API_BASE}/api/shopping/lists`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ name: `${t("shopping.addList")} ${lists.length + 1}` }),
    });
    if (r.ok) {
      const list = await r.json();
      setLists((prev) => [...prev, { ...list, items: [] }]);
      setActiveList({ ...list, items: [] });
    }
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemName.trim() || !activeList) return;
    const r = await fetch(`${API_BASE}/api/shopping/lists/${activeList.id}/items`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItemName.trim() }),
    });
    if (r.ok) {
      const item = await r.json();
      setActiveList((prev) => (prev ? { ...prev, items: [...prev.items, item] } : null));
      setNewItemName("");
    }
  }

  async function togglePurchased(item: ShoppingItem) {
    const r = await fetch(`${API_BASE}/api/shopping/items/${item.id}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ isPurchased: !item.isPurchased }),
    });
    if (r.ok && activeList) {
      setActiveList({
        ...activeList,
        items: activeList.items.map((i) =>
          i.id === item.id ? { ...i, isPurchased: !i.isPurchased } : i
        ),
      });
    }
  }

  async function deleteItem(id: string) {
    await fetch(`${API_BASE}/api/shopping/items/${id}`, { method: "DELETE", headers });
    if (activeList) {
      setActiveList({
        ...activeList,
        items: activeList.items.filter((i) => i.id !== id),
      });
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{t("shopping.title")}</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">{t("shopping.subtitle")}</p>
        </div>
        <Button onClick={createList}>
          <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t("shopping.addList")}
        </Button>
      </div>

      {loading ? (
        <p className="text-zinc-500">{t("common.loading")}</p>
      ) : lists.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-rose-400 mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{t("shopping.listsDesc")}</p>
            <Button onClick={createList}>
              <Plus className="w-4 h-4 mr-2" /> {t("shopping.addList")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>{t("shopping.lists")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lists.map((list) => (
                  <li key={list.id}>
                    <button
                      onClick={() => setActiveList(list)}
                      className={`w-full text-start px-4 py-2 rounded-xl transition-colors ${
                        activeList?.id === list.id
                          ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {list.name}
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {activeList && (
            <Card className="glass lg:col-span-2">
              <CardHeader>
                <CardTitle>{activeList.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={addItem} className="flex gap-2">
                  <Input
                    placeholder={t("shopping.itemPlaceholder")}
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newItemName.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </form>
                <ul className="space-y-2">
                  {activeList.items.map((item) => (
                    <li
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        item.isPurchased ? "bg-zinc-100 dark:bg-zinc-800/50 opacity-75" : "bg-zinc-50 dark:bg-zinc-800/30"
                      }`}
                    >
                      <button onClick={() => togglePurchased(item)}>
                        {item.isPurchased ? (
                          <Check className="w-5 h-5 text-rose-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-zinc-400" />
                        )}
                      </button>
                      <span className={`flex-1 ${item.isPurchased ? "line-through text-zinc-500" : ""}`}>
                        {item.name} {item.quantity > 1 && `× ${item.quantity}`}
                      </span>
                      <button onClick={() => deleteItem(item.id)}>
                        <Trash2 className="w-4 h-4 text-zinc-500 hover:text-rose-500" />
                      </button>
                    </li>
                  ))}
                </ul>
                {activeList.items.length === 0 && (
                  <p className="text-zinc-500 text-center py-8">{t("shopping.noItems")}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </motion.div>
  );
}
