import worldCreator from "@/assets/world-creator.jpg";
import worldHosting from "@/assets/world-hosting.jpg";
import worldSoftware from "@/assets/world-software.jpg";
import worldDesign from "@/assets/world-design.jpg";
import { products, type Product } from "@/lib/orphic-discovery";

/**
 * V6 — Wallet, Profile & Account prototype data.
 * Frontend only: no real wallet, payment, notification, or auth backend.
 */

export function formatRupiah(value: number): string {
  return `Rp ${Math.round(Math.abs(value)).toLocaleString("id-ID")}`;
}

/* ---------------------------------- Wallet --------------------------------- */

export type WalletTxKind = "topup" | "purchase" | "refund" | "withdraw" | "reward";

export type WalletTx = {
  id: string;
  kind: WalletTxKind;
  title: string;
  detail: string;
  /** ISO timestamp. */
  at: string;
  /** Positive = masuk, negative = keluar. */
  amount: number;
  status: "success" | "pending" | "failed";
};

export const walletBalance = 4_285_000;
export const walletPending = 150_000;

export const walletTxKindLabel: Record<WalletTxKind, string> = {
  topup: "Top Up",
  purchase: "Pembelian",
  refund: "Refund",
  withdraw: "Penarikan",
  reward: "Reward",
};

export const walletTransactions: WalletTx[] = [
  {
    id: "wtx-2041",
    kind: "purchase",
    title: "VPS 4GB NVMe — Indonesia",
    detail: "Pembayaran pesanan ORD-2418",
    at: "2026-09-12T09:24:00+07:00",
    amount: -149_000,
    status: "success",
  },
  {
    id: "wtx-2040",
    kind: "topup",
    title: "Top Up Saldo",
    detail: "Transfer bank — BCA Virtual Account",
    at: "2026-09-12T08:02:00+07:00",
    amount: 1_000_000,
    status: "success",
  },
  {
    id: "wtx-2039",
    kind: "purchase",
    title: "Figma UI Kit — Aurora",
    detail: "Pembayaran pesanan ORD-2411",
    at: "2026-09-10T20:15:00+07:00",
    amount: -219_000,
    status: "success",
  },
  {
    id: "wtx-2038",
    kind: "withdraw",
    title: "Penarikan Saldo",
    detail: "Ke rekening BCA •••• 4417",
    at: "2026-09-09T14:40:00+07:00",
    amount: -500_000,
    status: "pending",
  },
  {
    id: "wtx-2037",
    kind: "refund",
    title: "Refund Akun Mobile Legends",
    detail: "Pesanan dibatalkan — dana kembali ke dompet",
    at: "2026-09-08T11:05:00+07:00",
    amount: 1_250_000,
    status: "success",
  },
  {
    id: "wtx-2036",
    kind: "purchase",
    title: "Top Up Mobile Legends 344 Diamond",
    detail: "ORPHIC OFFICIAL — pesanan ORD-2402",
    at: "2026-09-07T19:48:00+07:00",
    amount: -89_000,
    status: "success",
  },
  {
    id: "wtx-2035",
    kind: "reward",
    title: "Cashback Orphic",
    detail: "Promo pembelian pertama bulan ini",
    at: "2026-09-06T10:12:00+07:00",
    amount: 25_000,
    status: "success",
  },
  {
    id: "wtx-2034",
    kind: "purchase",
    title: "AI Automation Workflow Pack",
    detail: "Pembayaran pesanan ORD-2390",
    at: "2026-09-04T16:30:00+07:00",
    amount: -179_000,
    status: "success",
  },
  {
    id: "wtx-2033",
    kind: "topup",
    title: "Top Up Saldo",
    detail: "E-wallet — GoPay",
    at: "2026-09-02T09:00:00+07:00",
    amount: 750_000,
    status: "success",
  },
  {
    id: "wtx-2032",
    kind: "purchase",
    title: "Setup & Hardening Server Produksi",
    detail: "Pembayaran pesanan ORD-2377",
    at: "2026-08-29T13:22:00+07:00",
    amount: -450_000,
    status: "success",
  },
  {
    id: "wtx-2031",
    kind: "withdraw",
    title: "Penarikan Saldo",
    detail: "Ke rekening BCA •••• 4417",
    at: "2026-08-21T15:10:00+07:00",
    amount: -300_000,
    status: "failed",
  },
  {
    id: "wtx-2030",
    kind: "topup",
    title: "Top Up Saldo",
    detail: "Transfer bank — BCA Virtual Account",
    at: "2026-08-14T08:35:00+07:00",
    amount: 2_000_000,
    status: "success",
  },
];

