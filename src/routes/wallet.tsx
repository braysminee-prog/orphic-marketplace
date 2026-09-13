import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Plus, ShieldCheck } from "lucide-react";
import { BackButton } from "@/components/orphic/back-button";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import { AccountSection } from "@/components/orphic/account/section";
import {
  analyzeWallet,
  formatDateTime,
  formatRupiah,
  walletBalance,
  walletPending,
  walletRanges,
  walletTransactions,
  walletTxKindLabel,
  type WalletRangeKey,
  type WalletTx,
} from "@/lib/orphic-account";

const title = "Dompet — Orphic";
const description =
  "Saldo, aktivitas, dan analisis transaksi dompet Orphic kamu dalam satu ruang yang tenang.";

export const Route = createFileRoute("/wallet")({
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
  component: WalletPage,
});

export default function WalletPage() {
  const [hidden, setHidden] = useState(false);
  const [range, setRange] = useState<WalletRangeKey>("30d");
  const [state, setState] = useState<"loading" | "ready">("loading");
  const [showAll, setShowAll] = useState(false);
  const [sheet, setSheet] = useState<null | "topup" | "withdraw">(null);

  useEffect(() => {
    const timer = setTimeout(() => setState("ready"), 420);
    return () => clearTimeout(timer);
  }, []);

  const analysis = useMemo(() => analyzeWallet(range), [range]);
  const visible = showAll ? walletTransactions : walletTransactions.slice(0, 5);
  const peak = Math.max(1, ...analysis.series.map((s) => Math.max(s.incoming, s.outgoing)));

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pb-28 pt-20 md:pt-28">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <BackButton fallback="/" label="Kembali" />

          <p className="orphic-eyebrow mt-6">Dompet</p>
          <h1 className="orphic-display mt-3 text-[1.7rem] leading-tight text-foreground md:text-[2.3rem]">
            Saldo Orphic
          </h1>

          {/* Balance */}
          <div className="mt-8 border-b border-hairline pb-8">
            <div className="flex items-center gap-3">
              <span className="text-[11.5px] text-muted-foreground">Available Balance</span>
              <button
                type="button"
                onClick={() => setHidden((v) => !v)}
                aria-pressed={hidden}
                aria-label={hidden ? "Tampilkan saldo" : "Sembunyikan saldo"}
                className="flex size-8 items-center justify-center rounded-full border border-hairline text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {hidden ? (
                  <EyeOff className="size-[15px]" strokeWidth={1.5} />
                ) : (
                  <Eye className="size-[15px]" strokeWidth={1.5} />
                )}
              </button>
            </div>

            {state === "loading" ? (
              <div className="mt-4 h-10 w-56 animate-pulse rounded-full bg-card" />
            ) : (
              <p
                aria-live="polite"
                className={`orphic-display mt-4 text-[2.1rem] leading-none text-foreground transition-all duration-500 md:text-[2.9rem] ${
                  hidden ? "select-none blur-[10px]" : ""
                }`}
              >
                {formatRupiah(walletBalance)}
              </p>
            )}

            <p className="mt-3 text-[11.5px] text-muted-foreground">
              {formatRupiah(walletPending)} sedang tertahan untuk pesanan berjalan
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setSheet("topup")}
                className="inline-flex items-center gap-2 rounded-full border border-primary/55 bg-primary/[0.07] px-5 py-2.5 text-[12.5px] text-primary transition-colors duration-300 hover:bg-primary/[0.12]"
              >
                <Plus className="size-[15px]" strokeWidth={1.5} />
                Top Up
              </button>
              <button
                type="button"
                onClick={() => setSheet("withdraw")}
                className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-[12.5px] text-muted-foreground transition-colors duration-300 hover:border-foreground/25 hover:text-foreground"
              >
                <ArrowUpRight className="size-[15px]" strokeWidth={1.5} />
                Withdraw
              </button>
            </div>

            <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/80">
              <ShieldCheck className="mt-[1px] size-[13px] shrink-0 text-primary" strokeWidth={1.5} />
              Orphic Protected — saldo prototipe. Tidak ada top up, penarikan, atau pembayaran nyata.
            </p>
          </div>

          {/* Analysis */}
          <AccountSection
            title="Analisis Transaksi"
            action={
              <div className="flex gap-1.5" role="tablist" aria-label="Rentang waktu">
                {walletRanges.map((r) => {
                  const active = r.key === range;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setRange(r.key)}
                      className={`rounded-full border px-3 py-1.5 text-[11px] transition-colors duration-300 ${
                        active
                          ? "border-primary/55 bg-primary/[0.07] text-primary"
                          : "border-hairline text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            }
          >
            <div className="grid gap-8 md:grid-cols-[1.15fr_1fr] md:gap-10">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Masuk</p>
                    <p className="orphic-display mt-1.5 text-[17px] tracking-normal text-seller-foreground">
                      {formatRupiah(analysis.incoming)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Keluar</p>
                    <p className="orphic-display mt-1.5 text-[17px] tracking-normal text-foreground">
                      {formatRupiah(analysis.outgoing)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex h-28 items-end gap-2" aria-hidden="true">
                  {analysis.series.map((s, i) => (
                    <div key={i} className="flex flex-1 flex-col justify-end gap-1">
                      <div
                        className="w-full rounded-full bg-seller/45"
                        style={{ height: `${(s.incoming / peak) * 52}%` }}
                      />
                      <div
                        className="w-full rounded-full bg-primary/45"
                        style={{ height: `${(s.outgoing / peak) * 52}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-muted-foreground/60">
                  <span>{analysis.series[0]?.label}</span>
                  <span>{analysis.series[analysis.series.length - 1]?.label}</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-muted-foreground">Distribusi pengeluaran</p>
                {analysis.distribution.length === 0 ? (
                  <p className="mt-4 text-[12.5px] text-muted-foreground/80">
                    Belum ada pengeluaran pada rentang ini.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-4">
                    {analysis.distribution.map((d) => (
                      <li key={d.kind}>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[12.5px] text-foreground">{d.label}</span>
                          <span className="text-[12px] text-muted-foreground">
                            {formatRupiah(d.amount)}
                          </span>
                        </div>
                        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-card">
                          <div
                            className="h-full rounded-full bg-primary/60"
                            style={{ width: `${Math.max(4, d.share * 100)}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-5 text-[11px] text-muted-foreground/70">
                  {analysis.count} transaksi pada rentang ini
                </p>
              </div>
            </div>
          </AccountSection>

          {/* Activity */}
          <AccountSection title="Aktivitas Dompet">
            {state === "loading" ? (
              <ul className="space-y-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="h-12 animate-pulse rounded-2xl bg-card" />
                ))}
              </ul>
            ) : walletTransactions.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">Belum ada aktivitas dompet.</p>
            ) : (
              <>
                <ul>
                  {visible.map((tx) => (
                    <TxRow key={tx.id} tx={tx} />
                  ))}
                </ul>
                {walletTransactions.length > 5 ? (
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="mt-6 text-[12.5px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    {showAll ? "Tampilkan lebih sedikit" : "Lihat riwayat lengkap"}
                  </button>
                ) : null}
              </>
            )}
          </AccountSection>
        </div>
      </main>

      {sheet ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <button
            type="button"
            aria-label="Tutup"
            onClick={() => setSheet(null)}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={sheet === "topup" ? "Top up saldo" : "Tarik saldo"}
            className="orphic-rise relative w-full max-w-md rounded-t-3xl border border-hairline bg-card px-7 py-8 md:rounded-3xl"
          >
            <h2 className="orphic-display text-[18px] text-foreground">
              {sheet === "topup" ? "Top Up Saldo" : "Tarik Saldo"}
            </h2>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
              {sheet === "topup"
                ? "Pada prototipe ini top up belum terhubung ke penyedia pembayaran mana pun."
                : "Pada prototipe ini penarikan belum terhubung ke rekening atau sistem pembayaran nyata."}
            </p>
            <button
              type="button"
              onClick={() => setSheet(null)}
              className="mt-7 w-full rounded-full border border-hairline py-3 text-[12.5px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              Mengerti
            </button>
          </div>
        </div>
      ) : null}

      <BottomNav />
    </div>
  );
}

function TxRow({ tx }: { tx: WalletTx }) {
  const incoming = tx.amount > 0;

  return (
    <li className="flex items-start gap-4 border-b border-hairline py-4">
      <span
        className={`mt-[2px] flex size-9 shrink-0 items-center justify-center rounded-full border ${
          incoming ? "border-seller/30 text-seller-foreground" : "border-hairline text-muted-foreground"
        }`}
      >
        {incoming ? (
          <ArrowDownLeft className="size-[15px]" strokeWidth={1.5} />
        ) : (
          <ArrowUpRight className="size-[15px]" strokeWidth={1.5} />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <p className="min-w-0 truncate text-[13px] text-foreground">{tx.title}</p>
          <span
            className={`shrink-0 text-[13px] tabular-nums ${
              incoming ? "text-seller-foreground" : "text-foreground"
            }`}
          >
            {incoming ? "+" : "−"}
            {formatRupiah(tx.amount)}
          </span>
        </div>
        <p className="mt-1 truncate text-[11.5px] text-muted-foreground">{tx.detail}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground/75">
          <span className="uppercase tracking-[0.16em]">{walletTxKindLabel[tx.kind]}</span>
          <span className="text-muted-foreground/45">·</span>
          <span>{formatDateTime(tx.at)}</span>
          {tx.status !== "success" ? (
            <>
              <span className="text-muted-foreground/45">·</span>
              <span className={tx.status === "failed" ? "text-destructive" : "text-primary"}>
                {tx.status === "failed" ? "Gagal" : "Diproses"}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </li>
  );
}
