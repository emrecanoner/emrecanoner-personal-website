import Link from 'next/link'
import { FiCalendar, FiClock, FiEye } from 'react-icons/fi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getBlogPosts } from '@/lib/notion/client'
import { getPostViews } from '@/supabase/queries'
import { Suspense } from 'react'
import { PostMeta } from '@/components/blog/post-meta'
import { Loading } from '@/components/ui/loading'

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : 'all'
  
  return (
    <div className="relative min-h-screen bg-background">
      <Suspense key={category} fallback={<Loading />}>
        <BlogContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function BlogContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const posts = await getBlogPosts()

  const postsWithViews = await Promise.all(
    posts.map(async (post) => {
      const views = await getPostViews(post.slug)
      return { ...post, views }
    })
  )

  const category = typeof searchParams.category === 'string' ? searchParams.category : ''
  const selectedCategory = category || 'All'
  const categories = ['All', ...new Set(postsWithViews.map(post => post.category).filter(Boolean))]
  const filteredPosts = selectedCategory === 'All' 
    ? postsWithViews 
    : postsWithViews.filter(post => post.category === selectedCategory)

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
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
          {categories.map((cat) => (
            <Button
              key={cat}
              variant="outline"
              size="sm"
              className={`transition-all duration-200 min-w-[80px] h-8 ${
                selectedCategory === cat 
                  ? "bg-[#1a1f36] text-white dark:bg-white dark:text-[#1a1f36]" 
                  : "hover:bg-[#1a1f36] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1f36]"
              }`}
              asChild
            >
              <Link 
                href={cat === 'All' ? '/blog' : `/blog?category=${cat}`}
                scroll={false}
                prefetch={true}
              >
                {cat}
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
      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="group relative transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary mb-2.5">
                        {post.title}
                      </CardTitle>
                      <PostMeta
                        date={post.date}
                        readingTime={post.reading_time}
                        views={post.views}
                      />
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
    </main>
  )
}