export const walletRanges = [
  { key: "7d", label: "7 hari", days: 7 },
  { key: "30d", label: "30 hari", days: 30 },
  { key: "90d", label: "90 hari", days: 90 },
] as const;

export type WalletRangeKey = (typeof walletRanges)[number]["key"];

export type WalletAnalysis = {
  incoming: number;
  outgoing: number;
  net: number;
  count: number;
  /** Outgoing split by transaction kind, largest first. */
  distribution: { kind: WalletTxKind; label: string; amount: number; share: number }[];
  /** Daily net movement buckets for the sparkline. */
  series: { label: string; incoming: number; outgoing: number }[];
};

/** Reference "today" for the prototype so the ranges always contain data. */
const referenceNow = new Date("2026-09-13T12:00:00+07:00").getTime();

export function analyzeWallet(range: WalletRangeKey): WalletAnalysis {
  const days = walletRanges.find((r) => r.key === range)?.days ?? 30;
  const from = referenceNow - days * 86_400_000;
  const scoped = walletTransactions.filter(
    (t) => t.status !== "failed" && new Date(t.at).getTime() >= from,
  );

  const incoming = scoped.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const outgoing = scoped.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);

  const byKind = new Map<WalletTxKind, number>();
  for (const t of scoped) {
    if (t.amount >= 0) continue;
    byKind.set(t.kind, (byKind.get(t.kind) ?? 0) + -t.amount);
  }
  const distribution = [...byKind.entries()]
    .map(([kind, amount]) => ({
      kind,
      label: walletTxKindLabel[kind],
      amount,
      share: outgoing > 0 ? amount / outgoing : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const buckets = Math.min(days, 8);
  const span = (days * 86_400_000) / buckets;
  const series = Array.from({ length: buckets }, (_, i) => {
    const start = from + i * span;
    const end = start + span;
    const inBucket = scoped.filter((t) => {
      const at = new Date(t.at).getTime();
      return at >= start && at < end;
    });
    return {
      label: new Date(start).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      incoming: inBucket.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
      outgoing: inBucket.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0),
    };
  });

  return { incoming, outgoing, net: incoming - outgoing, count: scoped.length, distribution, series };
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------ Notifications ------------------------------ */

export type NotificationCategory = "order" | "wallet" | "seller" | "following" | "account";

export type OrphicNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  at: string;
  unread: boolean;
  /** Optional in-app destination. */
  to?: { kind: "order"; id: string } | { kind: "wallet" } | { kind: "seller"; handle: string };
};

export const notificationCategories: { key: NotificationCategory | "all"; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "order", label: "Pesanan" },
  { key: "wallet", label: "Dompet" },
  { key: "seller", label: "Seller" },
  { key: "following", label: "Following" },
  { key: "account", label: "Akun" },
];

export const notifications: OrphicNotification[] = [
  {
    id: "ntf-91",
    category: "order",
    title: "VPS kamu sudah aktif",
    body: "Provisioning selesai. Detail akses server sudah tersedia di pesanan.",
    at: "2026-09-13T08:10:00+07:00",
    unread: true,
    to: { kind: "order", id: "ORD-2418" },
  },
  {
    id: "ntf-90",
    category: "wallet",
    title: "Penarikan sedang diproses",
    body: "Penarikan Rp 500.000 ke BCA •••• 4417 sedang diverifikasi.",
    at: "2026-09-12T19:02:00+07:00",
    unread: true,
    to: { kind: "wallet" },
  },
  {
    id: "ntf-89",
    category: "seller",
    title: "@cloudlab merilis produk baru",
    body: "Figma UI Kit — Aurora Dark Edition kini tersedia di storefront.",
    at: "2026-09-12T13:45:00+07:00",
    unread: true,
    to: { kind: "seller", handle: "cloudlab" },
  },
  {
    id: "ntf-88",
    category: "order",
    title: "Pesanan jasa masuk tahap pengerjaan",
    body: "Seller mulai mengerjakan Setup & Hardening Server Produksi.",
    at: "2026-09-11T10:20:00+07:00",
    unread: false,
    to: { kind: "order", id: "ORD-2377" },
  },
  {
    id: "ntf-87",
    category: "following",
    title: "@nexusstore membagikan update",
    body: "Stok akun game baru akan dibuka akhir pekan ini.",
    at: "2026-09-10T17:05:00+07:00",
    unread: false,
    to: { kind: "seller", handle: "nexusstore" },
  },
  {
    id: "ntf-86",
    category: "wallet",
    title: "Top up berhasil",
    body: "Saldo Rp 1.000.000 sudah masuk ke dompet Orphic kamu.",
    at: "2026-09-12T08:04:00+07:00",
    unread: false,
    to: { kind: "wallet" },
  },
  {
    id: "ntf-85",
    category: "account",
    title: "Orphic Protected aktif",
    body: "Semua pembelian kamu dilindungi hingga pemenuhan dikonfirmasi.",
    at: "2026-09-08T09:00:00+07:00",
    unread: false,
  },
];

