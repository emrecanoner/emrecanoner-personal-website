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
  tags?: string[]
}

interface NotionText {
  type: 'text'
  text: {
    content: string
    link: string | null
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  plain_text: string
  href: string | null
}

interface NotionProperty {
  id: string
  type: string
  title?: Array<NotionText>
  rich_text?: Array<NotionText>
  date?: { start: string; end: string | null }
  checkbox?: boolean
  multi_select?: Array<{ id: string; name: string; color: string }>
}

interface NotionProperties {
  [key: string]: NotionProperty
}

export async function getBlogPosts(): Promise<NotionBlogPost[]> {
  try {
    const response = await notion.databases.query({
      database_id: BLOG_DATABASE_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    })

    return response.results.map((page) => {
      const { properties } = page as PageObjectResponse
      const props = properties as unknown as NotionProperties

      return {
        id: page.id,
        title: props.Title?.title?.[0]?.plain_text || '',
        slug: props.Slug?.rich_text?.[0]?.plain_text || '',
        description: props.Description?.rich_text?.[0]?.plain_text || '',
        date: props.Date?.date?.start || '',
        content: props.Content?.rich_text?.[0]?.plain_text || '',
        published: props.Published?.checkbox || false,
        tags: props.Tags?.multi_select?.map((tag) => tag.name) || []
      }
    })
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
            property: 'Slug',
            rich_text: {
              equals: slug,
            },
          },
          {
            property: 'Published',
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
      title: page.properties.Title.title[0].text.plain_text,
      // @ts-ignore
      slug: page.properties.Slug.text[0].plain_text,
      // @ts-ignore
      description: page.properties.Description.text[0].plain_text,
      // @ts-ignore
      date: page.properties.Date.date.start,
      content,
      // @ts-ignore
      published: page.properties.Published.checkbox,
      // @ts-ignore
      tags: page.properties.Tags?.multi_select.map(tag => tag.name) || []
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
} 