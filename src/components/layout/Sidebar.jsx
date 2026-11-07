import { ClipboardList, Home, Wheat } from "lucide-react"
import { BrandMark, NAV_ITEMS, NavList } from "./navItems.jsx"

const icons = { home: Home, bg: Wheat, sr: ClipboardList }

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] flex-col border-r border-white/10 bg-navy px-4 py-5 text-white lg:flex">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 to-transparent" />
      <div className="relative px-2">
        <BrandMark light />
      </div>
      <div className="relative mt-10">
        <p className="mb-3 px-3 text-[11px] font-bold tracking-[0.18em] text-white/40">MENU</p>
        <NavList items={NAV_ITEMS} active={active} onSelect={onChange} icons={icons} />
      </div>
      <div className="relative mt-auto rounded-app border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-md">
        Catatan tersimpan di cloud, siap dibuka lagi besok.
      </div>
    </aside>
  )
}
