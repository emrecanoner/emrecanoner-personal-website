import { Client } from '@notionhq/client'
import { isFullPage } from '@notionhq/client'
import { Book } from '@/types'
import { 
  PageObjectResponse, 
  BlockObjectResponse,
  RichTextItemResponse,
  BulletedListItemBlockObjectResponse,
  NumberedListItemBlockObjectResponse
} from '@notionhq/client/build/src/api-endpoints'
import { calculateReadingTime } from '@/lib/utils'

if (!process.env.NOTION_API_KEY) {
  throw new Error('Missing Notion API key')
}

if (!process.env.NOTION_BLOG_DATABASE_ID) {
  throw new Error('Missing Notion blog database ID')
}

if (!process.env.NOTION_LIBRARY_DATABASE_ID) {
  throw new Error('Missing Notion library database ID')
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
  category?: string
  views?: number
  reading_time?: number
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
  select?: { id: string; name: string; color: string }
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

    return Promise.all(response.results.map(async (page) => {
      const { properties } = page as PageObjectResponse
      const props = properties as unknown as NotionProperties
      
      const pageContent = await getBlockContent(page.id)

      return {
        id: page.id,
        title: props.Title?.title?.[0]?.plain_text || '',
        slug: props.Slug?.rich_text?.[0]?.plain_text || '',
        description: props.Description?.rich_text?.[0]?.plain_text || '',
        date: props.Date?.date?.start || '',
        content: pageContent,
        published: props.Published?.checkbox || false,
        tags: props.Tags?.multi_select?.map((tag) => tag.name) || [],
        category: props.Category?.select?.name || '',
        reading_time: calculateReadingTime(pageContent)
      }
    }))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

async function getBlockContent(blockId: string): Promise<string> {
  try {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
    })

    let content = ''
    let currentList: string | null = null

    for (const block of response.results as BlockObjectResponse[]) {
      if ('type' in block) {
        const blockContent = await renderBlock(block)
        content += blockContent
      }
    }

    return content
  } catch (error) {
    console.error('Error getting block content:', error)
    return ''
  }
}

async function renderBlock(block: BlockObjectResponse): Promise<string> {
  if (!('type' in block)) return ''
  
  const { type } = block

  switch (type) {
    case 'paragraph': {
      const { paragraph } = block
      return paragraph.rich_text.length === 0 
        ? '\n'
        : `${renderRichText(paragraph.rich_text)}\n\n`
    }
    case 'heading_1': {
      const { heading_1 } = block
      return `# ${renderRichText(heading_1.rich_text)}\n\n`
    }
    case 'heading_2': {
      const { heading_2 } = block
      return `## ${renderRichText(heading_2.rich_text)}\n\n`
    }
    case 'heading_3': {
      const { heading_3 } = block
      return `### ${renderRichText(heading_3.rich_text)}\n\n`
    }
    case 'bulleted_list_item': {
      const { bulleted_list_item } = block
      return `- ${renderRichText(bulleted_list_item.rich_text)}\n`
    }
    case 'numbered_list_item': {
      const { numbered_list_item } = block
      return `1. ${renderRichText(numbered_list_item.rich_text)}\n`
    }
    case 'code': {
      const { code } = block
      // Eğer markdown code bloğu ise, içeriği doğrudan döndür
      if (code.language === 'markdown') {
        return renderRichText(code.rich_text)
      }
      // Diğer code blokları için normal işleme devam et
      return `\`\`\`${code.language}\n${renderRichText(code.rich_text)}\n\`\`\`\n\n`
    }
    case 'quote': {
      const { quote } = block
      return `> ${renderRichText(quote.rich_text)}\n\n`
    }
    case 'image': {
      const { image } = block
      const src = image.type === 'external' ? image.external.url : image.file.url
      const caption = image.caption ? renderRichText(image.caption) : ''
      return `![${caption}](${src})\n\n`
    }
    case 'divider':
      return '---\n\n'
    default:
      return ''
  }
}

function renderRichText(richText: RichTextItemResponse[]): string {
  if (!richText) {
    return ''
  }

  return richText.map(text => {
    const { annotations, href, plain_text } = text
    let content = plain_text

    if (annotations.code) {
      content = `\`${content}\``
    }
    if (annotations.bold) {
      content = `**${content}**`
    }
    if (annotations.italic) {
      content = `*${content}*`
    }
    if (annotations.strikethrough) {
      content = `~~${content}~~`
    }
    if (href) {
      content = `[${content}](${href})`
    }

    return content
  }).join('')
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

    const page = response.results[0] as PageObjectResponse
    const { properties } = page
    const props = properties as unknown as NotionProperties

    const pageContent = await getBlockContent(page.id)

    return {
      id: page.id,
      title: props.Title?.title?.[0]?.plain_text || '',
      slug: props.Slug?.rich_text?.[0]?.plain_text || '',
      description: props.Description?.rich_text?.[0]?.plain_text || '',
      date: props.Date?.date?.start || '',
      content: pageContent,
      published: props.Published?.checkbox || false,
      tags: props.Tags?.multi_select?.map((tag) => tag.name) || [],
      category: props.Category?.select?.name || '',
      reading_time: calculateReadingTime(pageContent)
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getBooks() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_LIBRARY_DATABASE_ID!,
      filter: {
        property: 'Status',
        status: {
          does_not_equal: 'Not Started'
        }
      },
      sorts: [
        {
          property: 'Title',
          direction: 'ascending',
        },
      ],
    })

    return response.results.map((page) => {
      if (!isFullPage(page)) return null

      const { properties } = page as PageObjectResponse
      
      const description = properties.Description?.type === 'rich_text'
        ? properties.Description.rich_text[0]?.plain_text || ''
        : ''

      const rating = properties.Rating?.type === 'number' && properties.Rating.number
        ? `${(properties.Rating.number / 20).toFixed(1)}/5`
        : 'Not rated'

      return {
        id: page.id,
        title: properties.Title?.type === 'title' 
          ? properties.Title.title[0]?.plain_text || ''
          : '',
        author: properties.Author?.type === 'rich_text'
          ? properties.Author.rich_text[0]?.plain_text || ''
          : '',
        status: properties.Status?.type === 'status'
          ? properties.Status.status?.name || 'Not Started'
          : 'Not Started',
        category: properties.Category?.type === 'multi_select'
          ? properties.Category.multi_select.map(cat => cat.name)
          : [],
        rating,
        total_pages: properties['Total Pages']?.type === 'number'
          ? properties['Total Pages'].number || 0
          : 0,
        cover_image: properties['Cover Image']?.type === 'url'
          ? properties['Cover Image'].url || ''
          : '',
        description: description || 'Şu an okuyorum.'
      }
    }).filter(Boolean) as Book[]
  } catch (error) {
    console.error('Error fetching books:', error)
    return []
  }
}