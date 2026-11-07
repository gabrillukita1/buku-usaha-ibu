import { useState } from "react"
import { Check, ChevronLeft, ChevronRight, Clock3, Users } from "lucide-react"
import { Button, Card, ConfirmDialog, useToast } from "../../../components/ui.jsx"
import { EmptyState } from "../../../components/common/EmptyState.jsx"
import { StatusBadge } from "../../../components/common/StatusBadge.jsx"
import { fmtRp, fmtTgl, today, weekRange } from "../../../lib/storage.js"
import { calculatePayroll } from "../utils/payroll.js"

export default function UpahSummary({
  karyawan,
  harga,
  setoran,
  timbangan,
  irisan,
  pembayaran,
  tables,
}) {
  const [offset, setOffset] = useState(0)
  const [confirm, setConfirm] = useState(null)
  const toast = useToast()
  const range = weekRange(offset)
  const data = calculatePayroll(karyawan, harga, setoran, timbangan, irisan, pembayaran, range)
  const submit = async () => {
    if (!confirm) return
    const existing = pembayaran.find(
      (row) => row.karyawan_id === confirm.karyawan.id && row.minggu_mulai === range.start,
    )
    const ok = existing
      ? await tables.pembayaranT.remove(existing.id)
      : await tables.pembayaranT.insert({
          karyawan_id: confirm.karyawan.id,
          minggu_mulai: range.start,
          tanggal_bayar: today(),
        })
    if (ok) toast(existing ? "Status pembayaran dibatalkan." : "Upah ditandai sudah dibayar.")
    setConfirm(null)
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => setOffset(offset - 1)} aria-label="Minggu sebelumnya">
          <ChevronLeft />
        </Button>
        <div className="text-center">
          <p className="text-sm font-semibold text-muted">Periode rekap</p>
          <p className="font-extrabold">
            {fmtTgl(range.start)} – {fmtTgl(range.end)}
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setOffset(offset + 1)} aria-label="Minggu berikutnya">
          <ChevronRight />
        </Button>
      </div>
      {data.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((row) => (
            <Card key={row.karyawan.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold">{row.karyawan.nama}</h2>
                  <p className="text-sm text-muted">
                    {row.karyawan.peran === "pengupas"
                      ? "Pengupas • berdasarkan timbang sore"
                      : "Pengiris • berdasarkan hasil irisan"}
                  </p>
                </div>
                <StatusBadge tone={row.lunas ? "success" : "warning"}>
                  {row.lunas ? "Sudah dibayar" : "Belum dibayar"}
                </StatusBadge>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted">Total kerja</p>
                  <p className="num text-xl font-extrabold">{row.kg.toFixed(1)} kg</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-muted">Total upah</p>
                  <p className="num text-2xl font-extrabold">{fmtRp(row.total)}</p>
                </div>
              </div>
              <Button
                className="mt-5 w-full"
                variant={row.lunas ? "outline" : "brambang"}
                onClick={() => setConfirm(row)}
              >
                {row.lunas ? "Batalkan status lunas" : "Tandai sudah dibayar"}{" "}
                {row.lunas ? <Clock3 size={18} /> : <Check size={18} />}
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Belum ada upah pada minggu ini"
          description="Data akan muncul setelah timbang sore atau hasil irisan dicatat."
        />
      )}
      {confirm && (
        <ConfirmDialog
          open={!!confirm}
          onOpenChange={() => setConfirm(null)}
          title={confirm.lunas ? "Batalkan status lunas?" : "Tandai upah sudah dibayar?"}
          description={`${confirm.karyawan.nama}: ${fmtRp(confirm.total)} untuk ${confirm.kg.toFixed(1)} kg.`}
          confirmText={confirm.lunas ? "Batalkan" : "Ya, sudah dibayar"}
          onConfirm={submit}
        />
      )}
    </>
  )
}
