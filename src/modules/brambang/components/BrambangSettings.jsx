import { useState } from "react"
import { Button, Card, ConfirmDialog, Field, Input, useToast } from "../../../components/ui.jsx"
import { fmtRp, fmtTgl, today } from "../../../lib/storage.js"
import { isPositive } from "../../../utils/number.js"

export default function BrambangSettings({ karyawan, harga, tables }) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("pengupas")
  const [kupas, setKupas] = useState("")
  const [iris, setIris] = useState("")
  const [date, setDate] = useState(today())
  const [confirm, setConfirm] = useState(null)
  const toast = useToast()

  const addWorker = async () => {
    if (!name.trim()) return toast("Masukkan nama karyawan.", "error")
    const row = await tables.karyawanT.insert({ nama: name.trim(), peran: role, aktif: true })
    if (row) {
      setName("")
      toast("Karyawan ditambahkan.")
    }
  }
  const addRate = async () => {
    if (!isPositive(kupas) && !isPositive(iris)) {
      return toast("Masukkan minimal satu tarif yang benar.", "error")
    }
    const prev = harga.filter((row) => row.mulai <= date).sort((a, b) => b.mulai.localeCompare(a.mulai))[0] || {}
    const row = await tables.hargaT.insert({
      kupas: isPositive(kupas) ? Number(kupas) : prev.kupas || 0,
      iris: isPositive(iris) ? Number(iris) : prev.iris || 0,
      mulai: date,
    })
    if (row) {
      setKupas("")
      setIris("")
      toast("Tarif baru tersimpan.")
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <h2 className="text-lg font-extrabold">Tambah karyawan</h2>
        <div className="mt-5 space-y-4">
          <Field label="Nama">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama karyawan" />
          </Field>
          <Field label="Peran">
            <div className="grid grid-cols-2 gap-2">
              {["pengupas", "pengiris"].map((value) => (
                <Button
                  key={value}
                  variant={role === value ? "brambang" : "outline"}
                  onClick={() => setRole(value)}
                >
                  {value === "pengupas" ? "Pengupas" : "Pengiris"}
                </Button>
              ))}
            </div>
          </Field>
          <Button className="w-full" variant="brambang" onClick={addWorker}>
            Tambah karyawan
          </Button>
        </div>
        <div className="mt-6 divide-y divide-line">
          {karyawan
            .filter((worker) => worker.aktif !== false)
            .map((worker) => (
              <div key={worker.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <b>{worker.nama}</b>
                  <p className="text-sm text-muted">{worker.peran}</p>
                </div>
                <Button size="small" variant="outline" onClick={() => setConfirm(worker)}>
                  Nonaktifkan
                </Button>
              </div>
            ))}
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-extrabold">Tarif upah per kg</h2>
        <p className="mt-1 text-sm text-muted">Tarif digunakan otomatis sesuai tanggal transaksi.</p>
        <div className="mt-5 space-y-4">
          <Field label="Mulai berlaku">
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </Field>
          <Field label="Upah kupas (Rp/kg)">
            <Input
              type="number"
              min="0"
              value={kupas}
              onChange={(event) => setKupas(event.target.value)}
              placeholder="Contoh: 3000"
            />
          </Field>
          <Field label="Upah iris (Rp/kg)">
            <Input
              type="number"
              min="0"
              value={iris}
              onChange={(event) => setIris(event.target.value)}
              placeholder="Contoh: 4000"
            />
          </Field>
          <Button className="w-full" variant="brambang" onClick={addRate}>
            Simpan tarif
          </Button>
        </div>
        <div className="mt-6">
          <p className="text-sm font-extrabold text-muted">Riwayat tarif</p>
          <div className="mt-2 divide-y divide-line">
            {harga.map((row) => (
              <div key={row.id} className="flex justify-between gap-3 py-3 text-sm">
                <span>{fmtTgl(row.mulai)}</span>
                <span className="num text-right font-bold">
                  Kupas {fmtRp(row.kupas)} • Iris {fmtRp(row.iris)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
      {confirm && (
        <ConfirmDialog
          open
          onOpenChange={() => setConfirm(null)}
          title="Nonaktifkan karyawan?"
          description={`${confirm.nama} tidak akan muncul pada input baru. Riwayat tetap tersimpan.`}
          confirmText="Nonaktifkan"
          tone="danger"
          onConfirm={async () => {
            const row = await tables.karyawanT.update(confirm.id, { aktif: false })
            if (row) toast("Karyawan dinonaktifkan.")
            setConfirm(null)
          }}
        />
      )}
    </div>
  )
}
