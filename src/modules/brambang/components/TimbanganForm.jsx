import { useState } from "react"
import { Button, Card, Field, Input, Select } from "../../../components/ui.jsx"
import { RecordList } from "../../../components/common/RecordList.jsx"
import { fmtTgl, today } from "../../../lib/storage.js"
import { isPositive } from "../../../utils/number.js"

export default function TimbanganForm({ rows, karyawan, insert, toast }) {
  const [id, setId] = useState("")
  const [qty, setQty] = useState("")
  const [saving, setSaving] = useState(false)
  const save = async () => {
    if (!id || !isPositive(qty)) {
      return toast("Pilih setoran dan masukkan hasil timbang yang benar.", "error")
    }
    setSaving(true)
    const row = await insert({ setoran_id: Number(id), tanggal: today(), qty: Number(qty) })
    setSaving(false)
    if (row) {
      setId("")
      setQty("")
      toast("Hasil timbangan tersimpan.")
    }
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.8fr)]">
      <Card>
        <h2 className="text-lg font-extrabold">Catat timbang sore</h2>
        <p className="mt-1 text-sm text-muted">Upah pengupas dihitung dari hasil timbangan ini.</p>
        <div className="mt-5 space-y-4">
          <Field label="Setoran yang ditimbang">
            <Select value={id} onChange={(event) => setId(event.target.value)}>
              <option value="">Pilih setoran</option>
              {rows.map((row) => (
                <option key={row.id} value={row.id}>
                  {karyawan.find((item) => item.id === row.karyawan_id)?.nama || "Karyawan"} — {row.qty} kg (
                  {fmtTgl(row.tanggal)})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Hasil kupasan (kg)">
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
            {saving ? "Menyimpan…" : "Simpan timbangan"}
          </Button>
        </div>
      </Card>
      <RecordList
        title="Menunggu ditimbang"
        rows={rows}
        render={(row) => (
          <>
            <b>{karyawan.find((item) => item.id === row.karyawan_id)?.nama || "Karyawan"}</b>
            <p className="text-sm text-muted">
              {row.qty} kg • {fmtTgl(row.tanggal)}
            </p>
          </>
        )}
      />
    </div>
  )
}
