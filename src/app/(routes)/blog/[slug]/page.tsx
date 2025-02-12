import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getBlogPost } from '@/lib/notion/client'
import { getPostViews, incrementPostViews } from '@/supabase/queries'
import { notFound } from 'next/navigation'
import { BlogContent } from '@/components/blog/blog-content'
import { PostMeta } from '@/components/blog/post-meta'
import { Suspense } from 'react'
import { Loading } from '@/components/ui/loading'
import { ModernBreadcrumb } from '@/components/ui/breadcrumb'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  
  return (
    <div className="relative min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
        <BlogPostContent slug={slug} />
      </Suspense>
    </div>
  )
}

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getBlogPost(slug)
  
  if (!post) {
    notFound()
  }

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Blog', href: '/blog' },
    ...(post.category ? [{ label: post.category, href: `/blog?category=${post.category}` }] : []),
    { label: post.title, href: `/blog/${slug}` }
  ]

  await incrementPostViews(slug)
  const views = await getPostViews(slug)

  return (
    <main className="mx-auto max-w-4xl px-4">
      <div className="py-4">
        <ModernBreadcrumb items={breadcrumbItems} />
      </div>
      <div className="py-8">
        <div className="relative mb-12 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {post.category && (
                <Badge variant="outline" className="h-6">
                  {post.category}
                </Badge>
              )}
              <PostMeta
                date={post.date}
                readingTime={post.reading_time}
                views={views}
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {post.title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {post.description}
            </p>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-4 top-20 h-48 w-48 rounded-full bg-primary/5 blur-3xl sm:h-72 sm:w-72" />
            <div className="absolute -right-4 top-40 h-48 w-48 rounded-full bg-primary/10 blur-3xl sm:h-72 sm:w-72" />
          </div>
        </div>

        <Card className="overflow-hidden border-none bg-transparent shadow-none">
          <BlogContent content={post.content} />
        </Card>
      </div>
    </main>
  )
}