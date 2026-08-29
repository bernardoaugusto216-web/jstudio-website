import React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

export interface TestimonialAuthor {
  name: string
  handle?: string
  avatar?: string
  initials?: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
  rating?: number
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className,
  rating = 5
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "flex flex-col justify-between rounded-2xl border border-amber-500/20",
        "bg-zinc-950/80 backdrop-blur-xl",
        "p-6 text-start shadow-xl",
        "hover:border-amber-500/50 hover:bg-zinc-900/90",
        "w-[340px] shrink-0",
        "transition-all duration-300",
        className
      )}
    >
      <div>
        <div className="flex text-amber-400 text-sm gap-1 mb-4" aria-label={`Avaliação de ${rating} estrelas`}>
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
        <p className="text-sm sm:text-[0.92rem] leading-relaxed text-zinc-300 font-normal">
          {text}
        </p>
      </div>

      <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-white/10">
        <Avatar className="h-11 w-11 border border-amber-500/40">
          {author.avatar && <AvatarImage src={author.avatar} alt={author.name} />}
          <AvatarFallback>{author.initials || author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-sm font-bold text-white leading-tight">
            {author.name}
          </h3>
          {author.handle && (
            <p className="text-xs text-amber-400/80 mt-0.5">
              {author.handle}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
