import { useRef } from "react"
import { Download, Share2 } from "lucide-react"
import html2canvas from "html2canvas"
import { Button, Dialog } from "../../../components/ui.jsx"
import { fmtRp, fmtTgl } from "../../../lib/storage.js"
import { orderTotal } from "../../../utils/orders.js"

export default function KwitansiView({ receipt, close }) {
  const ref = useRef(null)
  const { p, rm } = receipt
  const total = orderTotal(p)
  const wa = encodeURIComponent(
    `Kwitansi ${rm?.nama || ""} • ${fmtTgl(p.tanggal)}\n${p.items
      .map(
        (item) =>
          `${item.nama}: ${item.qty_beli} ${item.satuan} × ${fmtRp(item.harga_jual)} = ${fmtRp(Number(item.qty_beli) * Number(item.harga_jual))}`,
      )
      .join("\n")}\nTOTAL: ${fmtRp(total)}`,
  )
  const download = () =>
    html2canvas(ref.current, { backgroundColor: "#fff" }).then((canvas) => {
      const link = document.createElement("a")
      link.download = `kwitansi-${p.id}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    })

  return (
    <Dialog open onOpenChange={close} title="Kwitansi">
      <div className="space-y-4">
        <div ref={ref} className="rounded-control bg-white p-5 text-[#28211a]">
          <div className="flex justify-between border-b border-[#E8E4DF] pb-4">
            <div>
              <h3 className="text-xl font-extrabold">Kwitansi</h3>
              <p className="text-sm">{rm?.nama || "-"}</p>
            </div>
            <p className="text-sm">{fmtTgl(p.tanggal)}</p>
          </div>
          <div className="divide-y divide-[#E8E4DF] py-3">
            {p.items.map((item) => (
              <div className="flex justify-between gap-4 py-2 text-sm" key={item.id}>
                <span>
                  {item.nama}
                  <br />
                  <span className="text-[#6d655d]">
                    {item.qty_beli} {item.satuan} × {fmtRp(item.harga_jual)}
                  </span>
                </span>
                <b className="num">{fmtRp(Number(item.qty_beli) * Number(item.harga_jual))}</b>
              </div>
            ))}
          </div>
          <div className="num flex justify-between border-t border-[#E8E4DF] pt-3 text-lg font-extrabold">
            <span>TOTAL</span>
            <span>{fmtRp(total)}</span>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control bg-supplier px-5 text-base font-bold text-white"
            href={`https://wa.me/?text=${wa}`}
            target="_blank"
            rel="noreferrer"
          >
            <Share2 size={18} /> Bagikan WhatsApp
          </a>
          <Button variant="outline" onClick={download}>
            <Download size={18} /> Simpan gambar
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
