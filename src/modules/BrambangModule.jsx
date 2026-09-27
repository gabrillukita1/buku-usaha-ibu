import { useState } from 'react'
import { Home, PenLine, Wallet, Settings } from 'lucide-react'
import PillNav from '../components/PillNav.jsx'
import { useTable } from '../lib/useTable.js'
import { uid, today, fmtRp, fmtTgl, weekRange } from '../lib/storage.js'

const NAV = [
  { key: 'beranda', label: 'Beranda', icon: Home },
  { key: 'input', label: 'Input', icon: PenLine },
  { key: 'rekap', label: 'Rekap', icon: Wallet },
  { key: 'atur', label: 'Atur', icon: Settings },
]

export default function BrambangModule() {
  const [page, setPage] = useState('beranda')
  const karyawanT = useTable('karyawan')
  const hargaT = useTable('harga', { orderBy: 'mulai', ascending: false })
  const setoranT = useTable('setoran')
  const timbanganT = useTable('timbangan')
  const irisanT = useTable('irisan')
  const pembayaranT = useTable('pembayaran_bg')

  const karyawan = karyawanT.data
  const setoran = setoranT.data
  const timbangan = timbanganT.data
  const irisan = irisanT.data
  const pembayaran = pembayaranT.data
  const hargaAktif = () => hargaT.data[0] || { kupas: 0, iris: 0 }

  function hitungRekapMinggu(wr) {
    const h = hargaAktif()
    return karyawan
      .map((k) => {
        let kg = 0
        if (k.peran === 'pengupas') kg = setoran.filter((s) => s.karyawan_id === k.id && s.tanggal >= wr.start && s.tanggal <= wr.end).reduce((a, b) => a + Number(b.qty), 0)
        else kg = irisan.filter((i) => i.karyawan_id === k.id && i.tanggal >= wr.start && i.tanggal <= wr.end).reduce((a, b) => a + Number(b.qty), 0)
        if (kg <= 0) return null
        const tarif = k.peran === 'pengupas' ? h.kupas : h.iris
        const bayar = pembayaran.find((p) => p.karyawan_id === k.id && p.minggu_mulai === wr.start)
        return { karyawan: k, kg, tarif, total: kg * tarif, wrStart: wr.start, lunas: !!bayar, pembayaranId: bayar?.id }
      })
      .filter(Boolean)
  }

  if (karyawanT.loading || hargaT.loading) return <div className="page-wrap"><div className="empty">Memuat data...</div></div>

  return (
    <div className="page-wrap">
      {page === 'beranda' && <Beranda {...{ setoran, timbangan, irisan, hitungRekapMinggu }} />}
      {page === 'input' && (
        <InputHarian
          karyawan={karyawan} setoran={setoran} setoranT={setoranT}
          timbangan={timbangan} timbanganT={timbanganT} irisan={irisan} irisanT={irisanT}
        />
      )}
      {page === 'rekap' && <Rekap {...{ hitungRekapMinggu, pembayaranT }} />}
      {page === 'atur' && <Pengaturan {...{ karyawan, karyawanT, hargaT, hargaAktif }} />}
      <PillNav items={NAV} active={page} onChange={setPage} />
    </div>
  )
}

function Beranda({ setoran, timbangan, irisan, hitungRekapMinggu }) {
  const t = today()
  const belumTimbang = setoran.filter((s) => s.tanggal === t && !timbangan.some((x) => x.setoran_id === s.id))
  const belumIris = timbangan.filter((x) => x.tanggal === t && !irisan.some((i) => i.timbangan_id === x.id))
  const wr = weekRange(0)
  const totalKg = irisan.filter((i) => i.tanggal >= wr.start && i.tanggal <= wr.end).reduce((a, b) => a + Number(b.qty), 0)
  const belumBayar = hitungRekapMinggu(wr).filter((r) => !r.lunas).length

  return (
    <>
      <h2 className="section-title">Hari ini, {fmtTgl(t)}</h2>
      <div className="card">
        {belumTimbang.length === 0 && belumIris.length === 0 && setoran.filter((s) => s.tanggal === t).length === 0 ? (
          <div className="empty">Belum ada setoran hari ini.<br />Yuk mulai catat di tab Input →</div>
        ) : (
          <>
            {belumTimbang.length > 0 && <div className="row rowgap"><div>🧺 Perlu ditimbang</div><span className="pill-badge wait">{belumTimbang.length} pengupas</span></div>}
            {belumIris.length > 0 && <div className="row rowgap"><div>🔪 Perlu diiris</div><span className="pill-badge wait">{belumIris.length} hasil</span></div>}
            {belumTimbang.length === 0 && belumIris.length === 0 && <div className="row">✅ Semua sudah diproses hari ini</div>}
          </>
        )}
      </div>
      <h2 className="section-title mt">Ringkasan minggu berjalan</h2>
      <div className="card row">
        <div><div className="muted">Total kg diiris</div><div className="big-num">{totalKg.toFixed(1)}</div></div>
        <div><div className="muted">Karyawan belum lunas</div><div className="big-num">{belumBayar}</div></div>
      </div>
    </>
  )
}

