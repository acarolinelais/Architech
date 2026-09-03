import { Link } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="surface-card flex items-center justify-between rounded-2xl px-6 py-4">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo-mark.png" alt="" className="h-8 w-auto" />
        <span className="text-xl font-semibold text-foreground">Architech</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link
          to="/about"
          className="whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          About
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
