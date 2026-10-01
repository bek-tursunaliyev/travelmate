import { useState } from 'react'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { useWiki, sizedThumb } from '../hooks'

const isUrl = (v) => /^(https?:)?\/\//.test(v || '') || /^data:image\//.test(v || '')

// Picture for a place, tour, film…: `wiki` is either an image URL (set in the admin panel)
// or an English Wikipedia title whose photo is loaded. Falls back to a soft gradient.
export default function PlaceImage({ wiki, alt, width = 500, className = '' }) {
  const direct = isUrl(wiki)
  const { loading, data } = useWiki(direct ? null : wiki)
  const [failed, setFailed] = useState([])
  // Try the resized thumbnail first, then the original one; never retry a failed source.
  const candidates = direct ? [wiki] : [sizedThumb(data?.thumb, width), data?.thumb]
  const src = candidates.find((c) => c && !failed.includes(c))

  if (!direct && wiki && loading) return <div className={`place-img place-img--loading ${className}`} />
  if (!src) {
    return (
      <div className={`place-img place-img--empty ${className}`}>
        <FaMapMarkedAlt />
      </div>
    )
  }
  return (
    <img
      className={`place-img ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed((list) => [...list, src])}
    />
  )
}
