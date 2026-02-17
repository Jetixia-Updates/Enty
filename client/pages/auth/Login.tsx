import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.hint ? `${data.error}: ${data.hint}` : data.detail ? `${data.error}: ${data.detail}` : (data.error || "Login failed");
        throw new Error(msg);
      }
      setAuth(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-lavender-50 to-rose-100 dark:from-zinc-950 dark:via-lavender-950/20 dark:to-rose-950/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass border-white/50 relative">
          <div className="absolute top-4 end-4">
            <LanguageSwitcher />
          </div>
          <CardHeader className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 justify-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-lavender-500 flex items-center justify-center text-white font-bold text-lg">
                HQ
              </div>
              <span className="font-bold text-xl">{t("app.name")}</span>
            </Link>
            <CardTitle className="text-2xl">{t("auth.welcomeBack")}</CardTitle>
            <CardDescription>{t("auth.signIn")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-sm">
                  {error}
                </div>
              )}
              <div>
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("auth.signingIn") : t("auth.signInBtn")}
              </Button>
              <p className="text-center text-sm text-zinc-500">
                {t("auth.noAccount")}{" "}
                <Link to="/signup" className="text-rose-600 hover:underline font-medium">
                  {t("auth.signUpBtn")}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
