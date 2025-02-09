import Link from 'next/link'
import { FiArrowLeft, FiCalendar, FiClock } from 'react-icons/fi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Bu interface'i Notion API'den gelen veriye göre güncelleyeceğiz
interface BlogPost {
  id: string
  title: string
  description: string
  date: string
  slug: string
  readingTime?: string
  tags?: string[]
}

// Şimdilik örnek veriler kullanıyoruz, daha sonra Notion API ile değiştireceğiz
const DUMMY_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Modern Web Geliştirme',
    description: 'Modern web geliştirme teknolojileri ve best practice\'ler hakkında düşüncelerim. React, Next.js, ve diğer modern araçların kullanımı hakkında detaylı bir rehber.',
    date: '2024-02-20',
    slug: 'modern-web-development',
    readingTime: '5 dk',
    tags: ['React', 'Next.js', 'Web Development']
  },
  {
    id: '2',
    title: 'Docker ile Mikroservisler',
    description: 'Docker kullanarak mikroservis mimarisi nasıl oluşturulur? Konteynerleştirme, orkestrasyon ve dağıtık sistemler hakkında kapsamlı bir inceleme.',
    date: '2024-02-18',
    slug: 'docker-microservices',
    readingTime: '8 dk',
    tags: ['Docker', 'Microservices', 'DevOps']
  }
]

export default function BlogPage() {
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
            Ana Sayfa
          </Link>
        </Button>

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Blog Yazılarım
          </h1>
          <p className="text-muted-foreground">
            Yazılım geliştirme, teknoloji ve deneyimlerim hakkında düşüncelerimi paylaşıyorum.
          </p>
        </div>

        <div className="grid gap-4">
          {DUMMY_POSTS.map((post) => (
            <Card key={post.id} className="overflow-hidden transition-colors hover:bg-muted/50">
              <Link href={`/blog/${post.slug}`} className="block">
                <CardHeader>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <FiCalendar className="h-3.5 w-3.5" />
                        <time>
                          {new Date(post.date).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {post.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {post.readingTime && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <FiClock className="h-3.5 w-3.5" />
                        <span>{post.readingTime}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
} 