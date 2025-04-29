
import ReactMarkdown from 'react-markdown';

interface MarkdownDisplayProps {
  content: string;
}

export const MarkdownDisplay = ({ content }: MarkdownDisplayProps) => {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert mt-4 text-left">
      <ReactMarkdown 
        className="prose prose-sm max-w-none dark:prose-invert text-left"
        components={{
          h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-4 first:mt-0 text-left" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-5 mb-3 text-left" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-base font-medium mt-4 mb-2 text-left" {...props} />,
          h4: ({node, ...props}) => <h4 className="text-sm font-medium mt-3 mb-1 text-left" {...props} />,
          p: ({node, ...props}) => <p className="mb-3 text-sm leading-relaxed text-left" {...props} />,
          ul: ({node, ...props}) => <ul className="my-3 list-disc pl-5 space-y-1 text-left" {...props} />,
          ol: ({node, ...props}) => <ol className="my-3 list-decimal pl-5 space-y-1 text-left" {...props} />,
          li: ({node, ...props}) => <li className="text-sm ml-2 text-left" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
