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
    <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[calc(100vh-140px)]">
      <div className="text-center space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Explore Academic Journals
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Search, discover, and access thousands of peer-reviewed articles across all major scientific disciplines.
        </p>
      </div>
      
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
        <Suspense fallback={<div className="h-12 w-full bg-muted rounded-md animate-pulse" />}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-chart-1/30 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-background rounded-lg border shadow-sm">
              <SearchBar />
            </div>
          </div>
        </Suspense>
      </div>

      <div className="mt-20 w-full max-w-4xl animate-in fade-in duration-700 delay-300 fill-mode-both">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center mb-8">
          Featured Topics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TOPICS.map((topic) => (
            <Link
              key={topic.name}
              href={`/search?q=${topic.query}`}
              className="group flex flex-col items-center p-6 bg-card border rounded-xl hover:border-primary hover:shadow-md transition-all text-center"
            >
              <topic.icon className="h-8 w-8 mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium text-sm">{topic.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
