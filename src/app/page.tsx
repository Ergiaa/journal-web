import { Suspense } from 'react'
import Link from 'next/link'
import { BookOpen, Globe, Lightbulb, Microscope } from 'lucide-react'
import { SearchBar } from '@/components/search/search-bar'

const TOPICS = [
  { name: 'Artificial Intelligence', icon: Lightbulb, query: 'AI' },
  { name: 'Climate Change', icon: Globe, query: 'climate' },
  { name: 'Quantum Computing', icon: Microscope, query: 'quantum' },
  { name: 'Medical Research', icon: BookOpen, query: 'medicine' },
]

export default function Home() {
  return (
    <div className="relative flex flex-col items-center py-20 px-4 min-h-[calc(100vh-140px)] overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 -translate-y-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-1/4 right-0 translate-x-1/3 w-[500px] h-[400px] bg-chart-1/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="relative text-center space-y-6 mb-16 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center justify-center p-3.5 bg-primary/10 rounded-full mb-4 ring-1 ring-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
          Explore Academic Journals
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
          Search, discover, and access thousands of peer-reviewed articles across all major scientific disciplines.
        </p>
      </div>
      
      {/* Search Bar container with Glassmorphism */}
      <div className="w-full max-w-3xl mb-24 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
        <Suspense fallback={<div className="h-14 w-full bg-muted/50 rounded-xl animate-pulse" />}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-chart-1/40 rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative bg-background/80 backdrop-blur-xl rounded-xl border border-border/50 shadow-xl overflow-hidden ring-1 ring-white/5">
              <SearchBar />
            </div>
          </div>
        </Suspense>
      </div>

      {/* Featured Topics Section */}
      <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <div className="h-5 w-1.5 bg-primary rounded-full" />
            Featured Topics
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TOPICS.map((topic) => (
            <Link
              key={topic.name}
              href={`/search?q=${topic.query}`}
              className="group flex flex-col items-center p-8 bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl hover:border-primary/50 hover:bg-card/90 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="p-4 bg-muted/50 rounded-full mb-5 group-hover:scale-110 group-hover:bg-primary/10 transition-transform duration-300">
                <topic.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <span className="font-semibold text-[15px]">{topic.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
