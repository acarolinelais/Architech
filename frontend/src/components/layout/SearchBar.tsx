import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/components/icons/Search";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search keyword..."
          className="pl-10"
        />
      </div>
      <ThemeToggle />
    </div>
  );
}
