export default function PillNav({ items, active, onChange }) {
  return (
    <nav className="pillnav">
      <div className="pillnav-track">
        {items.map((it) => {
          const isActive = it.key === active
          const Icon = it.icon
          return (
            <button
              key={it.key}
              className={`pillnav-item ${isActive ? 'is-active' : ''}`}
              onClick={() => onChange(it.key)}
              aria-label={it.label}
            >
              <Icon size={20} strokeWidth={2.2} />
              <span className="pillnav-label">{it.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
