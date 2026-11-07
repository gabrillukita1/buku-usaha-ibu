import { ClipboardList, Plus, ReceiptText } from "lucide-react"
import { Button } from "../../../components/ui.jsx"
import { SummaryCard } from "../../../components/common/SummaryCard.jsx"
import { fmtRp, fmtTgl, today } from "../../../lib/storage.js"
import { orderPaid, orderTotal } from "../../../utils/orders.js"

export default function SupplierDashboard({ pesanan, go }) {
  const pending = pesanan.filter((order) => order.status === "dipesan")
  const debts = pesanan.filter(
    (order) => order.status === "direalisasi" && orderTotal(order) - orderPaid(order) > 0.01,
  )
  const total = debts.reduce((sum, order) => sum + orderTotal(order) - orderPaid(order), 0)

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryCard
          accent="supplier"
          label="Pesanan belum dibelanjakan"
          value={pending.length}
          hint="Perlu direalisasi"
        />
        <SummaryCard
          accent="supplier"
          label="Piutang berjalan"
          value={fmtRp(total)}
          hint={`${new Set(debts.map((order) => order.rumah_makan_id)).size} rumah makan`}
        />
      </div>
      <section className="glass mt-5 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-muted">Pekerjaan hari ini</p>
            <h2 className="mt-1 text-2xl font-extrabold">{fmtTgl(today())}</h2>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-control bg-mint text-supplier">
            <ClipboardList />
          </span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button variant="green" className="w-full" onClick={() => go("pesanan")}>
            Catat pesanan <Plus size={18} />
          </Button>
          <Button variant="outline" className="w-full" onClick={() => go("realisasi")}>
            Realisasi belanja <ReceiptText size={18} />
          </Button>
        </div>
      </section>
    </>
  )
}
