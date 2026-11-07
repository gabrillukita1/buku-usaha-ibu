import { useTable } from "../../../lib/useTable.js"

export function useBrambangData() {
  const karyawanT = useTable("karyawan")
  const hargaT = useTable("harga", { orderBy: "mulai", ascending: false })
  const setoranT = useTable("setoran")
  const timbanganT = useTable("timbangan")
  const irisanT = useTable("irisan")
  const pembayaranT = useTable("pembayaran_bg")
  const loading = [karyawanT, hargaT, setoranT, timbanganT, irisanT, pembayaranT].some(
    (table) => table.loading,
  )

  return {
    loading,
    karyawan: karyawanT.data,
    harga: hargaT.data,
    setoran: setoranT.data,
    timbangan: timbanganT.data,
    irisan: irisanT.data,
    pembayaran: pembayaranT.data,
    tables: { karyawanT, hargaT, setoranT, timbanganT, irisanT, pembayaranT },
  }
}
