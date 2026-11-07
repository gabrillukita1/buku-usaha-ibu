import * as Dialog from "@radix-ui/react-dialog"
import { ClipboardList, Home, Menu, Wheat, X } from "lucide-react"
import { Button } from "../ui.jsx"
import { BrandMark, NAV_ITEMS, NavList } from "./navItems.jsx"

const icons = { home: Home, bg: Wheat, sr: ClipboardList }

export default function MobileDrawer({ open, onOpenChange, active, onChange }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <Button className="lg:hidden" variant="primary" size="icon" aria-label="Buka menu">
          <Menu />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#20212A]/45 backdrop-blur-sm" />
        <Dialog.Content className="glass-dark fixed inset-y-3 left-3 z-50 flex w-[min(86%,20rem)] flex-col rounded-app p-5 text-white shadow-float">
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <div className="mb-8 flex items-center justify-between gap-3">
            <BrandMark light />
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" aria-label="Tutup menu">
                <X />
              </Button>
            </Dialog.Close>
          </div>
          <NavList
            items={NAV_ITEMS}
            active={active}
            icons={icons}
            onSelect={(key) => {
              onChange(key)
              onOpenChange(false)
            }}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
