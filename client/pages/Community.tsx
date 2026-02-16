import { motion } from "framer-motion";
import { Users, MessageCircle, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Community() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Community</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Connect with other women—tips, parenting, cooking & more
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Community Feed</h3>
            <p className="text-sm text-zinc-500">Posts from other moms & families</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-lavender-100 dark:bg-lavender-950/50 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-lavender-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Tips & Advice</h3>
            <p className="text-sm text-zinc-500">Cooking, parenting, home tips</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gold-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Engage</h3>
            <p className="text-sm text-zinc-500">Like, comment & share</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
