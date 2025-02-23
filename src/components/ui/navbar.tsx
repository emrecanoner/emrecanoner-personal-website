'use client'

import Link from 'next/link'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '@/lib/theme-provider'
import { Button } from './button'

export default function Navbar() {
  const { toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-foreground hover:text-primary transition-colors"
          >
            emrecanoner.dev
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/blog">Blog</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/library">Library</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground ml-1"
            >
              <FiSun className="hidden h-5 w-5 dark:block" />
              <FiMoon className="h-5 w-5 dark:hidden" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 