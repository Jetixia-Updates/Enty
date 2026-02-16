import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-9xl font-bold text-rose-200 dark:text-rose-900/50">404</h1>
      <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mt-4">Page not found</h2>
      <p className="text-zinc-500 mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Button className="mt-8 gap-2" asChild>
        <Link to="/">
          <Home className="w-4 h-4" /> Go Home
        </Link>
      </Button>
    </div>
  );
}
