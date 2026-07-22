import { cn } from "@/lib/utils";

/** Marca mínima — monograma EC alineado al favicon */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-7 shrink-0", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" fill="#141b24" />
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="7"
        stroke="#3d9cfd"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      <path
        d="M9 10.5h7.2c2.4 0 4 1.35 4 3.35 0 1.35-.75 2.4-1.95 2.9 1.4.45 2.35 1.65 2.35 3.3 0 2.2-1.75 3.45-4.35 3.45H9V10.5Zm2.55 2v3.55h4.35c1.1 0 1.75-.5 1.75-1.75s-.65-1.8-1.75-1.8H11.55Zm0 5.55v3.9h4.85c1.3 0 2.05-.55 2.05-1.9s-.75-2-2.05-2H11.55Z"
        fill="#e8eef4"
      />
      <path d="M22.5 22.5h1.8v1.8h-1.8z" fill="#3d9cfd" />
    </svg>
  );
}
