import { cn } from "../ui.jsx"

export function SegmentedControl({ value, onChange, options, accent = "neutral" }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-control bg-[#EBE7E2]/80 p-1">
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-12 flex-1 rounded-xl px-4 text-sm font-bold transition",
              active
                ? accent === "brambang"
                  ? "bg-white text-brambang shadow-card"
                  : accent === "supplier"
                    ? "bg-white text-supplier shadow-card"
                    : "bg-white text-ink shadow-card"
                : "text-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
