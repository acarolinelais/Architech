import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function Header({ search, onSearchChange }: HeaderProps) {
  return (
    <header className="flex items-center gap-6">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search keyword..."
        className="flex-1"
      />
      <Link
        to="/about"
        className="whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        About
      </Link>
      <ThemeToggle />
    </header>
  );
}
