import { useState } from "react"
import { PageHeader } from "../../components/common/PageHeader.jsx"
import { SegmentedControl } from "../../components/common/SegmentedControl.jsx"
import { LoadingState } from "../../components/ui.jsx"
import KwitansiView from "./components/KwitansiView.jsx"
import OrderForm from "./components/OrderForm.jsx"
import RealisasiForm from "./components/RealisasiForm.jsx"
import ReceivableSummary from "./components/ReceivableSummary.jsx"
import SupplierDashboard from "./components/SupplierDashboard.jsx"
import SupplierSettings from "./components/SupplierSettings.jsx"
import { useSupplierData } from "./hooks/useSupplierData.js"

const TABS = [
  { value: "beranda", label: "Beranda" },
  { value: "pesanan", label: "Pesanan" },
  { value: "realisasi", label: "Realisasi" },
  { value: "piutang", label: "Piutang" },
  { value: "atur", label: "Pengaturan" },
]

export default function SupplierModule() {
  const [page, setPage] = useState("beranda")
  const [receipt, setReceipt] = useState(null)
  const data = useSupplierData()
  if (data.loading) return <LoadingState />

  return (
    <div className="page">
      <PageHeader
        accent="supplier"
        eyebrow="Supplier Rumah Makan"
        title="Pesanan dan piutang"
        description="Catat pesanan, belanja, kwitansi, dan pembayaran rumah makan."
      />
      <div className="mb-5">
        <SegmentedControl accent="supplier" value={page} onChange={setPage} options={TABS} />
      </div>
      {page === "beranda" && <SupplierDashboard {...data} go={setPage} />}
      {page === "pesanan" && <OrderForm {...data} />}
      {page === "realisasi" && <RealisasiForm {...data} setReceipt={setReceipt} />}
      {page === "piutang" && <ReceivableSummary {...data} setReceipt={setReceipt} />}
      {page === "atur" && <SupplierSettings {...data} />}
      {receipt && <KwitansiView receipt={receipt} close={() => setReceipt(null)} />}
    </div>
  )
}
