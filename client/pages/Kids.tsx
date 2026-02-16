import { motion } from "framer-motion";
import { Baby, BookOpen, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Kids() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Kids & School</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Homework tracking, schedules & tuition
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center mx-auto mb-4">
              <Baby className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Kids Profiles</h3>
            <p className="text-sm text-zinc-500">Add your children and manage their info</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-lavender-100 dark:bg-lavender-950/50 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-lavender-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Homework</h3>
            <p className="text-sm text-zinc-500">Track assignments and due dates</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gold-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">School Schedule</h3>
            <p className="text-sm text-zinc-500">Exams, events & tuition booking</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
