import { useState } from "react"
import MobileDrawer from "./MobileDrawer.jsx"
import MobileNav from "./MobileNav.jsx"
import Sidebar from "./Sidebar.jsx"

export default function AppShell({ active, onChange, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="app-shell lg:grid lg:grid-cols-[268px_1fr]">
      <Sidebar active={active} onChange={onChange} />
      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-30 border-b border-white/50 bg-[#F5F3F0]/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <p className="hidden text-sm font-semibold text-muted lg:block">
              Mama Ina Corporation.
            </p>
            <p className="text-sm font-extrabold lg:hidden">Buku Usaha Ibu</p>
            <MobileDrawer open={open} onOpenChange={setOpen} active={active} onChange={onChange} />
          </div>
        </header>
        <main>{children}</main>
      </div>
      <MobileNav active={active} onChange={onChange} />
    </div>
  )
}
