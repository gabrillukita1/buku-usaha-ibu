import { useState } from "react"
import { Button, cn, useToast } from "../../../components/ui.jsx"
import { today } from "../../../lib/storage.js"
import IrisanForm from "./IrisanForm.jsx"
import SetoranForm from "./SetoranForm.jsx"
import TimbanganForm from "./TimbanganForm.jsx"

const STEPS = [
  ["setor", "1. Setor"],
  ["timbang", "2. Timbang"],
  ["iris", "3. Iris"],
]

export default function DailyProcess({ karyawan, setoran, timbangan, irisan, tables }) {
  const [stage, setStage] = useState("setor")
  const [date, setDate] = useState(today())
  const toast = useToast()
  const active = karyawan.filter((worker) => worker.aktif !== false)
  const pendingWeigh = setoran.filter((row) => !timbangan.some((item) => item.setoran_id === row.id))
  const pendingSlice = timbangan.filter((row) => !irisan.some((item) => item.timbangan_id === row.id))
  const index = STEPS.findIndex(([key]) => key === stage)
  const label = stage === "setor" ? "Setoran pagi" : stage === "timbang" ? "Timbang sore" : "Hasil irisan"

  return (
    <>
      <div className="mb-2 text-sm font-semibold text-muted">
        Langkah {index + 1} dari 3 — {label}
      </div>
      <div className="mb-5 grid grid-cols-3 gap-2">
        {STEPS.map(([key, text]) => (
          <button
            key={key}
            type="button"
            onClick={() => setStage(key)}
            className={cn(
              "min-h-12 rounded-control text-sm font-extrabold",
              stage === key ? "bg-brambang text-white shadow-lg shadow-[#D97745]/20" : "border border-line bg-white text-muted",
            )}
          >
            {text}
          </button>
        ))}
      </div>
      <div className={stage === "setor" ? "" : "hidden"}>
        <SetoranForm
          workers={active.filter((worker) => worker.peran === "pengupas")}
          date={date}
          setDate={setDate}
          insert={tables.setoranT.insert}
          toast={toast}
          records={setoran.filter((row) => row.tanggal === date)}
          karyawan={karyawan}
        />
      </div>
      <div className={stage === "timbang" ? "" : "hidden"}>
        <TimbanganForm
          rows={pendingWeigh}
          karyawan={karyawan}
          insert={tables.timbanganT.insert}
          toast={toast}
        />
      </div>
      <div className={stage === "iris" ? "" : "hidden"}>
        <IrisanForm
          rows={pendingSlice}
          workers={active.filter((worker) => worker.peran === "pengiris")}
          insert={tables.irisanT.insert}
          toast={toast}
        />
      </div>
      <div className="mt-5 flex gap-3">
        {index > 0 && (
          <Button variant="outline" className="flex-1" onClick={() => setStage(STEPS[index - 1][0])}>
            Kembali
          </Button>
        )}
        {index < 2 && (
          <Button variant="brambang" className="flex-1" onClick={() => setStage(STEPS[index + 1][0])}>
            Selanjutnya
          </Button>
        )}
      </div>
    </>
  )
}
