import Link from 'next/link'
import { FiArrowLeft, FiCalendar, FiClock, FiEye } from 'react-icons/fi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getBlogPosts } from '@/lib/notion/client'
import { Suspense } from 'react'

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [posts, params] = await Promise.all([
    getBlogPosts(),
    searchParams
  ])

  const category = typeof params.category === 'string' ? params.category : ''
  const selectedCategory = category || 'All'
  
  // Tüm kategorileri al ve tekrar edenleri filtrele
  const categories = ['All', ...new Set(posts.map(post => post.category).filter(Boolean))]

  // Seçili kategoriye göre gönderileri filtrele
  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          className="h-8 mb-6 -ml-2 gap-2 w-fit sm:h-10 transition-all duration-200 hover:bg-[#1a1f36] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1f36]"
          asChild
        >
          <Link href="/">
            <FiArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Hero Section */}
        <div className="relative mb-12 space-y-16">
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Blog & Articles
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Exploring software development, technology trends, and sharing my experiences in building modern applications.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className={`transition-all duration-200 min-w-[80px] h-8 ${
                  selectedCategory === category 
                    ? "bg-[#1a1f36] text-white dark:bg-white dark:text-[#1a1f36]" 
                    : "hover:bg-[#1a1f36] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1f36]"
                }`}
                asChild>
                <Link 
                  href={category === 'All' ? '/blog' : `/blog?category=${category}`}
                  scroll={false}
                >
                  {category}
                </Link>
              </Button>
            ))}
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-4 top-20 h-48 w-48 rounded-full bg-primary/5 blur-3xl sm:h-72 sm:w-72" />
            <div className="absolute -right-4 top-40 h-48 w-48 rounded-full bg-primary/10 blur-3xl sm:h-72 sm:w-72" />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <Suspense fallback={<div>Loading posts...</div>}>
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="group relative transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary">
                            {post.title}
                          </CardTitle>
                          <div className="mt-1 flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
                            <div className="flex items-center gap-1.5">
                              <FiCalendar className="h-3.5 w-3.5" />
                              <time>
                                {new Date(post.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </time>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FiClock className="h-3.5 w-3.5" />
                              <span>5 min read</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FiEye className="h-3.5 w-3.5" />
                              <span>1.2K views</span>
                            </div>
                          </div>
                        </div>
                        {post.category && (
                          <Badge variant="outline" className="min-w-[80px] h-6 flex items-center justify-center shrink-0">
                            {post.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 items-start">
                        {post.tags && post.tags.map((tag) => (
                          <Badge key={tag} className="min-w-[80px] h-6 flex items-center justify-center">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {post.description}
                    </p>
                  </CardContent>
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <p className="text-sm font-medium">Continue reading →</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Suspense>
      </div>
    </main>
  )
} 