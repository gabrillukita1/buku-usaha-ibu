import { PackageCheck } from "lucide-react"
import { cn } from "../ui.jsx"

export const NAV_ITEMS = [
  { key: "home", label: "Beranda", short: "Beranda" },
  { key: "bg", label: "Brambang Goreng", short: "Brambang" },
  { key: "sr", label: "Supplier Rumah Makan", short: "Supplier" },
]

export function BrandMark({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "grid h-11 w-11 place-items-center rounded-control border",
          light
            ? "border-white/15 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18)]"
            : "border-primary/20 bg-violet-soft text-primary",
        )}
      >
        <PackageCheck size={20} />
      </span>
      <div>
        <b className="block text-base leading-tight">Buku Usaha Ibu</b>
        <span className={cn("text-xs", light ? "text-white/55" : "text-muted")}>Catatan usaha harian</span>
      </div>
    </div>
  )
}

export function NavList({ items, active, onSelect, icons }) {
  return (
    <div className="space-y-1.5">
      {items.map((item) => {
        const Icon = icons[item.key]
        const on = active === item.key
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            className={cn(
              "flex min-h-12 w-full items-center gap-3 rounded-control px-3 text-left text-sm font-bold transition",
              on
                ? "border border-white/15 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_8px_24px_rgba(98,84,217,.18)]"
                : "border border-transparent text-white/65 hover:bg-white/5 hover:text-white",
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-xl",
                on ? "bg-primary/80 text-white" : "bg-white/5 text-white/70",
              )}
            >
              <Icon size={16} />
            </span>
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
