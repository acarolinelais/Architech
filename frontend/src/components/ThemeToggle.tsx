import { Button } from "@/components/ui/button";
import { MoonIcon } from "@/components/icons/Moon";
import { SunIcon } from "@/components/icons/Sun";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="shrink-0 rounded-full border-transparent bg-brand/15 text-brand hover:bg-brand/25"
      aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {theme === "dark" ? (
        <MoonIcon className="h-4 w-4" />
      ) : (
        <SunIcon className="h-4 w-4" />
      )}
    </Button>
  );
}
