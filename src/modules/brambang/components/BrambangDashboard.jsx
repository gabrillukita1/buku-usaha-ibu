import { Wheat } from "lucide-react"
import { Button } from "../../../components/ui.jsx"
import { StatusBadge } from "../../../components/common/StatusBadge.jsx"
import { SummaryCard } from "../../../components/common/SummaryCard.jsx"
import { fmtTgl, today, weekRange } from "../../../lib/storage.js"
import { calculatePayroll } from "../utils/payroll.js"

export default function BrambangDashboard({
  setoran,
  timbangan,
  irisan,
  karyawan,
  pembayaran,
  harga,
  go,
}) {
  const date = today()
  const needWeigh = setoran.filter(
    (row) => row.tanggal === date && !timbangan.some((item) => item.setoran_id === row.id),
  )
  const needSlice = timbangan.filter(
    (row) => row.tanggal === date && !irisan.some((item) => item.timbangan_id === row.id),
  )
  const payroll = calculatePayroll(karyawan, harga, setoran, timbangan, irisan, pembayaran, weekRange(0))
  const unpaid = payroll.filter((row) => !row.lunas).length

  return (
    <>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Perlu ditimbang" value={needWeigh.length} hint="Setoran hari ini" />
        <SummaryCard label="Perlu diiris" value={needSlice.length} hint="Hasil timbangan" />
        <SummaryCard label="Upah belum lunas" value={unpaid} hint="Minggu berjalan" />
      </div>
      <section className="glass p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-muted">Pekerjaan hari ini</p>
            <h2 className="mt-1 text-2xl font-extrabold">{fmtTgl(date)}</h2>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-control bg-orange-soft text-brambang">
            <Wheat />
          </span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Task
            title="Timbang setoran"
            count={needWeigh.length}
            description="Setoran pagi yang belum ditimbang"
            action={() => go("proses")}
          />
          <Task
            title="Iris kupasan"
            count={needSlice.length}
            description="Hasil timbang yang belum diiris"
            action={() => go("proses")}
          />
        </div>
        <Button className="mt-4 w-full" variant="brambang" onClick={() => go("proses")}>
          Catat proses hari ini
        </Button>
      </section>
    </>
  )
}

function Task({ title, count, description, action }) {
  return (
    <button
      type="button"
      onClick={action}
      className="rounded-control border border-line bg-white/70 p-4 text-left transition hover:bg-white"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-extrabold">{title}</p>
        <StatusBadge tone={count ? "warning" : "success"}>
          {count ? `${count} menunggu` : "Selesai"}
        </StatusBadge>
      </div>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </button>
  )
}
