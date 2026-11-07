import { useTable } from "../../../lib/useTable.js"

const PESANAN_SELECT = "*, items:item_pesanan(*), payments:pembayaran_sr(*)"

export function useSupplierData() {
  const rmT = useTable("rumah_makan")
  const pesananT = useTable("pesanan", {
    select: PESANAN_SELECT,
    orderBy: "tanggal",
    ascending: false,
  })

  return {
    loading: rmT.loading || pesananT.loading,
    rumahMakan: rmT.data,
    pesanan: pesananT.data,
    rmT,
    refresh: pesananT.refresh,
  }
}
