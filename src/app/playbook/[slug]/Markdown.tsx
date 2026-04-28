import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="font-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="font-display font-medium tracking-[-0.01em] mt-12 mb-5" style={{ fontSize: '2.25rem', lineHeight: '1.15' }} {...props} />,
          h2: (props) => <h2 className="font-display font-medium tracking-[-0.01em] mt-12 mb-5" style={{ fontSize: '1.875rem', lineHeight: '1.2' }} {...props} />,
          h3: (props) => <h3 className="font-display font-medium tracking-[-0.01em] mt-8 mb-3" style={{ fontSize: '1.5rem', lineHeight: '1.25' }} {...props} />,
          p: (props) => <p className="mb-5" style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: 'rgba(0,0,0,0.78)' }} {...props} />,
          ul: (props) => <ul className="mb-5 ml-6 list-disc space-y-2" style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: 'rgba(0,0,0,0.78)' }} {...props} />,
          ol: (props) => <ol className="mb-5 ml-6 list-decimal space-y-2" style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: 'rgba(0,0,0,0.78)' }} {...props} />,
          li: (props) => <li className="pl-1" {...props} />,
          a: (props) => <a className="underline hover:opacity-70 transition-opacity" style={{ color: 'var(--color-brand)' }} {...props} />,
          blockquote: (props) => (
            <blockquote
              className="font-display my-6 pl-5 italic"
              style={{ borderLeft: '3px solid var(--color-brand)', fontSize: '1.25rem', lineHeight: '1.5', color: 'rgba(0,0,0,0.85)' }}
              {...props}
            />
          ),
          code: ({ className, children, ...rest }) => {
            const isBlock = className?.includes('language-')
            if (isBlock) return <code className={className} {...rest}>{children}</code>
            return <code className="px-1.5 py-0.5 rounded text-sm" style={{ background: 'rgba(0,0,0,0.06)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }} {...rest}>{children}</code>
          },
          pre: (props) => (
            <pre className="my-6 p-4 rounded-xl overflow-x-auto text-sm" style={{ background: 'rgba(0,0,0,0.06)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }} {...props} />
          ),
          hr: () => <hr className="my-10 border-black/10" />,
          strong: (props) => <strong className="font-semibold" style={{ color: '#000' }} {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
