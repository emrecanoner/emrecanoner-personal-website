'use client'

import { useEffect } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import hljs from 'highlight.js'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'

// Dilleri kaydet
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.configure({
  ignoreUnescapedHTML: true,
  throwUnescapedHTML: false,
  languages: ['typescript', 'javascript', 'tsx', 'jsx']
})

interface BlogContentProps {
  content: string
}

interface CodeBlockProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
  node?: any
}

export function BlogContent({ content }: BlogContentProps) {
  useEffect(() => {
    const highlightCode = () => {
      requestAnimationFrame(() => {
        const codeBlocks = document.querySelectorAll('pre code:not(.math)')
        codeBlocks.forEach((block) => {
          try {
            if (block.className.includes('language-')) {
              hljs.highlightElement(block as HTMLElement)
            }
          } catch (error) {
            console.error('Error highlighting code block:', error)
          }
        })
      })
    }

    try {
      highlightCode()
      
      // Dataset highlight uyarılarını temizle
      document.querySelectorAll('[data-highlighted="true"]').forEach((el) => {
        el.removeAttribute('data-highlighted')
      })
    } catch (error) {
      console.error('Error in BlogContent useEffect:', error)
    }
  }, [content])

  const components: Components = {
    h1: ({ ...props }) => <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl" {...props} />,
    h2: ({ ...props }) => <h2 className="text-xl font-bold sm:text-2xl" {...props} />,
    h3: ({ ...props }) => <h3 className="text-lg font-bold sm:text-xl" {...props} />,
    h4: ({ ...props }) => <h4 className="text-base font-bold mt-2 mb-2" {...props} />,
    h5: ({ ...props }) => <h5 className="text-sm font-semibold mt-2 mb-2" {...props} />,
    h6: ({ ...props }) => <h6 className="text-xs font-medium mt-1 mb-1" {...props} />,
    p: ({ ...props }) => <p className="text-[11px] font-normal mb-3 mt-0 sm:text-xs" {...props} />,
    a: ({ ...props }) => (
      <a 
        className="text-[11px] sm:text-xs text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary/100" 
        target="_blank" 
        rel="noopener noreferrer" 
        {...props} 
      />
    ),
    code: ({ inline, className, children, node, ...props }: CodeBlockProps) => {
      const match = /language-(\w+)/.exec(className || '')
      
      if (!inline && match) {
        const lang = match[1]
        return (
          <code className={`language-${lang} text-[5px] leading-relaxed sm:text-[6px] block`} {...props}>
            {children}
          </code>
        )
      }
      
      return (
        <code className="bg-muted px-0.5 py-0.5 rounded text-[5px] sm:text-[6px] font-mono" {...props}>
          {children}
        </code>
      )
    },
    pre: ({ ...props }) => (
      <pre className="not-prose bg-muted rounded-lg overflow-x-auto mb-2 p-1 text-[5px] leading-relaxed sm:text-[6px]" {...props} />
    ),
    blockquote: ({ ...props }) => (
      <blockquote className="border-l-4 border-primary/10 pl-4 italic my-3 text-[11px] sm:text-xs" {...props} />
    ),
    img: ({ ...props }) => (
      <img className="rounded-lg w-full" loading="lazy" {...props} />
    ),
    ul: ({ ...props }) => <ul className="list-disc list-inside mb-3 text-[11px] sm:text-xs space-y-1.5" {...props} />,
    ol: ({ ...props }) => <ol className="list-decimal list-inside mb-3 text-[11px] sm:text-xs space-y-1.5" {...props} />,
  }

  return (
    <div className="border border-muted rounded-lg px-6 pb-6">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[
            rehypeRaw,
            [rehypeKatex, {
              throwOnError: false,
              strict: false,
              trust: true,
              globalGroup: true,
              macros: {
                '\\f': '#1f(#2)',
                '\\vec': '\\mathbf{#1}',
              },
              minRuleThickness: 0.05,
              maxSize: 20,
              maxExpand: 1000,
              output: 'html'
            }]
          ]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
} 