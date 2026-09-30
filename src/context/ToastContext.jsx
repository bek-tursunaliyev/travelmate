import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { FaCheckCircle, FaInfoCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa'

const ToastContext = createContext(null)

const icons = { success: FaCheckCircle, info: FaInfoCircle, error: FaExclamationCircle }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const toast = useCallback(
    (message, type = 'success') => {
      const id = ++idRef.current
      setToasts((list) => [...list.slice(-3), { id, message, type }])
      setTimeout(() => dismiss(id), 3800)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map(({ id, message, type }) => {
          const Icon = icons[type]
          return (
            <div key={id} className={`toast toast--${type}`}>
              <Icon className="toast__icon" />
              <span>{message}</span>
              <button className="toast__close" onClick={() => dismiss(id)} aria-label="Close">
                <FaTimes />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
