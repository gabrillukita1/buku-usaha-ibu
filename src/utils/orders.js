export const orderTotal = (order) =>
  (order.items || []).reduce(
    (sum, item) => sum + Number(item.qty_beli || 0) * Number(item.harga_jual || 0),
    0,
  )

export const orderPaid = (order) =>
  (order.payments || []).reduce((sum, payment) => sum + Number(payment.jumlah || 0), 0)
