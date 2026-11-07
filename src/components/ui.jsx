import * as DialogPrimitive from "@radix-ui/react-dialog"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { createContext, useContext, useState } from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...input) => twMerge(clsx(input))

export function Button({
  className,
  variant = "primary",
  size = "default",
  type = "button",
  ...props
}) {
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-[#6254D9]/25 hover:bg-[#5145BD]",
    secondary: "bg-violet-soft text-[#4C41AE] hover:bg-[#E3DDFB]",
    brambang: "bg-brambang text-white shadow-lg shadow-[#D97745]/25 hover:bg-[#C46838]",
    green: "bg-supplier text-white shadow-lg shadow-[#168B78]/20 hover:bg-[#117563]",
    outline: "border border-line bg-white text-ink hover:bg-[#F7F5F2]",
    ghost: "text-muted hover:bg-[#F0EEEA]",
    danger: "bg-danger text-white hover:bg-[#A94046]",
  }
  const sizes = {
    default: "min-h-12 px-5 text-base",
    small: "min-h-11 px-4 text-sm",
    icon: "h-12 w-12 p-0",
  }
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-control font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function Card({ className, children }) {
  return <section className={cn("surface p-4 sm:p-5", className)}>{children}</section>
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "min-h-12 w-full rounded-control border border-line bg-white px-4 text-base text-ink shadow-sm placeholder:text-[#9A9790]",
        className,
      )}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "min-h-12 w-full rounded-control border border-line bg-white px-4 text-base text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export function Field({ label, help, error, children }) {
  return (
    <div className="space-y-2">
      <label className="field-label">{label}</label>
      {children}
      {error ? (
        <p className="text-sm font-semibold text-danger">{error}</p>
      ) : help ? (
        <p className="field-help">{help}</p>
      ) : null}
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="page">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-56 rounded-control bg-[#E7E2DB]" />
        <div className="h-36 rounded-app bg-[#E7E2DB]" />
        <div className="h-28 rounded-app bg-[#E7E2DB]" />
      </div>
    </div>
  )
}

const ToastContext = createContext(() => {})
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const toast = (message, tone = "success") => {
    const id = Date.now()
    setToasts((current) => [...current, { id, message, tone }])
    setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 4200)
  }
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed right-4 top-4 z-[100] space-y-2" aria-live="polite">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "glass flex max-w-sm items-center gap-3 px-4 py-3 text-sm font-bold text-ink",
              item.tone === "error" && "border-danger/40",
            )}
          >
            {item.tone === "error" ? (
              <AlertCircle className="text-danger" />
            ) : (
              <CheckCircle2 className="text-success" />
            )}
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
export const useToast = () => useContext(ToastContext)

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Lanjutkan",
  tone = "primary",
  onConfirm,
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#20212A]/45 backdrop-blur-sm" />
        <DialogPrimitive.Content className="glass fixed left-4 right-4 top-1/2 z-50 max-w-md -translate-y-1/2 p-5 sm:left-1/2 sm:right-auto sm:w-[calc(100%-2rem)] sm:-translate-x-1/2">
          <DialogPrimitive.Title className="text-xl font-extrabold">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 text-base leading-relaxed text-muted">
            {description}
          </DialogPrimitive.Description>
          <div className="mt-6 flex gap-3">
            <DialogPrimitive.Close asChild>
              <Button className="flex-1" variant="outline">
                Batal
              </Button>
            </DialogPrimitive.Close>
            <Button
              className="flex-1"
              variant={tone === "danger" ? "danger" : "primary"}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export function Dialog({ open, onOpenChange, title, children }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#20212A]/45 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-t-[24px] border border-white/70 bg-[#FFFEFC]/95 p-5 shadow-float backdrop-blur-xl sm:left-1/2 sm:right-auto sm:top-1/2 sm:bottom-auto sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-app">
          <div className="mb-5 flex items-center justify-between">
            <DialogPrimitive.Title className="text-xl font-extrabold">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Tutup">
                <X />
              </Button>
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
