import { useState } from "react"
import { Button, Card, Field, Input, Select } from "../../../components/ui.jsx"
import { RecordList } from "../../../components/common/RecordList.jsx"
import { fmtTgl } from "../../../lib/storage.js"
import { isPositive } from "../../../utils/number.js"

export default function SetoranForm({ workers, date, setDate, insert, toast, records, karyawan }) {
  const [worker, setWorker] = useState("")
  const [qty, setQty] = useState("")
  const [saving, setSaving] = useState(false)
  const save = async () => {
    if (!worker || !isPositive(qty)) {
      return toast("Pilih pengupas dan masukkan jumlah kg lebih dari 0.", "error")
    }
    setSaving(true)
    const row = await insert({ tanggal: date, karyawan_id: Number(worker), qty: Number(qty) })
    setSaving(false)
    if (row) {
      setQty("")
      toast("Setoran tersimpan.")
    }
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.8fr)]">
      <Card>
        <h2 className="text-lg font-extrabold">Catat setoran pagi</h2>
        <div className="mt-5 space-y-4">
          <Field label="Tanggal">
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </Field>
          <Field label="Pengupas">
            <Select value={worker} onChange={(event) => setWorker(event.target.value)}>
              <option value="">Pilih pengupas</option>
              {workers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Bawang mentah disetor (kg)">
            <Input
              inputMode="decimal"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Contoh: 15"
              value={qty}
              onChange={(event) => setQty(event.target.value)}
            />
          </Field>
          <Button className="w-full" variant="brambang" disabled={saving} onClick={save}>
            {saving ? "Menyimpan…" : "Simpan setoran"}
          </Button>
        </div>
      </Card>
      <RecordList
        title="Setoran pada tanggal ini"
        rows={records}
        render={(row) => (
          <>
            <b>{karyawan.find((item) => item.id === row.karyawan_id)?.nama || "Karyawan"}</b>
            <p className="text-sm text-muted">{row.qty} kg bawang mentah</p>
          </>
        )}
      />
    </div>
  )
}
