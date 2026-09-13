import type { ReactNode } from "react";

export function AccountSection({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mt-12 ${className}`}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="orphic-eyebrow">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