function InputHarian({ karyawan, setoran, setoranT, timbangan, timbanganT, irisan, irisanT }) {
  const [tab, setTab] = useState('setor')
  const pengupas = karyawan.filter((k) => k.peran === 'pengupas' && k.aktif !== false)
  const pengiris = karyawan.filter((k) => k.peran === 'pengiris' && k.aktif !== false)
  const belumTimbang = setoran.filter((s) => !timbangan.some((t) => t.setoran_id === s.id))
  const belumIris = timbangan.filter((t) => !irisan.some((i) => i.timbangan_id === t.id))

  const [setorTgl, setSetorTgl] = useState(today())
  const [setorKaryawan, setSetorKaryawan] = useState('')
  const [setorQty, setSetorQty] = useState('')
  const [timbangId, setTimbangId] = useState('')
  const [timbangQty, setTimbangQty] = useState('')
  const [irisId, setIrisId] = useState('')
  const [irisKaryawan, setIrisKaryawan] = useState('')
  const [irisQty, setIrisQty] = useState('')

  async function simpanSetoran() {
    if (!setorKaryawan || !setorQty) return alert('Pilih pengupas dan isi jumlah kg.')
    const ok = await setoranT.insert({ tanggal: setorTgl, karyawan_id: Number(setorKaryawan), qty: parseFloat(setorQty) })
    if (ok) setSetorQty('')
  }
  async function simpanTimbangan() {
    if (!timbangId || !timbangQty) return alert('Pilih setoran dan isi hasil timbangan.')
    const ok = await timbanganT.insert({ setoran_id: Number(timbangId), tanggal: today(), qty: parseFloat(timbangQty) })
    if (ok) setTimbangQty('')
  }
  async function simpanIrisan() {
    if (!irisId || !irisKaryawan || !irisQty) return alert('Lengkapi semua kolom.')
    const ok = await irisanT.insert({ timbangan_id: Number(irisId), karyawan_id: Number(irisKaryawan), tanggal: today(), qty: parseFloat(irisQty) })
    if (ok) setIrisQty('')
  }

  return (
    <>
      <div className="tabs">
        {['setor', 'timbang', 'iris'].map((tkey) => (
          <button key={tkey} className={tab === tkey ? 'active' : ''} onClick={() => setTab(tkey)}>
            {tkey === 'setor' ? 'Setor Pagi' : tkey === 'timbang' ? 'Timbang Sore' : 'Iris'}
          </button>
        ))}
      </div>

      {tab === 'setor' && (
        <>
          <div className="card">
            <label>Tanggal</label>
            <input type="date" value={setorTgl} onChange={(e) => setSetorTgl(e.target.value)} />
            <label>Pengupas</label>
            <select value={setorKaryawan} onChange={(e) => setSetorKaryawan(e.target.value)}>
              <option value="">Pilih pengupas</option>
              {pengupas.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
            <label>Jumlah bawang mentah disetor (kg)</label>
            <input type="number" step="0.1" placeholder="cth. 15" value={setorQty} onChange={(e) => setSetorQty(e.target.value)} />
            <button className="btn" onClick={simpanSetoran}>Simpan Setoran</button>
          </div>
          <h2 className="section-title">Setoran hari ini</h2>
          <div className="card">
            {setoran.filter((s) => s.tanggal === today()).length ? setoran.filter((s) => s.tanggal === today()).map((s) => {
              const k = karyawan.find((x) => x.id === s.karyawan_id)
              const sudah = timbangan.some((t) => t.setoran_id === s.id)
              return (
                <div key={s.id} className="list-row">
                  <div><div className="name">{k?.nama || '?'}</div><div className="meta">{s.qty} kg mentah disetor</div></div>
                  <span className={`pill-badge ${sudah ? 'done' : 'wait'}`}>{sudah ? 'Ditimbang' : 'Menunggu'}</span>
                </div>
              )
            }) : <div className="empty">Belum ada setoran hari ini</div>}
          </div>
        </>
      )}

      {tab === 'timbang' && (
        <>
          <div className="card">
            <label>Pilih setoran yang siap ditimbang</label>
            <select value={timbangId} onChange={(e) => setTimbangId(e.target.value)}>
              <option value="">Pilih setoran</option>
              {belumTimbang.map((s) => {
                const k = karyawan.find((x) => x.id === s.karyawan_id)
                return <option key={s.id} value={s.id}>{k?.nama} — {s.qty}kg ({fmtTgl(s.tanggal)})</option>
              })}
            </select>
            <label>Hasil kupasan setelah ditimbang (kg)</label>
            <input type="number" step="0.1" placeholder="cth. 9.5" value={timbangQty} onChange={(e) => setTimbangQty(e.target.value)} />
            <button className="btn" onClick={simpanTimbangan}>Simpan Timbangan</button>
          </div>
          <h2 className="section-title">Menunggu ditimbang</h2>
          <div className="card">
            {belumTimbang.length ? belumTimbang.map((s) => {
              const k = karyawan.find((x) => x.id === s.karyawan_id)
              return <div key={s.id} className="list-row"><div><div className="name">{k?.nama}</div><div className="meta">Disetor {s.qty} kg — {fmtTgl(s.tanggal)}</div></div></div>
            }) : <div className="empty">Tidak ada yang menunggu ditimbang</div>}
          </div>
        </>
      )}

      {tab === 'iris' && (
        <>
          <div className="card">
            <label>Pilih hasil kupasan yang sudah ditimbang</label>
            <select value={irisId} onChange={(e) => setIrisId(e.target.value)}>
              <option value="">Pilih kupasan</option>
              {belumIris.map((t) => {
                const s = setoran.find((x) => x.id === t.setoran_id)
                const k = s ? karyawan.find((x) => x.id === s.karyawan_id) : null
                return <option key={t.id} value={t.id}>{k?.nama} — {t.qty}kg kupasan</option>
              })}
            </select>
            <label>Pengiris</label>
            <select value={irisKaryawan} onChange={(e) => setIrisKaryawan(e.target.value)}>
              <option value="">Pilih pengiris</option>
              {pengiris.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
            <label>Jumlah kupasan diiris (kg)</label>
            <input type="number" step="0.1" placeholder="cth. 9.5" value={irisQty} onChange={(e) => setIrisQty(e.target.value)} />
            <button className="btn" onClick={simpanIrisan}>Simpan Irisan</button>
          </div>
          <h2 className="section-title">Menunggu diiris</h2>
          <div className="card">
            {belumIris.length ? belumIris.map((t) => {
              const s = setoran.find((x) => x.id === t.setoran_id)
              const k = s ? karyawan.find((x) => x.id === s.karyawan_id) : null
              return <div key={t.id} className="list-row"><div><div className="name">Asal: {k?.nama}</div><div className="meta">{t.qty} kg kupasan siap iris</div></div></div>
            }) : <div className="empty">Tidak ada kupasan menunggu diiris</div>}
          </div>
        </>
      )}
    </>
  )
}

function Rekap({ hitungRekapMinggu, pembayaranT }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const wr = weekRange(weekOffset)
  const data = hitungRekapMinggu(wr)

  async function togglLunas(r) {
    if (r.lunas) await pembayaranT.remove(r.pembayaranId)
    else await pembayaranT.insert({ karyawan_id: r.karyawan.id, minggu_mulai: r.wrStart })
  }

  return (
    <>
      <div className="week-nav">
        <button onClick={() => setWeekOffset(weekOffset - 1)}>‹</button>
        <div className="label">{fmtTgl(wr.start)} – {fmtTgl(wr.end)}</div>
        <button onClick={() => setWeekOffset(weekOffset + 1)}>›</button>
      </div>
      {data.length === 0 ? <div className="empty">Belum ada produksi di minggu ini.</div> : data.map((d) => (
        <div className="card" key={d.karyawan.id}>
          <div className="row">
            <div><div className="name bold">{d.karyawan.nama}</div><div className="muted">{d.karyawan.peran === 'pengupas' ? 'Kupas' : 'Iris'} {d.kg.toFixed(1)} kg × {fmtRp(d.tarif)}</div></div>
            <div className="big-num small">{fmtRp(d.total)}</div>
          </div>
          <button className={`btn ${d.lunas ? 'secondary' : ''}`} onClick={() => togglLunas(d)}>
            {d.lunas ? '✓ Sudah Dibayar — batalkan' : 'Tandai Sudah Dibayar'}
          </button>
        </div>
      ))}
    </>
  )
}

function Pengaturan({ karyawan, karyawanT, hargaT, hargaAktif }) {
  const [nama, setNama] = useState('')
  const [peran, setPeran] = useState('pengupas')
  const [kupasBaru, setKupasBaru] = useState('')
  const [irisBaru, setIrisBaru] = useState('')
  const h = hargaAktif()

  async function tambah() {
    if (!nama.trim()) return alert('Isi nama karyawan dulu ya.')
    const ok = await karyawanT.insert({ nama: nama.trim(), peran, aktif: true })
    if (ok) setNama('')
  }
  async function nonaktifkan(id) {
    if (!confirm('Nonaktifkan karyawan ini? Riwayat datanya tetap tersimpan.')) return
    await karyawanT.update(id, { aktif: false })
  }
  async function simpanHarga() {
    if (!kupasBaru && !irisBaru) return alert('Isi minimal salah satu harga baru.')
    const ok = await hargaT.insert({ kupas: parseFloat(kupasBaru) || h.kupas, iris: parseFloat(irisBaru) || h.iris, mulai: today() })
    if (ok) { setKupasBaru(''); setIrisBaru('') }
  }

  return (
    <>
      <h2 className="section-title">Karyawan</h2>
      <div className="card">
        <label>Nama karyawan</label>
        <input type="text" placeholder="Nama karyawan" value={nama} onChange={(e) => setNama(e.target.value)} />
        <label>Peran</label>
        <div className="chip-group">
          <div className={`chip ${peran === 'pengupas' ? 'sel' : ''}`} onClick={() => setPeran('pengupas')}>Pengupas</div>
          <div className={`chip ${peran === 'pengiris' ? 'sel' : ''}`} onClick={() => setPeran('pengiris')}>Pengiris</div>
        </div>
        <button className="btn" onClick={tambah}>Tambah Karyawan</button>
      </div>
      <div className="card">
        {karyawan.filter((k) => k.aktif !== false).length ? karyawan.filter((k) => k.aktif !== false).map((k) => (
          <div className="list-row" key={k.id}>
            <div><div className="name">{k.nama}</div><div className="meta">{k.peran === 'pengupas' ? 'Pengupas' : 'Pengiris'}</div></div>
            <button className="btn ghost small" onClick={() => nonaktifkan(k.id)}>Nonaktifkan</button>
          </div>
        )) : <div className="empty">Belum ada karyawan. Tambahkan di atas.</div>}
      </div>
      <h2 className="section-title mt">Harga per Kg</h2>
      <div className="card">
        <div className="row rowgap"><div>Upah kupas / kg</div><div className="bold">{fmtRp(h.kupas)}</div></div>
        <div className="row rowgap"><div>Upah iris / kg</div><div className="bold">{fmtRp(h.iris)}</div></div>
        <label>Upah kupas baru (Rp/kg)</label>
        <input type="number" placeholder="cth. 3000" value={kupasBaru} onChange={(e) => setKupasBaru(e.target.value)} />
        <label>Upah iris baru (Rp/kg)</label>
        <input type="number" placeholder="cth. 4000" value={irisBaru} onChange={(e) => setIrisBaru(e.target.value)} />
        <button className="btn secondary" onClick={simpanHarga}>Perbarui Harga (berlaku mulai hari ini)</button>
      </div>
    </>
  )
}
