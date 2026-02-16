import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Shopping() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Shopping</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">Smart shopping lists & supermarket sync</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Shopping Lists</h3>
            <p className="text-sm text-zinc-500">Coming soon: Create lists, sync with supermarkets</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-lavender-100 dark:bg-lavender-950/50 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-lavender-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Online Ordering</h3>
            <p className="text-sm text-zinc-500">Order from supermarkets directly</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <h3 className="font-semibold text-lg mb-2">Offers & Discounts</h3>
            <p className="text-sm text-zinc-500">Exclusive deals from partner stores</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
