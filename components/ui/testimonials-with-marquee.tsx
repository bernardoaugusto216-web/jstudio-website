import React from "react"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

export interface TestimonialItem {
  author: TestimonialAuthor
  text: string
  href?: string
  rating?: number
}

export interface TestimonialsSectionProps {
  title: string
  tag?: string
  description?: string
  testimonials: TestimonialItem[]
  className?: string
}

export function TestimonialsSection({ 
  title,
  tag = "DEPOIMENTOS",
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "bg-black text-white py-16 sm:py-24 px-0 relative overflow-hidden",
      className
    )}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center sm:gap-12">
        <div className="flex flex-col items-center gap-3 px-4">
          {tag && (
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              {tag}
            </span>
          )}
          <h2 className="max-w-[720px] text-3xl font-bold leading-tight sm:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="text-sm max-w-[600px] text-zinc-400 sm:text-base">
              {description}
            </p>
          )}
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4">
          <div className="group flex overflow-hidden p-2 gap-4 flex-row w-full">
            <div className="flex shrink-0 gap-4 animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) => (
                testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-black via-black/80 to-transparent sm:block z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 bg-gradient-to-l from-black via-black/80 to-transparent sm:block z-10" />
        </div>
      </div>
    </section>
  )
}
