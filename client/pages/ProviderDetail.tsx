import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthHeaders } from "@/store/auth";
import { API_BASE } from "@/lib/api";

interface ProviderData {
  id: string;
  user: { name: string; avatar?: string };
  service: { name: string; category: string; basePrice: number };
  bio?: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  reviews: { rating: number; comment?: string; user: { name: string } }[];
}

export default function ProviderDetail() {
  const { id } = useParams();
  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ address: "", date: "", time: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/api/providers/${id}`, { headers: getAuthHeaders() })
      .then((r) => r.json())
      .then(setProvider)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!provider || !booking.address || !booking.date || !booking.time) return;
    setSubmitting(true);
    const scheduledAt = new Date(`${booking.date}T${booking.time}`).toISOString();
    const r = await fetch(`${API_BASE}/api/bookings`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: provider.id,
        scheduledAt,
        address: booking.address,
        notes: booking.notes || undefined,
        price: provider.service.basePrice,
      }),
    });
    setSubmitting(false);
    if (r.ok) {
      const data = await r.json();
      alert("Booking confirmed! Check your bookings.");
      setBooking({ address: "", date: "", time: "", notes: "" });
    } else {
      const err = await r.json();
      alert(err.error || "Booking failed");
    }
  }

  if (loading || !provider) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-zinc-600 hover:text-rose-600">
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-400 to-lavender-400 flex items-center justify-center text-white text-2xl font-bold">
                  {provider.user.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{provider.service.name}</h1>
                  <p className="text-zinc-500">{provider.user.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                    <span className="font-medium">{provider.rating.toFixed(1)}</span>
                    <span className="text-sm text-zinc-500">({provider.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              {provider.bio && <p className="text-zinc-600 dark:text-zinc-400">{provider.bio}</p>}
              <p className="text-xl font-semibold text-rose-600 mt-4">
                EGP {provider.service.basePrice} / session
              </p>
            </CardContent>
          </Card>

          {provider.reviews?.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {provider.reviews.map((rev, i) => (
                    <li key={i} className="border-b border-zinc-200 dark:border-zinc-700 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{rev.user.name}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${s <= rev.rating ? "fill-gold-400 text-gold-400" : "text-zinc-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      {rev.comment && <p className="text-sm text-zinc-600">{rev.comment}</p>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="glass sticky top-6">
            <CardHeader>
              <CardTitle>Book now</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <Label>Address</Label>
                  <Input
                    placeholder="Your address"
                    value={booking.address}
                    onChange={(e) => setBooking((b) => ({ ...b, address: e.target.value }))}
                    required
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={booking.date}
                      onChange={(e) => setBooking((b) => ({ ...b, date: e.target.value }))}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={booking.time}
                      onChange={(e) => setBooking((b) => ({ ...b, time: e.target.value }))}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label>Notes (optional)</Label>
                  <textarea
                    placeholder="Special requests..."
                    value={booking.notes}
                    onChange={(e) => setBooking((b) => ({ ...b, notes: e.target.value }))}
                    className="mt-2 flex w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm min-h-[80px]"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting || !provider.isAvailable}>
                  {submitting ? "Booking..." : `Book for EGP ${provider.service.basePrice}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
