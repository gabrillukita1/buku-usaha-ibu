export default function Header({ moduleId, onSwitch }) {
  return (
    <header className="topbar">
      <div className="topbar-row">
        <div className="topbar-logo">📒</div>
        <h1 className="topbar-title">Buku Usaha Ibu</h1>
      </div>
      <div className="modswitch">
        <button
          className={`modswitch-item ${moduleId === 'bg' ? 'is-on mod-bg' : ''}`}
          onClick={() => onSwitch('bg')}
        >
          🧅 Brambang Goreng
        </button>
        <button
          className={`modswitch-item ${moduleId === 'sr' ? 'is-on mod-sr' : ''}`}
          onClick={() => onSwitch('sr')}
        >
          🍲 Supplier
        </button>
      </div>
    </header>
  )
}
