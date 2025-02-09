'use client'

import { useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'
import { Button } from './button'

export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!show) return null

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg transition-all hover:shadow-xl"
      onClick={scrollToTop}
    >
      <FiArrowUp className="h-4 w-4" />
    </Button>
  )
} 