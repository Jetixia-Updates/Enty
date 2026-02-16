import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  Users,
  Download,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const featureKeys = [
  { icon: Home, key: "houseManagement", path: "/tasks" },
  { icon: Wallet, key: "budget", path: "/expenses" },
  { icon: Baby, key: "kids", path: "/kids" },
  { icon: ShoppingCart, key: "shopping", path: "/shopping" },
  { icon: Store, key: "services", path: "/marketplace" },
];

export default function Index() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-lavender-50 to-rose-100 dark:from-zinc-950 dark:via-lavender-950/20 dark:to-rose-950/20 -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-200/30 dark:bg-rose-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lavender-200/30 dark:bg-lavender-500/10 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-lavender-500 flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-rose-500/30">
            HQ
          </div>
          <span className="font-display font-bold text-2xl text-zinc-800 dark:text-zinc-100">
            {t("app.name")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button variant="ghost" asChild>
            <Link to="/login">{t("nav.login")}</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">{t("nav.signup")}</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <section className="py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t("app.tagline")}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
              {t("landing.hero")}
              <br />
              <span className="bg-gradient-to-r from-rose-500 to-lavender-500 bg-clip-text text-transparent">
                {t("landing.heroFor")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
              {t("landing.subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2 text-lg px-8" asChild>
                <Link to="/signup">
                  {t("landing.startFree")} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link to="/login">{t("nav.login")}</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Ads / Promo - Stats */}
        <section className="py-12 border-y border-rose-200/50 dark:border-rose-900/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {[
              { icon: Users, value: "50,000+", labelKey: "statsUsers" },
              { icon: Store, value: "500+", labelKey: "statsServices" },
              { icon: Heart, value: "10,000+", labelKey: "statsFamilies" },
              { icon: Star, value: "4.9", labelKey: "statsRating" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/40 backdrop-blur">
                  <Icon className="w-10 h-10 mx-auto text-rose-500 mb-2" />
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{s.value}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{t(`landing.${s.labelKey}`)}</p>
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* Features - Clickable */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-50">
            {t("landing.ctaTitle")}
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featureKeys.map((f, i) => {
              const Icon = f.icon;
              return (
                <Link key={f.key} to={f.path}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="glass rounded-2xl p-6 border border-white/50 dark:border-zinc-700/50 h-full cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 group-hover:bg-rose-200 dark:group-hover:bg-rose-900/50 transition-colors">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-2">
                      {t(`landing.features.${f.key}`)}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                      {t(`landing.features.${f.key}Desc`)}
                    </p>
                    <span className="text-rose-600 font-medium text-sm inline-flex items-center gap-1">
                      {t("dashboard.view")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </span>
                  </motion.div>
                </Link>
              );
            })}
            <Link to="/community">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass rounded-2xl p-6 border border-white/50 dark:border-zinc-700/50 h-full cursor-pointer group sm:col-span-2 lg:col-span-1 flex flex-col justify-center"
              >
                <div className="w-14 h-14 rounded-xl bg-lavender-100 dark:bg-lavender-950/50 flex items-center justify-center text-lavender-600 dark:text-lavender-400 mb-4 group-hover:bg-lavender-200 dark:group-hover:bg-lavender-900/50 transition-colors">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-2">
                  {t("landing.features.community")}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                  {t("landing.features.communityDesc")}
                </p>
                <span className="text-rose-600 font-medium text-sm inline-flex items-center gap-1">
                  {t("dashboard.view")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </span>
              </motion.div>
            </Link>
          </motion.div>
        </section>

        {/* About / Who Built - Ads Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-r from-rose-500/10 via-lavender-500/10 to-rose-500/10 dark:from-rose-950/50 dark:via-lavender-950/50 dark:to-rose-950/50 p-8 md:p-12 border border-rose-200/50 dark:border-rose-900/30"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                {t("landing.aboutTitle")}
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                {t("landing.aboutDesc")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-zinc-800/80">
                  <Shield className="w-5 h-5 text-rose-500" />
                  <span className="font-medium">{t("landing.safe")}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-zinc-800/80">
                  <Zap className="w-5 h-5 text-lavender-500" />
                  <span className="font-medium">{t("landing.fast")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Partners / CTA */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              {t("landing.ctaTitle")}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">{t("landing.ctaDesc")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/signup">
                  {t("landing.startFree")} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Download className="w-5 h-5" /> {t("landing.downloadApp")}
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
          © 2025 Jetixia – {t("app.name")}
        </footer>
      </main>
    </div>
  );
}
