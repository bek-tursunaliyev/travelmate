import { useFormat } from '../hooks'

// Dollar price with the so'm equivalent in small print underneath.
export default function Price({ usd, unit, className = '' }) {
  const f = useFormat()
  return (
    <span className={`price ${className}`}>
      <span className="price__line"><b className="price__usd">{f.money(usd)}</b>{unit && <small className="price__unit"> {unit}</small>}</span>
      <small className="price__uzs">≈ {f.uzs(usd)}</small>
    </span>
  )
}
