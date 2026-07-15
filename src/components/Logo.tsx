import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  /** Show “AgriCycle” wordmark next to the mark */
  withWordmark?: boolean;
  /** Icon box size in px */
  size?: number;
  className?: string;
  href?: string | null;
  /** Slightly tighter for dense UIs (login cards) */
  compact?: boolean;
};

export default function Logo({
  withWordmark = true,
  size = 40,
  className = "",
  href = "/",
  compact = false,
}: LogoProps) {
  const mark = (
    <span
      className={`relative shrink-0 overflow-hidden rounded-xl bg-white shadow-md shadow-green/15 ring-1 ring-green/15 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="AgriCycle"
        width={size}
        height={size}
        className="h-full w-full object-contain p-0.5"
        priority
      />
    </span>
  );

  const content = (
    <span className={`inline-flex items-center ${compact ? "gap-2" : "gap-2.5"}`}>
      {mark}
      {withWordmark && (
        <span className="leading-tight">
          <span
            className={`block font-serif tracking-tight text-foreground ${
              compact ? "text-base" : "text-base sm:text-lg"
            }`}
          >
            Agri<span className="text-green">Cycle</span>
          </span>
          {!compact && (
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-muted sm:block">
              Farm waste marketplace
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} className="group inline-flex items-center">
      {content}
    </Link>
  );
}
