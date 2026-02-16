import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Home,
  Wallet,
  Baby,
  ShoppingCart,
  Store,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Home, title: "House Management", desc: "Tasks, cleaning, laundry & meal planning" },
  { icon: Wallet, title: "Budget & Expenses", desc: "Track spending with charts & reports" },
  { icon: Baby, title: "Kids & School", desc: "Homework, schedules & tuition" },
  { icon: ShoppingCart, title: "Smart Shopping", desc: "Lists, sync with supermarkets" },
  { icon: Store, title: "Home Services", desc: "Cleaning, plumbing, babysitter & more" },
];

export default function Index() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-lavender-50 to-rose-100 dark:from-zinc-950 dark:via-lavender-950/20 dark:to-rose-950/20 -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-200/30 dark:bg-rose-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lavender-200/30 dark:bg-lavender-500/10 rounded-full blur-3xl -z-10" />

      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-lavender-500 flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-rose-500/30">
            HQ
          </div>
          <span className="font-display font-bold text-2xl text-zinc-800 dark:text-zinc-100">
            Home Queen
          </span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Smart Family & Home Platform
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 bg-clip-text">
            Your Super App for
            <br />
            <span className="bg-gradient-to-r from-rose-500 to-lavender-500 bg-clip-text text-transparent">
              Family & Home
            </span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10">
            Manage household tasks, budget, kids, shopping, and book home services—all in one beautiful app.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/signup">
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass rounded-2xl p-6 border border-white/50 dark:border-zinc-700/50"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-2">{f.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{f.desc}</p>
              </motion.div>
            );
          })}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass rounded-2xl p-6 border border-white/50 dark:border-zinc-700/50 sm:col-span-2 lg:col-span-1 flex flex-col justify-center"
          >
            <div className="w-12 h-12 rounded-xl bg-lavender-100 dark:bg-lavender-950/50 flex items-center justify-center text-lavender-600 dark:text-lavender-400 mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-2">Community</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Connect with other women—tips, parenting, cooking & more
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
