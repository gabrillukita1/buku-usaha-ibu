import { cn } from "../ui.jsx"

export function PageHeader({ eyebrow, title, description, action, accent }) {
  const dots = {
    brambang: "bg-brambang",
    supplier: "bg-supplier",
    primary: "bg-primary",
  }
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {accent && (
          <span className={cn("mt-3 h-2.5 w-2.5 shrink-0 rounded-full", dots[accent])} />
        )}
        <div>
          {eyebrow && <p className="mb-1 text-sm font-semibold tracking-wide text-muted">{eyebrow}</p>}
          <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          {description && <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">{description}</p>}
        </div>
      </div>
      {action}
    </header>
  )
}
