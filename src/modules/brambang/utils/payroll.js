export function rateFor(harga, date, role) {
  const current = harga
    .filter((row) => row.mulai <= date)
    .sort((a, b) => b.mulai.localeCompare(a.mulai))[0]
  return Number(current?.[role === "pengupas" ? "kupas" : "iris"] || 0)
}

export function calculatePayroll(
  karyawan,
  harga,
  setoran,
  timbangan,
  irisan,
  pembayaran,
  range,
) {
  return karyawan
    .map((worker) => {
      const scoped =
        worker.peran === "pengupas"
          ? timbangan.filter(
              (row) =>
                row.tanggal >= range.start &&
                row.tanggal <= range.end &&
                setoran.find((item) => item.id === row.setoran_id)?.karyawan_id ===
                  worker.id,
            )
          : irisan.filter(
              (row) =>
                row.karyawan_id === worker.id &&
                row.tanggal >= range.start &&
                row.tanggal <= range.end,
            )
      return {
        karyawan: worker,
        items: scoped,
        kg: scoped.reduce((sum, row) => sum + Number(row.qty), 0),
        total: scoped.reduce(
          (sum, row) => sum + Number(row.qty) * rateFor(harga, row.tanggal, worker.peran),
          0,
        ),
        lunas: pembayaran.some(
          (row) => row.karyawan_id === worker.id && row.minggu_mulai === range.start,
        ),
      }
    })
    .filter((row) => row.kg > 0)
}
