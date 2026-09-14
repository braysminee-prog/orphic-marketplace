import { useMemo, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Clock, Flag, MapPin, Star } from "lucide-react";
import { BackButton } from "@/components/orphic/back-button";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import { SellerSignature } from "@/components/orphic/seller-signature";
import { FollowButton } from "@/components/orphic/account/follow-button";
import { ProductCard } from "@/components/orphic/discovery/product-card";
import { getSeller, sellerProducts } from "@/lib/orphic-account";

export const Route = createFileRoute("/seller/$handle")({
  loader: ({ params }) => {
    const seller = getSeller(params.handle);
    if (!seller) throw notFound();
    return { seller };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Seller tidak ditemukan — Orphic" }, { name: "robots", content: "noindex" }] };
    }
    const t = `${loaderData.seller.name} — Orphic`;
    const d = loaderData.seller.tagline;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: SellerPage,
});

function SellerPage() {
  const { seller } = Route.useLoaderData();
  const items = useMemo(() => sellerProducts(seller.handle), [seller.handle]);
  const types = useMemo(
    () => ["Semua", ...Array.from(new Set(items.map((p) => p.type)))],
    [items],
  );
  const [tab, setTab] = useState("Semua");
  const [reported, setReported] = useState(false);

  const visible = tab === "Semua" ? items : items.filter((p) => p.type === tab);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pb-28">
        {/* Cover */}
        <div className="relative h-48 w-full overflow-hidden md:h-64">
          <img
            src={seller.cover}
            alt=""
            width={1920}
            height={640}
            className="size-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        </div>

        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <div className="-mt-10 md:-mt-12">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-4">
              <span className="size-20 shrink-0 overflow-hidden rounded-full border border-hairline bg-card md:size-24">
                <img
                  src={seller.cover}
                  alt={seller.name}
                  width={192}
                  height={192}
                  className="size-full object-cover"
                />
              </span>
              <div className="min-w-0 pb-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h1 className="orphic-display truncate text-[1.35rem] leading-tight text-foreground md:text-[1.9rem]">
                    {seller.name}
                  </h1>
                  {seller.official ? (
                    <span className="rounded-full border border-primary/30 bg-primary/[0.07] px-2 py-[2px] text-[9px] font-medium uppercase tracking-[0.18em] text-primary">
                      Official
                    </span>
                  ) : (
                    <SellerSignature />
                  )}
                </div>
                <p className="mt-1.5 truncate text-[12.5px] text-muted-foreground">@{seller.handle}</p>
              </div>
            </div>

            <div className="mt-4">
              <BackButton fallback="/following" label="Kembali" />
            </div>

            <p className="mt-5 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
              {seller.bio}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-[13px] fill-primary text-primary" strokeWidth={1.5} />
                {seller.rating.toFixed(1)} · {seller.reviews}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-[13px]" strokeWidth={1.5} />
                Respons {seller.responseTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-[13px]" strokeWidth={1.5} />
                {seller.location}
              </span>
              <span>{seller.joined}</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {seller.official ? null : <FollowButton handle={seller.handle} size="md" />}
              <button
                type="button"
                onClick={() => setReported(true)}
                className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-[12.5px] text-muted-foreground transition-colors duration-300 hover:border-foreground/25 hover:text-foreground"
              >
                <Flag className="size-[15px]" strokeWidth={1.5} />
                Laporkan
              </button>
            </div>

            {reported ? (
              <p className="mt-4 text-[11.5px] text-muted-foreground">
                Laporan tercatat pada prototipe ini. Tim Orphic tidak menerima laporan nyata di sini.
              </p>
            ) : null}
          </div>

          {/* Products */}
          <section className="mt-14">
            <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
              <div role="tablist" aria-label="Kategori produk seller" className="flex w-max gap-2 md:w-auto md:flex-wrap">
                {types.map((t) => {
                  const active = t === tab;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(t)}
                      className={`shrink-0 rounded-full border px-4 py-2 text-[12px] transition-colors duration-300 ${
                        active
                          ? "border-primary/55 bg-primary/[0.07] text-primary"
                          : "border-hairline text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="mt-10 text-[13px] text-muted-foreground">
                {seller.official
                  ? "Produk resmi Orphic tersedia langsung pada halaman kategori terkait."
                  : "Belum ada produk pada kategori ini."}
              </p>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
