'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
}

interface ModernBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function ModernBreadcrumb({ items }: ModernBreadcrumbProps) {
  if (!items.length) return null

  return (
    <nav className="py-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl px-4 flex items-center justify-center text-center flex-wrap space-x-1"
      >
        {items.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="flex items-center"
          >
            {index > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                className="mx-1.5"
              >
                <FiChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              </motion.div>
            )}
            
            <Link
              href={item.href}
              className={cn(
                "relative px-2 py-1 text-sm font-medium transition-all duration-300",
                index === items.length - 1
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <motion.span
                className="relative z-10"
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {item.label}
              </motion.span>
              
              {/* Hover efekti */}
              {index !== items.length - 1 && (
                <motion.div
                  className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-primary"
                  initial={false}
                  whileHover={{ width: '100%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
              
              {/* Aktif item çizgisi */}
              {index === items.length - 1 && (
                <motion.div
                  className="absolute -bottom-0.5 left-1/2 h-0.5 bg-primary"
                  initial={{ width: '0%', x: '-50%' }}
                  animate={{ width: '60%', x: '-50%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </nav>
  )
}
