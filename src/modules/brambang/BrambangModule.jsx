import { useState } from "react"
import { PageHeader } from "../../components/common/PageHeader.jsx"
import { SegmentedControl } from "../../components/common/SegmentedControl.jsx"
import { LoadingState } from "../../components/ui.jsx"
import BrambangDashboard from "./components/BrambangDashboard.jsx"
import BrambangSettings from "./components/BrambangSettings.jsx"
import DailyProcess from "./components/DailyProcess.jsx"
import UpahSummary from "./components/UpahSummary.jsx"
import { useBrambangData } from "./hooks/useBrambangData.js"

const TABS = [
  { value: "beranda", label: "Beranda" },
  { value: "proses", label: "Proses harian" },
  { value: "rekap", label: "Rekap upah" },
  { value: "atur", label: "Pengaturan" },
]

export default function BrambangModule() {
  const [page, setPage] = useState("beranda")
  const data = useBrambangData()
  if (data.loading) return <LoadingState />

  return (
    <div className="page">
      <PageHeader
        accent="brambang"
        eyebrow="Brambang Goreng"
        title="Produksi dan upah"
        description="Catat setoran, timbangan, dan irisan dengan urutan yang sama seperti di lapangan."
      />
      <div className="mb-5">
        <SegmentedControl accent="brambang" value={page} onChange={setPage} options={TABS} />
      </div>
      {page === "beranda" && <BrambangDashboard {...data} go={setPage} />}
      {page === "proses" && <DailyProcess {...data} />}
      {page === "rekap" && <UpahSummary {...data} />}
      {page === "atur" && <BrambangSettings {...data} />}
    </div>
  )
}
