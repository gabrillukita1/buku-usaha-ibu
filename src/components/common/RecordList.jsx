import { Card } from "../ui.jsx"

export function RecordList({ title, rows, render, empty = "Tidak ada data yang menunggu." }) {
  return (
    <Card>
      <h2 className="text-lg font-extrabold">{title}</h2>
      {rows.length ? (
        <div className="mt-2 divide-y divide-line">
          {rows.map((row) => (
            <div key={row.id} className="py-3.5">
              {render(row)}
            </div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-base text-muted">{empty}</p>
      )}
    </Card>
  )
}
