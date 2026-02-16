import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Wrench,
  Zap,
  Hammer,
  Car,
  Baby,
  Package,
  Book,
  Star,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthHeaders } from "@/store/auth";
import { API_BASE } from "@/lib/api";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CLEANING: Sparkles,
  PLUMBING: Wrench,
  ELECTRICAL: Zap,
  CARPENTRY: Hammer,
  CAR_MECHANIC: Car,
  BABYSITTER: Baby,
  DELIVERY: Package,
  PRIVATE_TUTOR: Book,
};

interface Provider {
  id: string;
  user: { name: string; avatar?: string };
  service: { name: string; category: string; basePrice: number };
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
}

export default function Marketplace() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/services/categories`).then((r) => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    const url = filter ? `${API_BASE}/api/providers?category=${filter}` : `${API_BASE}/api/providers`;
    fetch(url, { headers: getAuthHeaders() })
      .then((r) => r.json())
      .then((d) => setProviders(Array.isArray(d) ? d : []));
  }, [filter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Home Services</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">Book cleaning, plumbing, babysitter & more</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            !filter
              ? "bg-rose-500 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          All
        </button>
        {categories.map((c) => {
          const Icon = CATEGORY_ICONS[c.id] || Sparkles;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === c.id
                  ? "bg-rose-500 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {c.name}
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p) => {
          const Icon = CATEGORY_ICONS[p.service.category] || Sparkles;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/marketplace/provider/${p.id}`}>
                <Card className="glass hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
                        <Icon className="w-7 h-7" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-semibold text-lg">{p.service.name}</h3>
                    <p className="text-zinc-500 text-sm mt-1">{p.user.name}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                      <span className="text-sm font-medium">{p.rating.toFixed(1)}</span>
                      <span className="text-xs text-zinc-500">({p.reviewCount} reviews)</span>
                    </div>
                    <p className="text-rose-600 font-semibold mt-2">
                      From EGP {p.service.basePrice}/session
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {providers.length === 0 && (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <p className="text-zinc-500">No providers found. Check back later!</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
