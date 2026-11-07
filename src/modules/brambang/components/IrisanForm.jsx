import { useState } from "react"
import { Button, Card, Field, Input, Select } from "../../../components/ui.jsx"
import { RecordList } from "../../../components/common/RecordList.jsx"
import { fmtTgl, today } from "../../../lib/storage.js"
import { isPositive } from "../../../utils/number.js"

export default function IrisanForm({ rows, workers, insert, toast }) {
  const [id, setId] = useState("")
  const [worker, setWorker] = useState("")
  const [qty, setQty] = useState("")
  const [saving, setSaving] = useState(false)
  const save = async () => {
    if (!id || !worker || !isPositive(qty)) {
      return toast("Lengkapi hasil timbang, pengiris, dan jumlah kg.", "error")
    }
    setSaving(true)
    const row = await insert({
      timbangan_id: Number(id),
      karyawan_id: Number(worker),
      tanggal: today(),
      qty: Number(qty),
    })
    setSaving(false)
    if (row) {
      setId("")
      setWorker("")
      setQty("")
      toast("Hasil irisan tersimpan.")
    }
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.8fr)]">
      <Card>
        <h2 className="text-lg font-extrabold">Catat hasil irisan</h2>
        <div className="mt-5 space-y-4">
          <Field label="Hasil timbang">
            <Select value={id} onChange={(event) => setId(event.target.value)}>
              <option value="">Pilih hasil timbang</option>
              {rows.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.qty} kg kupasan • {fmtTgl(row.tanggal)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Pengiris">
            <Select value={worker} onChange={(event) => setWorker(event.target.value)}>
              <option value="">Pilih pengiris</option>
              {workers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Jumlah diiris (kg)">
            <Input
              type="number"
              min="0.1"
              step="0.1"
              value={qty}
              onChange={(event) => setQty(event.target.value)}
              placeholder="Contoh: 9.5"
            />
          </Field>
          <Button className="w-full" variant="brambang" disabled={saving || !rows.length} onClick={save}>
            {saving ? "Menyimpan…" : "Simpan irisan"}
          </Button>
        </div>
      </Card>
      <RecordList
        title="Menunggu diiris"
        rows={rows}
        render={(row) => (
          <>
            <b>{row.qty} kg kupasan</b>
            <p className="text-sm text-muted">Ditimbang {fmtTgl(row.tanggal)}</p>
          </>
        )}
      />
    </div>
  )
}
