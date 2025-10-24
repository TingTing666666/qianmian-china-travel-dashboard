"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownRendererProps {
  content: string
  className?: string
  typewriterEffect?: boolean
  typewriterSpeed?: number
}

export function MarkdownRenderer({
  content,
  className,
  typewriterEffect = false,
  typewriterSpeed = 30,
}: MarkdownRendererProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!typewriterEffect) {
      setDisplayedContent(content)
      return
    }

    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, typewriterSpeed)

      return () => clearTimeout(timer)
    }
  }, [content, currentIndex, typewriterEffect, typewriterSpeed])

  useEffect(() => {
    if (typewriterEffect) {
      setDisplayedContent("")
      setCurrentIndex(0)
    }
  }, [content, typewriterEffect])

  const components = {
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-base font-semibold mt-3 mb-1">{children}</h4>
    ),
    h5: ({ children }: any) => (
      <h5 className="text-sm font-semibold mt-2 mb-1">{children}</h5>
    ),
    h6: ({ children }: any) => (
      <h6 className="text-xs font-medium mt-1 mb-1">{children}</h6>
    ),
    p: ({ children }: any) => <p className="mb-2">{children}</p>,
    ul: ({ children }: any) => (
      <ul className="my-2 list-disc ml-4">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="my-2 list-decimal ml-4">{children}</ol>
    ),
    li: ({ children }: any) => <li>{children}</li>,
    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {children}
      </a>
    ),
    pre: ({ children }: any) => (
      <pre className="bg-muted p-3 rounded-md my-2 overflow-x-auto">{children}</pre>
    ),
    code: ({ inline, children }: any) =>
      inline ? (
        <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>
      ) : (
        <code>{children}</code>
      ),
    table: ({ children }: any) => (
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead className="bg-muted">{children}</thead>,
    tr: ({ children }: any) => <tr className="border">{children}</tr>,
    th: ({ children }: any) => (
      <th className="border px-3 py-2 text-left font-medium">{children}</th>
    ),
    td: ({ children }: any) => <td className="border px-3 py-2">{children}</td>,
  }

  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {displayedContent}
      </ReactMarkdown>
    </div>
  )
}