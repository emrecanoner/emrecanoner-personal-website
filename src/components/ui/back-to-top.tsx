'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FiArrowUp } from 'react-icons/fi'

export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300)
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
      className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full transition-all duration-200 hover:bg-[#1a1f36] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1f36]"
      onClick={scrollToTop}
    >
      <FiArrowUp className="h-5 w-5" />
    </Button>
  )
} 