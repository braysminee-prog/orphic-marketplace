import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ShieldCheck, Store, Wallet, Package, UserPlus } from "lucide-react";
import { BackButton } from "@/components/orphic/back-button";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import {
  formatDateTime,
  notificationCategories,
  notifications as seedNotifications,
  type NotificationCategory,
  type OrphicNotification,
} from "@/lib/orphic-account";

const title = "Notifikasi — Orphic";
const description = "Pembaruan pesanan, dompet, dan seller yang kamu ikuti di Orphic.";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotificationsPage,
});

const icons: Record<NotificationCategory, typeof Bell> = {
  order: Package,
  wallet: Wallet,
  seller: Store,
  following: UserPlus,
  account: ShieldCheck,
};

function NotificationsPage() {
  const [list, setList] = useState<OrphicNotification[]>(seedNotifications);
  const [filter, setFilter] = useState<NotificationCategory | "all">("all");

  const visible = useMemo(
    () => (filter === "all" ? list : list.filter((n) => n.category === filter)),
    [list, filter],
  );
  const unread = list.filter((n) => n.unread).length;

  const markRead = (id: string) =>
    setList((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pb-28 pt-20 md:pt-28">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <BackButton fallback="/" label="Kembali" />

          <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <p className="orphic-eyebrow">Notifikasi</p>
              <h1 className="orphic-display mt-3 text-[1.7rem] leading-tight text-foreground md:text-[2.3rem]">
                Pembaruan kamu
              </h1>
            </div>
            {unread > 0 ? (
              <button
                type="button"
                onClick={() => setList((prev) => prev.map((n) => ({ ...n, unread: false })))}
                className="shrink-0 text-[12px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Tandai dibaca
              </button>
            ) : null}
          </div>

          <div className="mt-7 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
            <div role="tablist" aria-label="Kategori notifikasi" className="flex w-max gap-2 md:w-auto md:flex-wrap">
              {notificationCategories.map((c) => {
                const active = c.key === filter;
                return (
                  <button
                    key={c.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(c.key)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-[12px] transition-colors duration-300 ${
                      active
                        ? "border-primary/55 bg-primary/[0.07] text-primary"
                        : "border-hairline text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="mt-16 text-center">
              <Bell className="mx-auto size-6 text-muted-foreground/60" strokeWidth={1.5} />
              <p className="mt-4 text-[13px] text-muted-foreground">
                Belum ada notifikasi pada kategori ini.
              </p>
            </div>
          ) : (
            <ul className="mt-8">
              {visible.map((n) => {
                const Icon = icons[n.category];
                const body = (
                  <div className="flex w-full gap-4 py-5 text-left">
                    <span
                      className={`mt-[2px] flex size-9 shrink-0 items-center justify-center rounded-full border ${
                        n.unread ? "border-primary/40 text-primary" : "border-hairline text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-[15px]" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <p
                          className={`min-w-0 flex-1 text-[13.5px] leading-snug ${
                            n.unread ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {n.title}
                        </p>
                        {n.unread ? (
                          <span
                            aria-label="Belum dibaca"
                            className="mt-[6px] size-[6px] shrink-0 rounded-full bg-destructive"
                          />
                        ) : null}
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/85">
                        {n.body}
                      </p>
                      <p className="mt-2 text-[11px] text-muted-foreground/65">{formatDateTime(n.at)}</p>
                    </div>
                  </div>
                );

                return (
                  <li key={n.id} className="border-b border-hairline">
                    {n.to?.kind === "order" ? (
                      <Link
                        to="/orders/$id"
                        params={{ id: n.to.id }}
                        onClick={() => markRead(n.id)}
                        className="block transition-colors duration-300 hover:bg-surface/40"
                      >
                        {body}
                      </Link>
                    ) : n.to?.kind === "wallet" ? (
                      <Link
                        to="/wallet"
                        onClick={() => markRead(n.id)}
                        className="block transition-colors duration-300 hover:bg-surface/40"
                      >
                        {body}
                      </Link>
                    ) : n.to?.kind === "seller" ? (
                      <Link
                        to="/seller/$handle"
                        params={{ handle: n.to.handle }}
                        onClick={() => markRead(n.id)}
                        className="block transition-colors duration-300 hover:bg-surface/40"
                      >
                        {body}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        className="block w-full transition-colors duration-300 hover:bg-surface/40"
                      >
                        {body}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
