import { Client } from '@notionhq/client'
import { isFullPage } from '@notionhq/client'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

if (!process.env.NOTION_API_KEY) {
  throw new Error('Missing Notion API key')
}

if (!process.env.NOTION_BLOG_DATABASE_ID) {
  throw new Error('Missing Notion blog database ID')
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID

export interface NotionBlogPost {
  id: string
  title: string
  slug: string
  description: string
  date: string
  content: string
  published: boolean
}

type NotionProperties = {
  title: { title: Array<{ plain_text: string }> }
  slug: { rich_text: Array<{ plain_text: string }> }
  description: { rich_text: Array<{ plain_text: string }> }
  date: { date: { start: string } }
  published: { checkbox: boolean }
}

type NotionPage = {
  id: string
  properties: NotionProperties
}

export async function getBlogPosts(): Promise<NotionBlogPost[]> {
  try {
    const response = await notion.databases.query({
      database_id: BLOG_DATABASE_ID,
      filter: {
        property: 'published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'date',
          direction: 'descending',
        },
      ],
    })

    // @ts-ignore - Notion API tip tanımlamaları için geçici çözüm
    return response.results.map((page) => ({
      id: page.id,
      // @ts-ignore
      title: page.properties.title.title[0].plain_text,
      // @ts-ignore
      slug: page.properties.slug.rich_text[0].plain_text,
      // @ts-ignore
      description: page.properties.description.rich_text[0].plain_text,
      // @ts-ignore
      date: page.properties.date.date.start,
      content: '',
      // @ts-ignore
      published: page.properties.published.checkbox,
    }))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<NotionBlogPost | null> {
  try {
    const response = await notion.databases.query({
      database_id: BLOG_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'slug',
            rich_text: {
              equals: slug,
            },
          },
          {
            property: 'published',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    })

    if (!response.results.length) {
      return null
    }

    // @ts-ignore - Notion API tip tanımlamaları için geçici çözüm
    const page = response.results[0]
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    })

    // Bu kısımda blocks'u HTML'e çevirme işlemi yapılacak
    const content = '' // TODO: blocks'u HTML'e çevir

    return {
      id: page.id,
      // @ts-ignore
      title: page.properties.title.title[0].plain_text,
      // @ts-ignore
      slug: page.properties.slug.rich_text[0].plain_text,
      // @ts-ignore
      description: page.properties.description.rich_text[0].plain_text,
      // @ts-ignore
      date: page.properties.date.date.start,
      content,
      // @ts-ignore
      published: page.properties.published.checkbox,
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
} 