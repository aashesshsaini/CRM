import { useState, useCallback } from 'react'

export function useModal(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [data, setData] = useState(null)

  const open = useCallback((payload = null) => {
    setData(payload)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, data, open, close, toggle }
}
