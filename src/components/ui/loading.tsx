'use client'

import { cn } from "@/lib/utils"

export function Loading({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-background", className)}>
      <div className="relative h-10 w-10">
        <div className="absolute h-full w-full animate-[spin_0.9s_cubic-bezier(0.45,0,0.55,1)_infinite]">
          <div className="absolute left-0 top-0 h-5 w-5">
            <div className="h-full w-full animate-[pulse_0.9s_cubic-bezier(0.45,0,0.55,1)_infinite] rounded-tl-full bg-primary/80" />
          </div>
          <div className="absolute right-0 top-0 h-5 w-5">
            <div className="h-full w-full animate-[pulse_0.9s_cubic-bezier(0.45,0,0.55,1)_infinite_150ms] rounded-tr-full bg-primary/60" />
          </div>
          <div className="absolute bottom-0 right-0 h-5 w-5">
            <div className="h-full w-full animate-[pulse_0.9s_cubic-bezier(0.45,0,0.55,1)_infinite_300ms] rounded-br-full bg-primary/40" />
          </div>
          <div className="absolute bottom-0 left-0 h-5 w-5">
            <div className="h-full w-full animate-[pulse_0.9s_cubic-bezier(0.45,0,0.55,1)_infinite_450ms] rounded-bl-full bg-primary/20" />
          </div>
        </div>
      </div>
    </div>
  )
}