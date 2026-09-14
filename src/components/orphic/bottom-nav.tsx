import { Link, useLocation } from "@tanstack/react-router";
import { Clapperboard, Home, User, Users, Wallet } from "lucide-react";

const items = [
  { label: "Beranda", icon: Home, to: "/" },
  { label: "Dompet", icon: Wallet, to: "/wallet" },
  { label: "Komunitas", icon: Users, to: undefined },
  { label: "Shorts", icon: Clapperboard, to: undefined },
  { label: "Profil", icon: User, to: "/profile" },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-between rounded-full orphic-glass px-2 py-2">
        {items.map(({ label, icon: Icon, to }) => {
          const active = to !== undefined && pathname === to;
          const className = `flex min-w-[62px] flex-col items-center gap-1 rounded-full px-2 py-2 transition-colors duration-300 ${
            active ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`;

          return to !== undefined ? (
            <Link
              key={label}
              to={to}
              aria-current={active ? "page" : undefined}
              className={className}
            >
              <Icon className="size-[19px]" strokeWidth={1.5} />
              <span className="text-[10px] tracking-wide">{label}</span>
            </Link>
          ) : (
            <button key={label} type="button" className={className}>
              <Icon className="size-[19px]" strokeWidth={1.5} />
              <span className="text-[10px] tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
