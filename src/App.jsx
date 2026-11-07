import { useState } from "react"
import AppShell from "./components/layout/AppShell.jsx"
import { ToastProvider } from "./components/ui.jsx"
import BrambangModule from "./modules/brambang/BrambangModule.jsx"
import HomePage from "./modules/home/HomePage.jsx"
import SupplierModule from "./modules/supplier/SupplierModule.jsx"

export default function App() {
  const [page, setPage] = useState("home")
  return (
    <ToastProvider>
      <AppShell active={page} onChange={setPage}>
        {page === "home" ? <HomePage onChange={setPage} /> : page === "bg" ? <BrambangModule /> : <SupplierModule />}
      </AppShell>
    </ToastProvider>
  )
}
