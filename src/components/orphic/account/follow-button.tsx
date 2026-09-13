import { Check, Plus } from "lucide-react";
import { useFollowing } from "@/lib/orphic-follow";

export function FollowButton({
  handle,
  size = "sm",
}: {
  handle: string;
  size?: "sm" | "md";
}) {
  const { isFollowing, toggle } = useFollowing();
  const active = isFollowing(handle);

  return (
    <button
      type="button"
      onClick={() => toggle(handle)}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border transition-colors duration-300 ${
        size === "md" ? "px-5 py-2.5 text-[12.5px]" : "px-3.5 py-1.5 text-[11.5px]"
      } ${
        active
          ? "border-hairline text-muted-foreground hover:border-foreground/25 hover:text-foreground"
          : "border-primary/55 bg-primary/[0.07] text-primary hover:bg-primary/[0.12]"
      }`}
    >
      {active ? (
        <>
          <Check className="size-[14px]" strokeWidth={1.5} />
          Mengikuti
        </>
      ) : (
        <>
          <Plus className="size-[14px]" strokeWidth={1.5} />
          Ikuti
        </>
      )}
    </button>
  );
}
