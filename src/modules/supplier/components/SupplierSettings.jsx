import { useState } from "react"
import { Button, Card, ConfirmDialog, Field, Input, useToast } from "../../../components/ui.jsx"

export default function SupplierSettings({ rumahMakan, rmT }) {
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [confirm, setConfirm] = useState(null)
  const toast = useToast()
  const add = async () => {
    if (!name.trim()) return toast("Masukkan nama rumah makan.", "error")
    const row = await rmT.insert({ nama: name.trim(), kontak: contact, aktif: true })
    if (row) {
      setName("")
      setContact("")
      toast("Rumah makan ditambahkan.")
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <h2 className="text-lg font-extrabold">Tambah rumah makan</h2>
        <div className="mt-5 space-y-4">
          <Field label="Nama">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama rumah makan" />
          </Field>
          <Field label="Kontak (opsional)">
            <Input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Nomor HP" />
          </Field>
          <Button variant="green" className="w-full" onClick={add}>
            Tambah rumah makan
          </Button>
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-extrabold">Rumah makan aktif</h2>
        <div className="mt-4 divide-y divide-line">
          {rumahMakan
            .filter((row) => row.aktif !== false)
            .map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <b>{row.nama}</b>
                  <p className="text-sm text-muted">{row.kontak || "Kontak belum diisi"}</p>
                </div>
                <Button size="small" variant="outline" onClick={() => setConfirm(row)}>
                  Nonaktifkan
                </Button>
              </div>
            ))}
        </div>
      </Card>
      {confirm && (
        <ConfirmDialog
          open
          onOpenChange={() => setConfirm(null)}
          title="Nonaktifkan rumah makan?"
          description={`${confirm.nama} tidak dapat dipilih pada pesanan baru. Riwayat tetap tersimpan.`}
          confirmText="Nonaktifkan"
          tone="danger"
          onConfirm={async () => {
            const row = await rmT.update(confirm.id, { aktif: false })
            if (row) toast("Rumah makan dinonaktifkan.")
            setConfirm(null)
          }}
        />
      )}
    </div>
  )
}
