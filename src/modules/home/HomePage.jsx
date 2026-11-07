import { useState } from "react"
import { ArrowUpRight, Scissors } from "lucide-react"
import { PageHeader } from "../../components/common/PageHeader.jsx"
import { SegmentedControl } from "../../components/common/SegmentedControl.jsx"
import { EmptyState } from "../../components/common/EmptyState.jsx"
import { StatusBadge } from "../../components/common/StatusBadge.jsx"
import { LoadingState } from "../../components/ui.jsx"
import { useTable } from "../../lib/useTable.js"
import { fmtRp, fmtTgl, fmtTglPanjang, greeting, today } from "../../lib/storage.js"
import { buildHomeView } from "./homeMetrics.js"

const PERIODS = [
  { value: "today", label: "Hari ini" },
  { value: "week", label: "Minggu ini" },
  { value: "month", label: "Bulan ini" },
]

export default function HomePage({ onChange }) {
  const [period, setPeriod] = useState("today")
  const setoran = useTable("setoran")
  const timbangan = useTable("timbangan")
  const irisan = useTable("irisan")
  const harga = useTable("harga")
  const pembayaran = useTable("pembayaran_bg")
  const pesanan = useTable("pesanan", {
    select: "*, items:item_pesanan(*), payments:pembayaran_sr(*)",
  })
  if ([setoran, timbangan, irisan, harga, pembayaran, pesanan].some((table) => table.loading)) {
    return <LoadingState />
  }

  const view = buildHomeView(
    {
      setoran: setoran.data,
      timbangan: timbangan.data,
      irisan: irisan.data,
      harga: harga.data,
      pembayaran: pembayaran.data,
      pesanan: pesanan.data,
    },
    period,
  )
  const headline = view.tasks.length
    ? `${view.tasks.length} hal perlu perhatian.`
    : "Tidak ada pekerjaan yang tertunda."

  return (
    <div className="page">
      <PageHeader
        eyebrow={`${greeting()} · ${fmtTglPanjang(today())}`}
        title={headline}
        description="Angka di bawah mengikuti periode yang dipilih. Upah tetap dihitung untuk minggu berjalan."
        action={
          <div className="w-full sm:w-auto lg:w-96">
            <SegmentedControl value={period} onChange={setPeriod} options={PERIODS} />
          </div>
        }
      />

      <section className="glass relative mb-6 overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-primary/15 blur-2xl" />
        <p className="text-sm font-semibold text-muted">Kondisi usaha</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <button type="button" onClick={() => onChange("bg")} className="text-left">
            <p className="text-sm font-bold text-brambang">Brambang Goreng</p>
            <p className="num mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{fmtRp(view.totalUnpaid)}</p>
            <p className="mt-1 text-sm leading-snug text-muted">Upah minggu ini belum dibayar</p>
          </button>
          <button type="button" onClick={() => onChange("sr")} className="border-l border-line pl-4 text-left">
            <p className="text-sm font-bold text-supplier">Supplier</p>
            <p className="num mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{fmtRp(view.debt)}</p>
            <p className="mt-1 text-sm leading-snug text-muted">Piutang yang masih berjalan</p>
          </button>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,.85fr)]">
        <section>
          <h2 className="mb-3 text-lg font-extrabold">Perlu diselesaikan</h2>
          {view.tasks.length ? (
            <div className="divide-y divide-line overflow-hidden rounded-app border border-line bg-surface">
              {view.tasks.map(([count, label, target]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onChange(target)}
                  className="flex min-h-16 w-full items-center justify-between gap-3 px-4 text-left hover:bg-[#F7F5F2]"
                >
                  <span className="font-bold">{label}</span>
                  <span className="num inline-flex items-center gap-2 rounded-full bg-[#F0EEEA] px-3 py-1 text-sm font-extrabold">
                    {typeof count === "number" && label.startsWith("Upah") ? fmtRp(count) : count}
                    <ArrowUpRight size={14} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Scissors}
              title="Semua pekerjaan sudah selesai"
              description="Tidak ada yang perlu ditindaklanjuti."
            />
          )}
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-lg font-extrabold">Brambang Goreng</h2>
            <dl className="space-y-3">
              <Metric label="Setoran" value={`${view.setoranKg.toFixed(1)} kg`} />
              <Metric label="Hasil timbang" value={`${view.timbangKg.toFixed(1)} kg`} />
              <Metric label="Sudah diiris" value={`${view.irisKg.toFixed(1)} kg`} />
            </dl>
            <div className="mt-4 space-y-2">
              <PayRow label="Pengupas" data={view.kupas} />
              <PayRow label="Pengiris" data={view.irisRole} />
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-extrabold">Supplier</h2>
            <dl className="space-y-3">
              <Metric label="Belum direalisasi" value={view.pendingO.length} />
              <Metric label="Rumah makan berutang" value={new Set(view.debts.map((row) => row.rumah_makan_id)).size} />
              <Metric label="Pembayaran diterima" value={fmtRp(view.received)} />
            </dl>
          </div>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-extrabold">Aktivitas terbaru</h2>
        {view.recent.length ? (
          <div className="divide-y divide-line">
            {view.recent.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-muted">{item.detail}</p>
                </div>
                <p className="text-sm font-semibold text-muted">{fmtTgl(item.date)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base text-muted">Belum ada catatan pada kedua usaha.</p>
        )}
      </section>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/80 pb-2">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="num text-base font-extrabold">{value}</dd>
    </div>
  )
}

function PayRow({ label, data }) {
  const settled = data.done || data.total === 0
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="font-bold">{label}</p>
        <p className="text-sm text-muted">{data.total ? fmtRp(data.unpaid) : "Belum ada upah"}</p>
      </div>
      <StatusBadge tone={settled ? "success" : "warning"}>{settled ? "Sudah dibayar" : "Belum dibayar"}</StatusBadge>
    </div>
  )
}
