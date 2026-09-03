import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="flex items-center justify-center px-6 py-6">
      <Link to="/" className="flex items-center gap-2">
        <img src="/Logo.png" alt="Architech" className="h-5 w-auto" />
      </Link>
    </header>
  );
}
