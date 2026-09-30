import { useState } from 'react'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { useWiki, sizedThumb } from '../hooks'

// Real photo from Wikipedia with a graceful gradient fallback.
export default function PlaceImage({ wiki, alt, width = 500, className = '' }) {
  const { loading, data } = useWiki(wiki)
  const [failedSrc, setFailedSrc] = useState(null)
  const sized = sizedThumb(data?.thumb, width)
  // If the resized thumbnail fails, fall back to the original thumbnail once.
  const src = failedSrc === sized ? data?.thumb : sized

  if (loading) return <div className={`place-img place-img--loading ${className}`} />
  if (!src || failedSrc === data?.thumb) {
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
      onError={() => setFailedSrc(src)}
    />
  )
}
