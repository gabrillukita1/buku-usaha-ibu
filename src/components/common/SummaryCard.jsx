import { Card, cn } from "../ui.jsx"

export function SummaryCard({ label, value, hint, accent = "brambang" }) {
  const bar = accent === "supplier" ? "bg-supplier" : accent === "primary" ? "bg-primary" : "bg-brambang"
  return (
    <Card className="relative overflow-hidden">
      <span className={cn("absolute inset-y-4 left-0 w-1 rounded-r-full", bar)} />
      <div className="pl-3">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <p className="num mt-2 text-3xl font-extrabold tracking-tight text-ink">{value}</p>
        {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      </div>
    </Card>
  )
}
