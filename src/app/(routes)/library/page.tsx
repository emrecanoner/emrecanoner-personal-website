import { getBooks } from '@/lib/notion/client'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import { ModernBreadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense } from 'react'
import { Loading } from '@/components/ui/loading'
import { FiStar } from 'react-icons/fi'

interface LibraryPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const status = typeof (await searchParams).status === 'string' ? (await searchParams).status : 'all'
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Library', href: '/library' },
    ...(status !== 'all' ? [{ label: String(status), href: `/library?status=${status}` }] : [])
  ]
  
  return (
    <div className="relative min-h-screen bg-background">
      <Suspense key={`library-${status}`} fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <Loading />
        </div>
      }>
        <div className="py-4">
          <ModernBreadcrumb items={breadcrumbItems} />
        </div>
        <LibraryContent searchParams={await searchParams} />
      </Suspense>
    </div>
  )
}

async function LibraryContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const status = typeof (await searchParams).status === 'string' ? (await searchParams).status : ''
  const books = await getBooks()
  
  const selectedStatus = status || 'All'
  const statuses = ['All', ...new Set(books.map(book => book.status))]
  const filteredBooks = selectedStatus === 'All' 
    ? books 
    : books.filter(book => book.status === selectedStatus)

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-12 space-y-16">
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            My Library
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            A collection of books I'm reading and have read.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((stat) => (
            <Button
              key={stat}
              variant="outline"
              size="sm"
              className={`transition-all duration-200 min-w-[80px] h-8 ${
                selectedStatus === stat 
                  ? "bg-[#1a1f36] text-white dark:bg-white dark:text-[#1a1f36] hover:bg-[#1a1f36] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1f36]" 
                  : "hover:bg-[#1a1f36] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1f36]"
              }`}
              asChild
            >
              <Link 
                href={stat === 'All' ? '/library' : `/library?status=${stat}`}
                scroll={false}
                prefetch={true}
              >
                {stat}
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

      {/* Books Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="group relative overflow-hidden">
            <div className="flex p-6">
              <div className="relative h-[150px] w-[100px] flex-shrink-0">
                <Image
                  src={book.cover_image}
                  alt={book.title}
                  fill
                  className="rounded-sm object-contain"
                  sizes="100px"
                />
              </div>
              <div className="ml-4 flex flex-col">
                <h3 className="font-semibold group-hover:text-primary">
                  {book.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {book.author}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {book.category.map((cat, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <FiStar className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="flex items-center">{book.rating === 'Not rated' ? 'Not rated' : `${book.rating}`}</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <p className="mx-6 text-sm text-center">
                {book.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
} 