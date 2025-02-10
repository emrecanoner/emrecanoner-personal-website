import { FiCalendar, FiClock, FiEye } from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface PostMetaProps {
  date: string
  readingTime?: number
  views?: number
  className?: string
}

export function PostMeta({ date, readingTime, views = 0, className }: PostMetaProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-3", className)}>
      <div className="flex items-center gap-1.5">
        <FiCalendar className="h-3.5 w-3.5" />
        <time>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </div>
      <div className="flex items-center gap-1.5">
        <FiClock className="h-3.5 w-3.5" />
        <span>{readingTime || 5} min read</span>
      </div>
      <div className="flex items-center gap-1.5">
        <FiEye className="h-3.5 w-3.5" />
        <span>{views.toLocaleString()} views</span>
      </div>
    </div>
  )
} 