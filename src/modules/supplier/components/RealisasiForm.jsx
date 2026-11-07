import { useState } from "react"
import { Check } from "lucide-react"
import { supabase } from "../../../lib/supabaseClient.js"
import { Button, Card, Field, Input, Select, useToast } from "../../../components/ui.jsx"
import { fmtTgl } from "../../../lib/storage.js"
import { isPositive } from "../../../utils/number.js"

export default function RealisasiForm({ pesanan, rumahMakan, refresh, setReceipt }) {
  const pending = pesanan.filter((order) => order.status === "dipesan")
  const [id, setId] = useState("")
  const [form, setForm] = useState([])
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const order = pesanan.find((item) => item.id === Number(id))
  const choose = (value) => {
    setId(value)
    const selected = pesanan.find((item) => item.id === Number(value))
    setForm(
      selected?.items.map((item) => ({
        qty: item.qty_beli ?? "",
        buy: item.harga_beli ?? "",
        sell: item.harga_jual ?? "",
        note: item.catatan ?? "",
      })) || [],
    )
  }
  const edit = (index, key, value) =>
    setForm((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)))
  const save = async () => {
    if (!order) return
    if (form.some((row) => !isPositive(row.qty) || !isPositive(row.sell) || Number(row.buy) < 0)) {
      return toast("Lengkapi qty dan harga jual lebih dari 0. Harga beli tidak boleh negatif.", "error")
    }
    setSaving(true)
    const updates = await Promise.all(
      order.items.map((item, index) =>
        supabase
          .from("item_pesanan")
          .update({
            qty_beli: Number(form[index].qty),
            harga_beli: Number(form[index].buy) || 0,
            harga_jual: Number(form[index].sell),
            catatan: form[index].note,
          })
          .eq("id", item.id),
      ),
    )
    const failed = updates.find((result) => result.error)
    if (failed) {
      setSaving(false)
      return toast(`Realisasi gagal: ${failed.error.message}`, "error")
    }
    const { error } = await supabase.from("pesanan").update({ status: "direalisasi" }).eq("id", order.id)
    setSaving(false)
    if (error) return toast(`Status pesanan gagal: ${error.message}`, "error")
    const completed = {
      ...order,
      items: order.items.map((item, index) => ({
        ...item,
        qty_beli: Number(form[index].qty),
        harga_jual: Number(form[index].sell),
      })),
    }
    await refresh()
    setReceipt({ p: completed, rm: rumahMakan.find((row) => row.id === order.rumah_makan_id) })
    setId("")
    toast("Realisasi tersimpan dan kwitansi siap.")
  }

  return (
    <Card>
      <h2 className="text-lg font-extrabold">Realisasi belanja</h2>
      <p className="mt-1 text-sm text-muted">Qty dipesan ditampilkan sebagai referensi saat belanja.</p>
      <div className="mt-5 space-y-4">
        <Field label="Pesanan">
          <Select value={id} onChange={(event) => choose(event.target.value)}>
            <option value="">Pilih pesanan</option>
            {pending.map((item) => (
              <option key={item.id} value={item.id}>
                {rumahMakan.find((row) => row.id === item.rumah_makan_id)?.nama} — {fmtTgl(item.tanggal)}
              </option>
            ))}
          </Select>
        </Field>
        {order &&
          form.map((row, index) => {
            const item = order.items[index]
            return (
              <div className="rounded-control border border-line bg-[#FBF9F6] p-4" key={item.id}>
                <b>{item.nama}</b>
                <p className="mt-1 text-sm text-muted">
                  Dipesan: {item.qty_pesan} {item.satuan}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Qty aktual">
                    <Input
                      type="number"
                      min="0.1"
                      value={row.qty}
                      onChange={(event) => edit(index, "qty", event.target.value)}
                    />
                  </Field>
                  <Field label="Harga beli">
                    <Input
                      type="number"
                      min="0"
                      value={row.buy}
                      onChange={(event) => edit(index, "buy", event.target.value)}
                    />
                  </Field>
                  <Field label="Harga jual">
                    <Input
                      type="number"
                      min="0.1"
                      value={row.sell}
                      onChange={(event) => edit(index, "sell", event.target.value)}
                    />
                  </Field>
                  <Field label="Catatan (opsional)">
                    <Input value={row.note} onChange={(event) => edit(index, "note", event.target.value)} />
                  </Field>
                </div>
              </div>
            )
          })}
        {order && (
          <Button variant="green" className="w-full" disabled={saving} onClick={save}>
            {saving ? "Menyimpan…" : "Simpan realisasi & buat kwitansi"} <Check size={18} />
          </Button>
        )}
      </div>
    </Card>
  )
}
