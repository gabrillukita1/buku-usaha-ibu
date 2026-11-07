import { ClipboardList, Home, Wheat } from "lucide-react"
import { cn } from "../ui.jsx"
import { NAV_ITEMS } from "./navItems.jsx"

const icons = { home: Home, bg: Wheat, sr: ClipboardList }

export default function MobileNav({ active, onChange }) {
  return (
    <nav className="glass fixed inset-x-3 bottom-3 z-30 flex justify-around p-1.5 shadow-float lg:hidden">
      {NAV_ITEMS.map((item) => {
        const Icon = icons[item.key]
        const on = active === item.key
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              "flex min-h-[52px] min-w-[88px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-xs font-bold",
              on ? "bg-violet-soft text-primary" : "text-muted",
            )}
          >
            <Icon size={18} />
            {item.short}
          </button>
        )
      })}
    </nav>
  )
}
