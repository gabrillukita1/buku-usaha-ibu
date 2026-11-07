import { today, weekRange } from "../../lib/storage.js"
import { orderPaid, orderTotal } from "../../utils/orders.js"

export function buildHomeView(
  { setoran, timbangan, irisan, harga, pembayaran, pesanan },
  period,
) {
  const start =
    period === "today"
      ? today()
      : period === "week"
        ? weekRange(0).start
        : today().slice(0, 8) + "01"
  const inRange = (row) => row.tanggal >= start && row.tanggal <= today()
  const week = weekRange(0)
  const rate = (date, role) =>
    Number(
      harga
        .filter((row) => row.mulai <= date)
        .sort((a, b) => b.mulai.localeCompare(a.mulai))[0]?.[role === "kupas" ? "kupas" : "iris"] ||
        0,
    )
  const role = (kind, rows) => {
    const workers = {}
    rows.forEach((row) => {
      const id =
        kind === "kupas"
          ? setoran.find((item) => item.id === row.setoran_id)?.karyawan_id
          : row.karyawan_id
      if (!id) return
      workers[id] = (workers[id] || 0) + Number(row.qty) * rate(row.tanggal, kind)
    })
    const total = Object.values(workers).reduce((sum, value) => sum + value, 0)
    const unpaid = Object.entries(workers)
      .filter(
        ([id]) =>
          !pembayaran.some(
            (row) => Number(row.karyawan_id) === Number(id) && row.minggu_mulai === week.start,
          ),
      )
      .reduce((sum, [, value]) => sum + value, 0)
    return { total, unpaid, done: total > 0 && unpaid === 0 }
  }

  const kupas = role(
    "kupas",
    timbangan.filter((row) => row.tanggal >= week.start && row.tanggal <= week.end),
  )
  const irisRole = role(
    "iris",
    irisan.filter((row) => row.tanggal >= week.start && row.tanggal <= week.end),
  )
  const pendingT = setoran.filter((row) => !timbangan.some((item) => item.setoran_id === row.id))
  const pendingI = timbangan.filter((row) => !irisan.some((item) => item.timbangan_id === row.id))
  const pendingO = pesanan.filter((row) => row.status === "dipesan")
  const debts = pesanan.filter((row) => row.status === "direalisasi" && orderTotal(row) > orderPaid(row))
  const debt = debts.reduce((sum, row) => sum + orderTotal(row) - orderPaid(row), 0)
  const received = pesanan
    .flatMap((row) => row.payments || [])
    .filter(inRange)
    .reduce((sum, row) => sum + Number(row.jumlah), 0)
  const totalUnpaid = kupas.unpaid + irisRole.unpaid
  const tasks = [
    [totalUnpaid, "Upah karyawan belum dibayar", "bg"],
    [pendingT.length, "Setoran belum ditimbang", "bg"],
    [pendingI.length, "Kupasan belum diiris", "bg"],
    [pendingO.length, "Pesanan belum direalisasikan", "sr"],
    [new Set(debts.map((row) => row.rumah_makan_id)).size, "Rumah makan masih memiliki tagihan", "sr"],
  ].filter((row) => row[0])
  const sumQty = (rows) => rows.filter(inRange).reduce((sum, row) => sum + Number(row.qty), 0)

  const recent = [
    ...setoran.map((row) => ({ id: `setoran-${row.id}`, date: row.tanggal, title: "Setoran", detail: `${row.qty} kg` })),
    ...timbangan.map((row) => ({
      id: `timbang-${row.id}`,
      date: row.tanggal,
      title: "Timbangan",
      detail: `${row.qty} kg`,
    })),
    ...irisan.map((row) => ({ id: `iris-${row.id}`, date: row.tanggal, title: "Irisan", detail: `${row.qty} kg` })),
    ...pesanan.map((row) => ({
      id: `pesanan-${row.id}`,
      date: row.tanggal,
      title: row.status === "dipesan" ? "Pesanan baru" : "Pesanan direalisasi",
      detail: `${row.items?.length || 0} item`,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return {
    recent,
    kupas,
    irisRole,
    pendingT,
    pendingI,
    pendingO,
    debts,
    debt,
    received,
    totalUnpaid,
    tasks,
    setoranKg: sumQty(setoran),
    timbangKg: sumQty(timbangan),
    irisKg: sumQty(irisan),
  }
}
