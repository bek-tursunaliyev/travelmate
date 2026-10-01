import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { applyContent, cacheContent, defaultContent, fetchContent, readCachedContent } from '../content/content'

const ContentContext = createContext({ version: 0, publish: () => {} })

// Apply the last known content before the first render, so repeat visits never flash old data.
const cached = readCachedContent()
if (cached) applyContent(cached)

export function ContentProvider({ children }) {
  const [version, setVersion] = useState(0)

  const publish = useCallback((doc) => {
    applyContent(doc || defaultContent())
    cacheContent(doc)
    setVersion((v) => v + 1)
  }, [])

  useEffect(() => {
    let alive = true
    fetchContent()
      .then((doc) => {
        if (!alive) return
        const latest = readCachedContent()
        if (doc && doc.updatedAt === latest?.updatedAt) return
        if (!doc && !latest) return
        publish(doc)
      })
      .catch(() => { /* offline or dev without API: keep built-in data */ })
    return () => { alive = false }
  }, [publish])

  const value = useMemo(() => ({ version, publish }), [version, publish])
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export const useContent = () => useContext(ContentContext)
