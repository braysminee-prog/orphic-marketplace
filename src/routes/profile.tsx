import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  Heart,
  Package,
  Settings,
  ShieldCheck,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";
import { BackButton } from "@/components/orphic/back-button";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import { AccountSection } from "@/components/orphic/account/section";
import { ProductCard } from "@/components/orphic/discovery/product-card";
import {
  accountProfile,
  formatRupiah,
  notifications,
  unreadCount,
  vouchers,
  walletBalance,
  wishlistIds,
} from "@/lib/orphic-account";
import { products } from "@/lib/orphic-discovery";
import { useFollowing } from "@/lib/orphic-follow";

const title = "Profil — Orphic";
const description =
  "Hub akun Orphic: pesanan, dompet, wishlist, following, voucher, dan pengaturan dalam satu tempat.";

export const Route = createFileRoute("/profile")({
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
  component: ProfilePage,
});

function ProfilePage() {
  const { following } = useFollowing();
  const unread = unreadCount(notifications);
  const wishlist = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pb-28 pt-20 md:pt-28">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <BackButton fallback="/" label="Kembali" />

          {/* Identity */}
          <div className="mt-8 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5 border-b border-hairline pb-8">
            <span className="orphic-display grid size-16 shrink-0 place-items-center rounded-full border border-hairline bg-card text-[18px] text-foreground md:size-20 md:text-[22px]">
              {accountProfile.initials}
            </span>
            <div className="min-w-0">
              <h1 className="orphic-display truncate text-[1.4rem] leading-tight text-foreground md:text-[1.9rem]">
                {accountProfile.name}
              </h1>
              <p className="mt-1.5 truncate text-[12.5px] text-muted-foreground">
                {accountProfile.handle}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/65">
                {accountProfile.member}
              </p>
            </div>
          </div>

          {/* Wallet summary */}
          <Link
            to="/wallet"
            className="mt-8 flex items-center justify-between gap-4 rounded-3xl border border-hairline px-6 py-5 transition-colors duration-300 hover:border-foreground/20"
          >
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">Dompet</p>
              <p className="orphic-display mt-2 text-[20px] tracking-normal text-foreground">
                {formatRupiah(walletBalance)}
              </p>
            </div>
            <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
              Kelola
              <ChevronRight className="size-[15px]" strokeWidth={1.5} />
            </span>
          </Link>

          {/* Account rows */}
          <AccountSection title="Akun">
            <ul className="border-t border-hairline">
              <AccountRow
                to="/orders"
                icon={Package}
                label="Pesanan"
                meta={`${accountProfile.orders} pesanan`}
              />
              <AccountRow to="/wallet" icon={Wallet} label="Dompet" meta="Saldo & aktivitas" />
              <AccountRow
                to="/notifications"
                icon={Bell}
                label="Notifikasi"
                meta={unread > 0 ? `${unread} belum dibaca` : "Semua terbaca"}
              />
              <AccountRow
                to="/following"
                icon={Users}
                label="Following"
                meta={`${following.length} seller`}
              />
              <AccountRow
                to="/search"
                icon={Heart}
                label="Wishlist"
                meta={`${wishlist.length} produk`}
              />
            </ul>
          </AccountSection>

          {/* Vouchers */}
          <AccountSection title="Voucher">
            <ul className="border-t border-hairline">
              {vouchers.map((v) => (
                <li
                  key={v.code}
                  className="flex items-start justify-between gap-4 border-b border-hairline py-4"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] text-foreground">{v.label}</p>
                    <p className="mt-1 text-[11.5px] text-muted-foreground">{v.note}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-primary/40 bg-primary/[0.07] px-3 py-1 text-[10.5px] uppercase tracking-[0.16em] text-primary">
                    {v.code}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/80">
              <Ticket className="mt-[1px] size-[13px] shrink-0 text-muted-foreground" strokeWidth={1.5} />
              Voucher pada prototipe ini belum dapat diterapkan di checkout.
            </p>
          </AccountSection>

          {/* Wishlist */}
          <AccountSection
            title="Wishlist"
            action={
              <Link
                to="/search"
                className="text-[12px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Jelajahi
              </Link>
            }
          >
            {wishlist.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">Wishlist kamu masih kosong.</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                {wishlist.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </AccountSection>

          {/* Settings */}
          <AccountSection title="Pengaturan">
            <ul className="border-t border-hairline">
              {[
                { label: "Informasi akun", meta: "Nama, email, nomor" },
                { label: "Keamanan", meta: "Kata sandi & verifikasi" },
                { label: "Preferensi", meta: "Bahasa & tampilan" },
              ].map((s) => (
                <li
                  key={s.label}
                  className="flex items-center justify-between gap-4 border-b border-hairline py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Settings className="size-[15px] shrink-0 text-muted-foreground" strokeWidth={1.5} />
                    <span className="truncate text-[13px] text-foreground">{s.label}</span>
                  </div>
                  <span className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-muted-foreground/60">
                    Segera
                  </span>
                </li>
              ))}
            </ul>
          </AccountSection>

          <p className="mt-10 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/80">
            <ShieldCheck className="mt-[1px] size-[13px] shrink-0 text-primary" strokeWidth={1.5} />
            Orphic Protected — setiap pembelian didampingi hingga pemenuhan selesai. Data akun di sini
            adalah data contoh prototipe.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function AccountRow({
  to,
  icon: Icon,
  label,
  meta,
}: {
  to: "/orders" | "/wallet" | "/notifications" | "/following" | "/search";
  icon: typeof Package;
  label: string;
  meta: string;
}) {
  return (
    <li className="border-b border-hairline">
      <Link
        to={to}
        className="flex items-center justify-between gap-4 py-4 transition-colors duration-300 hover:bg-surface/40"
      >
        <span className="flex min-w-0 items-center gap-3">
          <Icon className="size-[16px] shrink-0 text-muted-foreground" strokeWidth={1.5} />
          <span className="truncate text-[13.5px] text-foreground">{label}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2 text-[11.5px] text-muted-foreground">
          {meta}
          <ChevronRight className="size-[15px]" strokeWidth={1.5} />
        </span>
      </Link>
    </li>
  );
}
