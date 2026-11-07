import { useState } from "react"
import { ReceiptText, Wallet } from "lucide-react"
import { supabase } from "../../../lib/supabaseClient.js"
import { Button, Card, Dialog, Field, Input, useToast } from "../../../components/ui.jsx"
import { EmptyState } from "../../../components/common/EmptyState.jsx"
import { fmtRp, fmtTgl, today } from "../../../lib/storage.js"
import { isPositive } from "../../../utils/number.js"
import { orderPaid, orderTotal } from "../../../utils/orders.js"

export default function ReceivableSummary({ pesanan, rumahMakan, refresh, setReceipt }) {
  const [pay, setPay] = useState(null)
  const [amount, setAmount] = useState("")
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const groups = rumahMakan
    .map((restaurant) => ({
      rm: restaurant,
      rows: pesanan.filter(
        (order) =>
          order.rumah_makan_id === restaurant.id &&
          order.status === "direalisasi" &&
          orderTotal(order) - orderPaid(order) > 0.01,
      ),
    }))
    .filter((group) => group.rows.length)
  const save = async () => {
    if (!pay || !isPositive(amount)) return toast("Masukkan jumlah pembayaran lebih dari 0.", "error")
    setSaving(true)
    const { error } = await supabase
      .from("pembayaran_sr")
      .insert({ pesanan_id: pay.id, tanggal: today(), jumlah: Number(amount) })
    setSaving(false)
    if (error) return toast(`Pembayaran gagal: ${error.message}`, "error")
    await refresh()
    setPay(null)
    setAmount("")
    toast("Pembayaran dicatat.")
  }

  return (
    <>
      {groups.length ? (
        groups.map(({ rm, rows }) => (
          <Card className="mb-4" key={rm.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">{rm.nama}</h2>
                <p className="text-sm text-muted">Saldo berjalan</p>
              </div>
              <p className="num text-xl font-extrabold">
                {fmtRp(rows.reduce((sum, order) => sum + orderTotal(order) - orderPaid(order), 0))}
              </p>
            </div>
            <div className="mt-4 divide-y divide-line">
              {rows.map((order) => (
                <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between" key={order.id}>
                  <div>
                    <p className="font-bold">{fmtTgl(order.tanggal)}</p>
                    <p className="text-sm text-muted">
                      Tagihan {fmtRp(orderTotal(order))} • sudah bayar {fmtRp(orderPaid(order))}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="small" variant="outline" onClick={() => setReceipt({ p: order, rm })}>
                      <ReceiptText size={16} /> Kwitansi
                    </Button>
                    <Button size="small" variant="green" onClick={() => setPay(order)}>
                      <Wallet size={16} /> Bayar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))
      ) : (
        <EmptyState
          icon={Wallet}
          title="Tidak ada piutang"
          description="Semua pesanan yang direalisasi sudah lunas."
        />
      )}
      {pay && (
        <Dialog open onOpenChange={() => setPay(null)} title="Catat pembayaran">
          <div className="space-y-4">
            <p className="text-base text-muted">
              Sisa tagihan: <b className="num text-ink">{fmtRp(orderTotal(pay) - orderPaid(pay))}</b>
            </p>
            <Field label="Jumlah diterima (Rp)">
              <Input
                autoFocus
                type="number"
                min="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Contoh: 50000"
              />
            </Field>
            <Button variant="green" className="w-full" disabled={saving} onClick={save}>
              {saving ? "Menyimpan…" : "Simpan pembayaran"}
            </Button>
          </div>
        </Dialog>
      )}
    </>
  )
}
