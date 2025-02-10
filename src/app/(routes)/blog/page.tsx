import Link from 'next/link'
import { FiArrowLeft, FiCalendar, FiClock, FiEye } from 'react-icons/fi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getBlogPosts } from '@/lib/notion/client'

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/">
            <FiArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Hero Section */}
        <div className="relative mb-12 space-y-4">
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Blog & Articles
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Exploring software development, technology trends, and sharing my experiences in building modern applications.
            </p>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-4 top-20 h-48 w-48 rounded-full bg-primary/5 blur-3xl sm:h-72 sm:w-72" />
            <div className="absolute -right-4 top-40 h-48 w-48 rounded-full bg-primary/10 blur-3xl sm:h-72 sm:w-72" />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="group relative transition-all hover:shadow-lg">
                <CardHeader>
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
                    {post.tags?.[0] && (
                      <Badge>{post.tags[0]}</Badge>
                    )}
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
      </div>
    </main>
  )
} 