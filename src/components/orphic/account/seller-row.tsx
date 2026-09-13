import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { SellerSignature } from "@/components/orphic/seller-signature";
import { FollowButton } from "@/components/orphic/account/follow-button";
import type { SellerProfile } from "@/lib/orphic-account";

export function SellerRow({ seller }: { seller: SellerProfile }) {
  return (
    <li className="flex items-start gap-4 border-b border-hairline py-5">
      <Link
        to="/seller/$handle"
        params={{ handle: seller.handle }}
        aria-label={`Buka profil ${seller.name}`}
        className="size-12 shrink-0 overflow-hidden rounded-full bg-card"
      >
        <img
          src={seller.cover}
          alt=""
          loading="lazy"
          width={96}
          height={96}
          className="size-full object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Link
            to="/seller/$handle"
            params={{ handle: seller.handle }}
            className="truncate text-[13.5px] text-foreground transition-colors duration-300 hover:text-primary"
          >
            {seller.name}
          </Link>
          {seller.official ? (
            <span className="rounded-full border border-primary/30 bg-primary/[0.07] px-2 py-[2px] text-[9px] font-medium uppercase tracking-[0.18em] text-primary">
              Official
            </span>
          ) : (
            <SellerSignature />
          )}
        </div>

        <p className="mt-1 flex items-center gap-2 text-[11.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="size-3 fill-primary text-primary" strokeWidth={1.5} />
            {seller.rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span className="truncate">@{seller.handle}</span>
        </p>

        <p className="mt-2 line-clamp-2 text-[11.5px] leading-relaxed text-muted-foreground/85">
          {seller.update}
        </p>
      </div>

      {seller.official ? null : <FollowButton handle={seller.handle} />}
    </li>
  );
}
