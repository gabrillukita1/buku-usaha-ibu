import { Info } from "lucide-react"
import { Card } from "../ui.jsx"

export function EmptyState({ icon: Icon = Info, title, description, action }) {
  return (
    <Card className="flex min-h-48 flex-col items-center justify-center border-dashed bg-transparent text-center shadow-none">
      <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-white text-muted shadow-card">
        <Icon size={22} />
      </span>
      <h2 className="text-lg font-extrabold">{title}</h2>
      {description && <p className="mt-1 max-w-sm text-base text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  )
}
