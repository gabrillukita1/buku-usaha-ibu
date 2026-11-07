import { useState } from "react"
import { Plus, X } from "lucide-react"
import { supabase } from "../../../lib/supabaseClient.js"
import { Button, Card, Field, Input, Select, useToast } from "../../../components/ui.jsx"
import { StatusBadge } from "../../../components/common/StatusBadge.jsx"
import { fmtTgl, today } from "../../../lib/storage.js"
import { isPositive } from "../../../utils/number.js"

export default function OrderForm({ rumahMakan, pesanan, refresh }) {
  const [rm, setRm] = useState("")
  const [date, setDate] = useState(today())
  const [urgent, setUrgent] = useState(false)
  const [items, setItems] = useState([{ nama: "", qty: "", satuan: "kg" }])
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const update = (index, key, value) =>
    setItems((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)))
  const save = async () => {
    const rows = items.filter((item) => item.nama.trim() && isPositive(item.qty))
    if (!rm || !rows.length) {
      return toast("Pilih rumah makan dan isi minimal satu item dengan jumlah valid.", "error")
    }
    setSaving(true)
    const { data, error } = await supabase
      .from("pesanan")
      .insert({ rumah_makan_id: Number(rm), tanggal: date, dadakan: urgent, status: "dipesan" })
      .select()
    if (error) {
      setSaving(false)
      return toast(`Pesanan gagal disimpan: ${error.message}`, "error")
    }
    const { error: itemError } = await supabase.from("item_pesanan").insert(
      rows.map((item) => ({
        pesanan_id: data[0].id,
        nama: item.nama.trim(),
        qty_pesan: Number(item.qty),
        satuan: item.satuan || "kg",
      })),
    )
    setSaving(false)
    if (itemError) return toast(`Item belum tersimpan: ${itemError.message}`, "error")
    await refresh()
    setItems([{ nama: "", qty: "", satuan: "kg" }])
    setRm("")
    setUrgent(false)
    toast("Pesanan tersimpan.")
  }
  const active = rumahMakan.filter((row) => row.aktif !== false)
  const pending = pesanan.filter((order) => order.status === "dipesan")

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <Card>
        <h2 className="text-lg font-extrabold">Pesanan baru</h2>
        <div className="mt-5 space-y-4">
          <Field label="Rumah makan">
            <Select value={rm} onChange={(event) => setRm(event.target.value)}>
              <option value="">Pilih rumah makan</option>
              {active.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.nama}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tanggal">
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Button variant={!urgent ? "green" : "outline"} onClick={() => setUrgent(false)}>
              Pesanan biasa
            </Button>
            <Button variant={urgent ? "green" : "outline"} onClick={() => setUrgent(true)}>
              Pesanan dadakan
            </Button>
          </div>
          <Field label="Item pesanan">
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-[1fr_72px_72px_44px] gap-2">
                  <Input
                    value={item.nama}
                    onChange={(event) => update(index, "nama", event.target.value)}
                    placeholder="Nama bahan"
                  />
                  <Input
                    type="number"
                    min="0.1"
                    value={item.qty}
                    onChange={(event) => update(index, "qty", event.target.value)}
                    placeholder="Qty"
                  />
                  <Input
                    value={item.satuan}
                    onChange={(event) => update(index, "satuan", event.target.value)}
                    placeholder="kg"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={items.length === 1}
                    onClick={() => setItems((current) => current.filter((_, rowIndex) => rowIndex !== index))}
                  >
                    <X size={18} />
                  </Button>
                </div>
              ))}
            </div>
          </Field>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setItems((current) => [...current, { nama: "", qty: "", satuan: "kg" }])}
          >
            <Plus size={18} /> Tambah item
          </Button>
          <Button variant="green" className="w-full" disabled={saving} onClick={save}>
            {saving ? "Menyimpan…" : "Simpan pesanan"}
          </Button>
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-extrabold">Menunggu realisasi</h2>
        {pending.length ? (
          <div className="mt-2 divide-y divide-line">
            {pending.map((order) => (
              <div className="flex items-center justify-between gap-3 py-3.5" key={order.id}>
                <div>
                  <b>{rumahMakan.find((row) => row.id === order.rumah_makan_id)?.nama || "Rumah makan"}</b>
                  <p className="text-sm text-muted">
                    {order.items?.length || 0} item • {fmtTgl(order.tanggal)}
                  </p>
                </div>
                {order.dadakan && <StatusBadge tone="warning">Dadakan</StatusBadge>}
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-base text-muted">Tidak ada pesanan.</p>
        )}
      </Card>
    </div>
  )
}
