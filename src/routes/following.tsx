import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { BackButton } from "@/components/orphic/back-button";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import { SellerRow } from "@/components/orphic/account/seller-row";
import { AccountSection } from "@/components/orphic/account/section";
import { sellers } from "@/lib/orphic-account";
import { useFollowing } from "@/lib/orphic-follow";

const title = "Following — Orphic";
const description = "Seller yang kamu ikuti di Orphic beserta pembaruan storefront terbaru mereka.";

export const Route = createFileRoute("/following")({
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
  component: FollowingPage,
});

function FollowingPage() {
  const { following } = useFollowing();
  const followed = sellers.filter((s) => following.includes(s.handle));
  const suggested = sellers.filter((s) => !following.includes(s.handle) && !s.official);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pb-28 pt-20 md:pt-28">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <BackButton fallback="/profile" label="Kembali" />

          <p className="orphic-eyebrow mt-6">Following</p>
          <h1 className="orphic-display mt-3 text-[1.7rem] leading-tight text-foreground md:text-[2.3rem]">
            Seller yang kamu ikuti
          </h1>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
            Mengikuti seller hanya menampilkan pembaruan storefront mereka. Tidak ada percakapan yang
            dibuat otomatis.
          </p>

          {followed.length === 0 ? (
            <div className="mt-14 text-center">
              <Users className="mx-auto size-6 text-muted-foreground/60" strokeWidth={1.5} />
              <p className="mt-4 text-[13px] text-muted-foreground">
                Kamu belum mengikuti seller mana pun.
              </p>
            </div>
          ) : (
            <ul className="mt-8">
              {followed.map((s) => (
                <SellerRow key={s.handle} seller={s} />
              ))}
            </ul>
          )}

          {suggested.length > 0 ? (
            <AccountSection title="Saran Seller">
              <ul>
                {suggested.map((s) => (
                  <SellerRow key={s.handle} seller={s} />
                ))}
              </ul>
            </AccountSection>
          ) : null}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