export function unreadCount(list: OrphicNotification[]): number {
  return list.filter((n) => n.unread).length;
}

/* --------------------------------- Sellers --------------------------------- */

export type SellerProfile = {
  handle: string;
  name: string;
  tagline: string;
  bio: string;
  cover: string;
  official: boolean;
  rating: number;
  reviews: string;
  products: number;
  responseTime: string;
  joined: string;
  location: string;
  /** Latest storefront update shown in Following. */
  update: string;
  updateAt: string;
};

export const sellers: SellerProfile[] = [
  {
    handle: "nexusstore",
    name: "Nexus Store",
    tagline: "Infrastruktur & aset digital kurasi",
    bio: "Menyediakan VPS, workflow otomatis, dan akun game terverifikasi sejak 2021. Semua pesanan diproses manual dengan verifikasi ganda.",
    cover: worldHosting,
    official: false,
    rating: 4.9,
    reviews: "2.418 ulasan",
    products: 3,
    responseTime: "< 15 menit",
    joined: "Bergabung 2021",
    location: "Jakarta, Indonesia",
    update: "Stok akun game baru dibuka akhir pekan ini.",
    updateAt: "2026-09-10T17:05:00+07:00",
  },
  {
    handle: "cloudlab",
    name: "Cloud Lab",
    tagline: "Studio desain & cloud engineering",
    bio: "Tim kecil yang membangun UI kit, dokumentasi, dan setup server produksi. Fokus pada kualitas dan dukungan purna beli.",
    cover: worldDesign,
    official: false,
    rating: 4.8,
    reviews: "1.106 ulasan",
    products: 3,
    responseTime: "< 1 jam",
    joined: "Bergabung 2022",
    location: "Bandung, Indonesia",
    update: "Figma UI Kit — Aurora Dark Edition kini tersedia.",
    updateAt: "2026-09-12T13:45:00+07:00",
  },
  {
    handle: "digitalhub",
    name: "Digital Hub",
    tagline: "Script & template siap produksi",
    bio: "Marketplace script PHP dan tema WordPress dengan pembaruan berkala serta lisensi jelas.",
    cover: worldSoftware,
    official: false,
    rating: 4.7,
    reviews: "874 ulasan",
    products: 2,
    responseTime: "< 3 jam",
    joined: "Bergabung 2020",
    location: "Surabaya, Indonesia",
    update: "Update keamanan untuk Premium PHP Script dirilis.",
    updateAt: "2026-09-05T09:30:00+07:00",
  },
  {
    handle: "orphic-official",
    name: "ORPHIC OFFICIAL",
    tagline: "Layanan resmi Orphic",
    bio: "Top up, membership, dan lisensi resmi yang dipenuhi langsung oleh Orphic dengan jaminan pemenuhan otomatis.",
    cover: worldCreator,
    official: true,
    rating: 5,
    reviews: "9.240 ulasan",
    products: 0,
    responseTime: "Otomatis",
    joined: "Layanan resmi",
    location: "Orphic Marketplace",
    update: "Top up resmi kini mendukung 6 judul game populer.",
    updateAt: "2026-09-11T08:00:00+07:00",
  },
];

export function getSeller(handle: string): SellerProfile | undefined {
  return sellers.find((s) => s.handle === handle);
}

export function sellerHandleOf(sellerLabel: string): string {
  return sellerLabel.replace(/^@/, "");
}

export function sellerProducts(handle: string): Product[] {
  return products.filter((p) => sellerHandleOf(p.seller) === handle);
}

/** Sellers the prototype buyer follows by default. */
export const defaultFollowing = ["nexusstore", "cloudlab"];

/* --------------------------------- Profile --------------------------------- */

export const accountProfile = {
  name: "Brays Minee",
  handle: "@braysminee",
  member: "Orphic Member sejak 2024",
  initials: "BM",
  orders: 7,
  wishlist: 12,
  vouchers: 3,
};

export const vouchers = [
  { code: "ORPHIC10", label: "Diskon 10% produk digital", note: "Berlaku sampai 30 Sep 2026" },
  { code: "HOSTPLUS", label: "Potongan Rp 50.000 hosting", note: "Min. belanja Rp 300.000" },
  { code: "FIRSTBUY", label: "Cashback Rp 25.000", note: "Sekali pakai" },
];

export const wishlistIds = ["figma-kit", "ai-workflow", "ml-account"];
