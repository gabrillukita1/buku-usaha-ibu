import { useState, useRef } from 'react'
import { Home, ClipboardList, ShoppingCart, Wallet, Settings, X, Share2, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import PillNav from '../components/PillNav.jsx'
import { useTable } from '../lib/useTable.js'
import { supabase } from '../lib/supabaseClient.js'
import { uid, today, fmtRp, fmtTgl } from '../lib/storage.js'

const NAV = [
  { key: 'beranda', label: 'Beranda', icon: Home },
  { key: 'pesanan', label: 'Pesanan', icon: ClipboardList },
  { key: 'realisasi', label: 'Realisasi', icon: ShoppingCart },
  { key: 'piutang', label: 'Piutang', icon: Wallet },
  { key: 'atur', label: 'Atur', icon: Settings },
]

const totalTagihan = (p) => (p.items || []).reduce((a, it) => a + (it.qty_beli || 0) * (it.harga_jual || 0), 0)
const totalDibayar = (p) => (p.payments || []).reduce((a, x) => a + Number(x.jumlah), 0)

export default function SupplierModule() {
  const [page, setPage] = useState('beranda')
  const rmT = useTable('rumah_makan')
  const pesananT = useTable('pesanan', {
    select: '*, items:item_pesanan(*), payments:pembayaran_sr(*)',
    orderBy: 'tanggal', ascending: false,
  })
  const [kwitansi, setKwitansi] = useState(null)

  const rumahMakan = rmT.data
  const pesanan = pesananT.data

  if (rmT.loading || pesananT.loading) return <div className="page-wrap"><div className="empty">Memuat data...</div></div>

  return (
    <div className="page-wrap">
      {page === 'beranda' && <Beranda pesanan={pesanan} />}
      {page === 'pesanan' && <Pesanan {...{ rumahMakan, pesanan, refresh: pesananT.refresh }} />}
      {page === 'realisasi' && <Realisasi {...{ rumahMakan, pesanan, refresh: pesananT.refresh, onKwitansi: setKwitansi }} />}
      {page === 'piutang' && <Piutang {...{ rumahMakan, pesanan, refresh: pesananT.refresh }} />}
      {page === 'atur' && <Pengaturan {...{ rumahMakan, rmT }} />}
      <PillNav items={NAV} active={page} onChange={setPage} />
      {kwitansi && <KwitansiModal pesanan={kwitansi.p} rm={kwitansi.rm} onClose={() => setKwitansi(null)} />}
    </div>
  )
}

function Beranda({ pesanan }) {
  const belum = pesanan.filter((p) => p.status === 'dipesan')
  const piutangList = pesanan.filter((p) => p.status === 'direalisasi' && totalTagihan(p) - totalDibayar(p) > 0.01)
  const totalPiutang = piutangList.reduce((a, p) => a + (totalTagihan(p) - totalDibayar(p)), 0)
  const rmCount = new Set(piutangList.map((p) => p.rumah_makan_id)).size

  return (
    <>
      <h2 className="section-title">Hari ini, {fmtTgl(today())}</h2>
      <div className="card">
        {belum.length ? <div className="row"><div>🛒 Pesanan belum direalisasi</div><span className="pill-badge wait">{belum.length}</span></div> : <div className="empty">Tidak ada pesanan tertunda hari ini.</div>}
      </div>
      <h2 className="section-title mt">Piutang</h2>
      <div className="card row">
        <div><div className="muted">Total belum dibayar</div><div className="big-num">{fmtRp(totalPiutang)}</div></div>
        <div><div className="muted">Rumah makan nunggak</div><div className="big-num">{rmCount}</div></div>
      </div>
    </>
  )
}

function Pesanan({ rumahMakan, pesanan, refresh }) {
  const aktif = rumahMakan.filter((r) => r.aktif !== false)
  const [rmId, setRmId] = useState('')
  const [tgl, setTgl] = useState(today())
  const [dadakan, setDadakan] = useState(false)
  const [items, setItems] = useState([{ nama: '', qty: '', satuan: 'kg' }])
  const [saving, setSaving] = useState(false)

  function updateItem(i, field, val) {
    const copy = [...items]; copy[i][field] = val; setItems(copy)
  }
  function tambahRow() { setItems([...items, { nama: '', qty: '', satuan: 'kg' }]) }
  function hapusRow(i) { setItems(items.filter((_, idx) => idx !== i)) }

  async function simpan() {
    if (!rmId) return alert('Pilih rumah makan dulu.')
    const valid = items.filter((it) => it.nama.trim() && it.qty)
    if (!valid.length) return alert('Isi minimal 1 item pesanan yang valid.')
    setSaving(true)
    const { data: pRows, error: pErr } = await supabase
      .from('pesanan')
      .insert({ rumah_makan_id: Number(rmId), tanggal: tgl, dadakan, status: 'dipesan' })
      .select()
    if (pErr) { alert('Gagal menyimpan pesanan: ' + pErr.message); setSaving(false); return }
    const pesananId = pRows[0].id
    const itemRows = valid.map((it) => ({
      pesanan_id: pesananId, nama: it.nama.trim(), satuan: it.satuan || 'kg', qty_pesan: parseFloat(it.qty),
    }))
    const { error: iErr } = await supabase.from('item_pesanan').insert(itemRows)
    if (iErr) { alert('Gagal menyimpan item: ' + iErr.message); setSaving(false); return }
    await refresh()
    setItems([{ nama: '', qty: '', satuan: 'kg' }]); setDadakan(false); setSaving(false)
  }

  const belum = pesanan.filter((p) => p.status === 'dipesan')

  return (
    <>
      <div className="card">
        <label>Rumah Makan</label>
        <select value={rmId} onChange={(e) => setRmId(e.target.value)}>
          <option value="">Pilih rumah makan</option>
          {aktif.map((r) => <option key={r.id} value={r.id}>{r.nama}</option>)}
        </select>
        <label>Tanggal</label>
        <input type="date" value={tgl} onChange={(e) => setTgl(e.target.value)} />
        <div className="chip-group">
          <div className={`chip ${!dadakan ? 'sel' : ''}`} onClick={() => setDadakan(false)}>Pesanan biasa (malam)</div>
          <div className={`chip ${dadakan ? 'sel' : ''}`} onClick={() => setDadakan(true)}>Dadakan</div>
        </div>
        <label>Item pesanan</label>
        {items.map((it, i) => (
          <div className="item-row" key={i}>
            <input type="text" placeholder="Nama bahan" value={it.nama} onChange={(e) => updateItem(i, 'nama', e.target.value)} />
            <input type="number" step="0.1" placeholder="Qty" value={it.qty} onChange={(e) => updateItem(i, 'qty', e.target.value)} />
            <input type="text" placeholder="kg/L/pcs" value={it.satuan} onChange={(e) => updateItem(i, 'satuan', e.target.value)} />
            <button className="item-del" onClick={() => hapusRow(i)}><X size={16} /></button>
          </div>
        ))}
        <button className="btn ghost" onClick={tambahRow}>+ Tambah Item</button>
        <button className="btn" onClick={simpan} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Pesanan'}</button>
      </div>
      <h2 className="section-title">Pesanan belum direalisasi</h2>
      <div className="card">
        {belum.length ? belum.map((p) => {
          const rm = rumahMakan.find((r) => r.id === p.rumah_makan_id)
          return (
            <div className="list-row" key={p.id}>
              <div><div className="name">{rm?.nama} {p.dadakan && <span className="pill-badge wait">Dadakan</span>}</div><div className="meta">{(p.items || []).length} item — {fmtTgl(p.tanggal)}</div></div>
            </div>
          )
        }) : <div className="empty">Tidak ada pesanan tertunda</div>}
      </div>
    </>
  )
}

function Realisasi({ rumahMakan, pesanan, refresh, onKwitansi }) {
  const belum = pesanan.filter((p) => p.status === 'dipesan')
  const [pid, setPid] = useState('')
  const p = pesanan.find((x) => x.id === Number(pid))
  const [form, setForm] = useState([])
  const [saving, setSaving] = useState(false)

  function pilihPesanan(id) {
    setPid(id)
    const found = pesanan.find((x) => x.id === Number(id))
    if (found) setForm(found.items.map((it) => ({ qtyBeli: it.qty_beli ?? '', hargaBeli: it.harga_beli ?? '', hargaJual: it.harga_jual ?? '', catatan: it.catatan || '' })))
  }

  function updateForm(i, field, val) {
    const copy = [...form]; copy[i][field] = val; setForm(copy)
  }

  async function simpan() {
    setSaving(true)
    for (let i = 0; i < p.items.length; i++) {
      const it = p.items[i]
      await supabase.from('item_pesanan').update({
        qty_beli: parseFloat(form[i].qtyBeli) || 0,
        harga_beli: parseFloat(form[i].hargaBeli) || 0,
        harga_jual: parseFloat(form[i].hargaJual) || 0,
        catatan: form[i].catatan,
      }).eq('id', it.id)
    }
    await supabase.from('pesanan').update({ status: 'direalisasi' }).eq('id', p.id)
    await refresh()
    const rm = rumahMakan.find((r) => r.id === p.rumah_makan_id)
    onKwitansi({ p: { ...p, items: p.items.map((it, i) => ({ ...it, qty_beli: parseFloat(form[i].qtyBeli) || 0, harga_jual: parseFloat(form[i].hargaJual) || 0 })) }, rm })
    setPid(''); setSaving(false)
  }

  return (
    <div className="card">
      <label>Pilih pesanan</label>
      <select value={pid} onChange={(e) => pilihPesanan(e.target.value)}>
        <option value="">Pilih pesanan</option>
        {belum.map((x) => {
          const rm = rumahMakan.find((r) => r.id === x.rumah_makan_id)
          return <option key={x.id} value={x.id}>{rm?.nama} — {fmtTgl(x.tanggal)}{x.dadakan ? ' (dadakan)' : ''}</option>
        })}
      </select>
      {p && form.length > 0 && p.items.map((it, i) => (
        <div className="subcard" key={it.id}>
          <div className="name bold">{it.nama} <span className="muted">(dipesan {it.qty_pesan} {it.satuan})</span></div>
          <label>Qty dibeli aktual</label>
          <input type="number" step="0.1" value={form[i].qtyBeli} onChange={(e) => updateForm(i, 'qtyBeli', e.target.value)} />
          <label>Harga beli / {it.satuan}</label>
          <input type="number" value={form[i].hargaBeli} onChange={(e) => updateForm(i, 'hargaBeli', e.target.value)} />
          <label>Harga jual / {it.satuan}</label>
          <input type="number" value={form[i].hargaJual} onChange={(e) => updateForm(i, 'hargaJual', e.target.value)} />
          <label>Catatan (opsional)</label>
          <input type="text" value={form[i].catatan} onChange={(e) => updateForm(i, 'catatan', e.target.value)} />
        </div>
      ))}
      {p && <button className="btn" onClick={simpan} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Realisasi & Buat Kwitansi'}</button>}
    </div>
  )
}

function Piutang({ rumahMakan, pesanan, refresh }) {
  const aktif = rumahMakan.filter((r) => r.aktif !== false)
  async function catatBayar(pid) {
    const jumlah = parseFloat(prompt('Jumlah yang dibayar (Rp):'))
    if (!jumlah) return
    const { error } = await supabase.from('pembayaran_sr').insert({ pesanan_id: pid, tanggal: today(), jumlah })
    if (error) return alert('Gagal mencatat pembayaran: ' + error.message)
    await refresh()
  }
  const groups = aktif.map((rm) => ({
    rm,
    list: pesanan.filter((p) => p.rumah_makan_id === rm.id && p.status === 'direalisasi' && totalTagihan(p) - totalDibayar(p) > 0.01),
  })).filter((g) => g.list.length)

  if (!groups.length) return <div className="empty">Tidak ada piutang belum lunas. 🎉</div>

  return groups.map(({ rm, list }) => {
    const sisaTotal = list.reduce((a, p) => a + (totalTagihan(p) - totalDibayar(p)), 0)
    return (
      <div className="card" key={rm.id}>
        <div className="row rowgap"><div className="name bold">{rm.nama}</div><div className="big-num small">{fmtRp(sisaTotal)}</div></div>
        {list.map((p) => (
          <div className="list-row" key={p.id}>
            <div className="meta">{fmtTgl(p.tanggal)} — sisa {fmtRp(totalTagihan(p) - totalDibayar(p))}</div>
            <button className="btn small" onClick={() => catatBayar(p.id)}>Catat Bayar</button>
          </div>
        ))}
      </div>
    )
  })
}

function Pengaturan({ rumahMakan, rmT }) {
  const [nama, setNama] = useState('')
  const [kontak, setKontak] = useState('')
  async function tambah() {
    if (!nama.trim()) return alert('Isi nama rumah makan dulu.')
    const ok = await rmT.insert({ nama: nama.trim(), kontak, aktif: true })
    if (ok) { setNama(''); setKontak('') }
  }
  async function nonaktifkan(id) {
    if (!confirm('Nonaktifkan rumah makan ini?')) return
    await rmT.update(id, { aktif: false })
  }
  const aktif = rumahMakan.filter((r) => r.aktif !== false)
  return (
    <>
      <h2 className="section-title">Rumah Makan</h2>
      <div className="card">
        <label>Nama rumah makan</label>
        <input type="text" placeholder="Nama rumah makan" value={nama} onChange={(e) => setNama(e.target.value)} />
        <label>Kontak (opsional)</label>
        <input type="text" placeholder="No. HP" value={kontak} onChange={(e) => setKontak(e.target.value)} />
        <button className="btn" onClick={tambah}>Tambah Rumah Makan</button>
      </div>
      <div className="card">
        {aktif.length ? aktif.map((r) => (
          <div className="list-row" key={r.id}>
            <div><div className="name">{r.nama}</div><div className="meta">{r.kontak || '-'}</div></div>
            <button className="btn ghost small" onClick={() => nonaktifkan(r.id)}>Nonaktifkan</button>
          </div>
        )) : <div className="empty">Belum ada rumah makan. Tambahkan di atas.</div>}
      </div>
    </>
  )
}

function KwitansiModal({ pesanan: p, rm, onClose }) {
  const ref = useRef(null)
  const total = totalTagihan(p)
  const waText = encodeURIComponent(
    `Kwitansi ${rm?.nama || ''} - ${fmtTgl(p.tanggal)}\n` +
    p.items.map((it) => `${it.nama}: ${it.qty_beli}${it.satuan} x ${fmtRp(it.harga_jual)} = ${fmtRp(it.qty_beli * it.harga_jual)}`).join('\n') +
    `\nTOTAL: ${fmtRp(total)}`
  )
  function unduh() {
    html2canvas(ref.current).then((canvas) => {
      const a = document.createElement('a')
      a.download = 'kwitansi.png'
      a.href = canvas.toDataURL('image/png')
      a.click()
    })
  }
  return (
    <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="kwitansi" ref={ref}>
          <h3>Kwitansi — {rm?.nama || '-'}</h3>
          <div className="kmeta">{fmtTgl(p.tanggal)}{p.dadakan ? ' · Pesanan dadakan' : ''}</div>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr></thead>
            <tbody>
              {p.items.map((it) => (
                <tr key={it.id}><td>{it.nama}</td><td>{it.qty_beli} {it.satuan}</td><td>{fmtRp(it.harga_jual)}</td><td className="right">{fmtRp(it.qty_beli * it.harga_jual)}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="tot">TOTAL: {fmtRp(total)}</div>
        </div>
        <a className="btn" href={`https://wa.me/?text=${waText}`} target="_blank" rel="noreferrer"><Share2 size={16} /> Bagikan ke WhatsApp</a>
        <button className="btn secondary" onClick={unduh}><Download size={16} /> Simpan sebagai Gambar</button>
        <button className="btn ghost" onClick={onClose}>Tutup</button>
      </div>
    </div>
  )
}
