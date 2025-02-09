'use client'

import { useState, useEffect } from 'react'
import { Progress } from './progress'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const windowHeight = scrollHeight - clientHeight
      const currentProgress = (scrollTop / windowHeight) * 100
      setProgress(currentProgress)
    }

    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <Progress
      value={progress}
      className="fixed top-0 left-0 right-0 z-50 h-0.5 rounded-none bg-muted"
    />
  )
} 