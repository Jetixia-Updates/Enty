import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Baby,
  BookOpen,
  Calendar,
  Plus,
  Trash2,
  Check,
  Circle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getAuthHeaders } from "@/store/auth";
import { API_BASE } from "@/lib/api";

type Tab = "profiles" | "homework" | "schedule";

interface KidProfile {
  id: string;
  name: string;
  birthDate: string | null;
  schoolName: string | null;
  grade: string | null;
  _count?: { homework: number };
}

interface Homework {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  isCompleted: boolean;
  kidId: string;
  kid?: KidProfile;
}

function formatDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function isOverdue(d: string) {
  const due = new Date(d);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export default function Kids() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("profiles");
  const [profiles, setProfiles] = useState<KidProfile[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [allHomework, setAllHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKidId, setSelectedKidId] = useState<string | null>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: "", birthDate: "", schoolName: "", grade: "" });
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Homework form
  const [homeworkForm, setHomeworkForm] = useState({ title: "", description: "", dueDate: "" });
  const [homeworkSubmitting, setHomeworkSubmitting] = useState(false);

  const headers = getAuthHeaders();

  async function loadProfiles() {
    const r = await fetch(`${API_BASE}/api/kids/profiles`, { headers });
    const data = await r.json();
    setProfiles(Array.isArray(data) ? data : []);
    if (!selectedKidId && data?.[0]) setSelectedKidId(data[0].id);
    if (selectedKidId && !data?.find((p: KidProfile) => p.id === selectedKidId)) setSelectedKidId(data?.[0]?.id ?? null);
  }

  async function loadHomework() {
    if (!selectedKidId) {
      setHomework([]);
      return;
    }
    const r = await fetch(`${API_BASE}/api/kids/profiles/${selectedKidId}/homework`, { headers });
    const data = await r.json();
    setHomework(Array.isArray(data) ? data : []);
  }

  async function loadAllHomework() {
    const r = await fetch(`${API_BASE}/api/kids/homework`, { headers });
    const data = await r.json();
    setAllHomework(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadProfiles().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadHomework();
  }, [selectedKidId]);

  useEffect(() => {
    if (tab === "schedule") loadAllHomework();
  }, [tab]);

  async function addProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profileForm.name.trim()) return;
    setProfileSubmitting(true);
    try {
      const r = await fetch(`${API_BASE}/api/kids/profiles`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileForm.name.trim(),
          birthDate: profileForm.birthDate || undefined,
          schoolName: profileForm.schoolName.trim() || undefined,
          grade: profileForm.grade.trim() || undefined,
        }),
      });
      if (r.ok) {
        setProfileForm({ name: "", birthDate: "", schoolName: "", grade: "" });
        await loadProfiles();
      }
    } finally {
      setProfileSubmitting(false);
    }
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProfileId || !profileForm.name.trim()) return;
    setProfileSubmitting(true);
    try {
      const r = await fetch(`${API_BASE}/api/kids/profiles/${editingProfileId}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileForm.name.trim(),
          birthDate: profileForm.birthDate || undefined,
          schoolName: profileForm.schoolName.trim() || undefined,
          grade: profileForm.grade.trim() || undefined,
        }),
      });
      if (r.ok) {
        setEditingProfileId(null);
        setProfileForm({ name: "", birthDate: "", schoolName: "", grade: "" });
        await loadProfiles();
      }
    } finally {
      setProfileSubmitting(false);
    }
  }

  async function deleteProfile(id: string) {
    if (!confirm(t("kids.confirmDeleteProfile"))) return;
    const r = await fetch(`${API_BASE}/api/kids/profiles/${id}`, { method: "DELETE", headers });
    if (r.ok) await loadProfiles();
  }

  async function addHomework(e: React.FormEvent) {
    e.preventDefault();
    if (!homeworkForm.title.trim() || !selectedKidId || !homeworkForm.dueDate) return;
    setHomeworkSubmitting(true);
    try {
      const r = await fetch(`${API_BASE}/api/kids/profiles/${selectedKidId}/homework`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: homeworkForm.title.trim(),
          description: homeworkForm.description.trim() || undefined,
          dueDate: new Date(homeworkForm.dueDate).toISOString(),
        }),
      });
      if (r.ok) {
        setHomeworkForm({ title: "", description: "", dueDate: "" });
        await loadHomework();
      }
    } finally {
      setHomeworkSubmitting(false);
    }
  }

  async function toggleHomework(hw: Homework) {
    const r = await fetch(`${API_BASE}/api/kids/homework/${hw.id}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !hw.isCompleted }),
    });
    if (r.ok) {
      await loadHomework();
      if (tab === "schedule") await loadAllHomework();
    }
  }

  async function deleteHomework(id: string) {
    const r = await fetch(`${API_BASE}/api/kids/homework/${id}`, { method: "DELETE", headers });
    if (r.ok) {
      await loadHomework();
      if (tab === "schedule") await loadAllHomework();
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof Baby }[] = [
    { id: "profiles", label: t("kids.profiles"), icon: User },
    { id: "homework", label: t("kids.homework"), icon: BookOpen },
    { id: "schedule", label: t("kids.schedule"), icon: Calendar },
  ];

  const upcomingHomework = [...(tab === "schedule" ? allHomework : homework)]
    .filter((h) => !h.isCompleted)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-zinc-500">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{t("kids.title")}</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">{t("kids.subtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id
                ? "bg-rose-500 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* PROFILES TAB */}
        {tab === "profiles" && (
          <motion.div
            key="profiles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="w-5 h-5" />
                  {editingProfileId ? t("kids.editKid") : t("kids.addKid")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={editingProfileId ? updateProfile : addProfile}
                  className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <div>
                    <Label>{t("kids.kidName")}</Label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Omar"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>{t("kids.birthDate")}</Label>
                    <Input
                      type="date"
                      value={profileForm.birthDate}
                      onChange={(e) => setProfileForm((p) => ({ ...p, birthDate: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>{t("kids.school")}</Label>
                    <Input
                      value={profileForm.schoolName}
                      onChange={(e) => setProfileForm((p) => ({ ...p, schoolName: e.target.value }))}
                      placeholder="School name"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>{t("kids.grade")}</Label>
                    <Input
                      value={profileForm.grade}
                      onChange={(e) => setProfileForm((p) => ({ ...p, grade: e.target.value }))}
                      placeholder="e.g. Grade 4"
                      className="mt-2"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4 flex gap-2">
                    <Button type="submit" disabled={profileSubmitting}>
                      {t("kids.save")}
                    </Button>
                    {editingProfileId && (
                      <Button type="button" variant="outline" onClick={() => { setEditingProfileId(null); setProfileForm({ name: "", birthDate: "", schoolName: "", grade: "" }); }}>
                        {t("kids.cancel")}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {profiles.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass rounded-2xl p-6 border border-white/50 dark:border-zinc-700/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
                        <Baby className="w-7 h-7" />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingProfileId(p.id);
                            setProfileForm({
                              name: p.name,
                              birthDate: p.birthDate ? p.birthDate.slice(0, 10) : "",
                              schoolName: p.schoolName || "",
                              grade: p.grade || "",
                            });
                          }}
                        >
                          {t("kids.editKid")}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteProfile(p.id)}>
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg">{p.name}</h3>
                    {p.schoolName && <p className="text-sm text-zinc-500 mt-1">{p.schoolName}</p>}
                    {p.grade && <p className="text-sm text-zinc-500">{p.grade}</p>}
                    {p.birthDate && <p className="text-xs text-zinc-400 mt-2">{formatDate(p.birthDate)}</p>}
                    <div className="mt-3 flex items-center gap-1 text-rose-600 text-sm">
                      <BookOpen className="w-4 h-4" />
                      {p._count?.homework ?? 0} {t("kids.homework")}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {profiles.length === 0 && (
              <Card className="glass">
                <CardContent className="p-12 text-center">
                  <Baby className="w-16 h-16 mx-auto text-rose-400 mb-4" />
                  <p className="text-zinc-600 dark:text-zinc-400">{t("kids.noKids")}</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* HOMEWORK TAB */}
        {tab === "homework" && (
          <motion.div
            key="homework"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {profiles.length === 0 ? (
              <Card className="glass">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto text-lavender-400 mb-4" />
                  <p className="text-zinc-600 dark:text-zinc-400">{t("kids.noKids")}</p>
                  <p className="text-sm text-zinc-500 mt-2">{t("kids.addKidFirst")}</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-zinc-500 py-2">{t("kids.selectKid")}:</span>
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedKidId(p.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedKidId === p.id
                          ? "bg-lavender-500 text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      {t("kids.addHomework")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={addHomework} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="sm:col-span-2">
                        <Label>{t("kids.homeworkTitle")}</Label>
                        <Input
                          value={homeworkForm.title}
                          onChange={(e) => setHomeworkForm((h) => ({ ...h, title: e.target.value }))}
                          placeholder="e.g. Math worksheet"
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>{t("kids.dueDate")}</Label>
                        <Input
                          type="date"
                          value={homeworkForm.dueDate}
                          onChange={(e) => setHomeworkForm((h) => ({ ...h, dueDate: e.target.value }))}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div className="sm:col-span-2 lg:col-span-4">
                        <Label>{t("kids.description")}</Label>
                        <Input
                          value={homeworkForm.description}
                          onChange={(e) => setHomeworkForm((h) => ({ ...h, description: e.target.value }))}
                          placeholder="Optional notes"
                          className="mt-2"
                        />
                      </div>
                      <Button type="submit" disabled={homeworkSubmitting}>
                        <Plus className="w-4 h-4 mr-2" /> {t("kids.addHomework")}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle>{t("kids.homework")} — {profiles.find((p) => p.id === selectedKidId)?.name ?? ""}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {homework.length === 0 ? (
                      <p className="text-zinc-500 py-8 text-center">{t("kids.noHomework")}</p>
                    ) : (
                      <ul className="space-y-2">
                        <AnimatePresence mode="popLayout">
                          {homework.map((h) => (
                            <motion.li
                              key={h.id}
                              layout
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className={`flex items-center gap-3 p-3 rounded-xl ${
                                h.isCompleted ? "bg-zinc-100 dark:bg-zinc-800/50 opacity-75" : "bg-zinc-50 dark:bg-zinc-800/30"
                              }`}
                            >
                              <button
                                onClick={() => toggleHomework(h)}
                                className="text-zinc-400 hover:text-rose-500 flex-shrink-0"
                              >
                                {h.isCompleted ? <Check className="w-5 h-5 text-rose-500" /> : <Circle className="w-5 h-5" />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <span className={`block font-medium ${h.isCompleted ? "line-through text-zinc-500" : ""}`}>
                                  {h.title}
                                </span>
                                {h.description && <span className="text-sm text-zinc-500">{h.description}</span>}
                              </div>
                              <span className={`text-sm flex-shrink-0 ${isOverdue(h.dueDate) && !h.isCompleted ? "text-rose-500" : "text-zinc-500"}`}>
                                {formatDateShort(h.dueDate)}
                              </span>
                              <Button variant="ghost" size="icon" onClick={() => deleteHomework(h.id)}>
                                <Trash2 className="w-4 h-4 text-zinc-500" />
                              </Button>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </motion.div>
        )}

        {/* SCHEDULE TAB */}
        {tab === "schedule" && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t("kids.schedule")} — {t("kids.upcoming")}
                </CardTitle>
                <p className="text-sm text-zinc-500">{t("kids.scheduleDesc")}</p>
              </CardHeader>
              <CardContent>
                {profiles.length === 0 ? (
                  <p className="text-zinc-500 py-8 text-center">{t("kids.noKids")}</p>
                ) : upcomingHomework.length === 0 ? (
                  <p className="text-zinc-500 py-8 text-center">{t("kids.noHomework")}</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingHomework.map((h) => {
                      const kid = h.kid ?? profiles.find((p) => p.id === h.kidId);
                      const overdue = isOverdue(h.dueDate);
                      return (
                        <div
                          key={h.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border ${
                            overdue ? "border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20" : "border-zinc-200 dark:border-zinc-700"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center text-gold-600 flex-shrink-0">
                            <Calendar className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{h.title}</p>
                            <p className="text-sm text-zinc-500">
                              {kid?.name} {overdue && <span className="text-rose-500">• {t("kids.overdue")}</span>}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-medium text-sm">{formatDate(h.dueDate)}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => toggleHomework(h)}>
                            {t("kids.markDone")}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
