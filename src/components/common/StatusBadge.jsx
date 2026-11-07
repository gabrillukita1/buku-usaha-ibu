import { cn } from "../ui.jsx"

const tones = {
  neutral: "bg-[#F0EEEA] text-neutral",
  warning: "bg-[#F8EBD2] text-warning",
  success: "bg-[#E3F2EA] text-success",
  danger: "bg-[#F8E4E5] text-danger",
  info: "bg-violet-soft text-primary",
  brambang: "bg-orange-soft text-[#9A542C]",
  supplier: "bg-mint text-[#0F6B5C]",
}

export function StatusBadge({ children, tone = "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-bold",
        tones[tone] || tones.neutral,
      )}
    >
      {children}
    </span>
  )
}
