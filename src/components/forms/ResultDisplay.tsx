
import { MarkdownDisplay } from './display/MarkdownDisplay';
import { FunnelTableDisplay } from './display/FunnelTableDisplay';
import { formatResultString, formatPlainTextAsMarkdown } from './display/ResultFormatter';

interface ResultDisplayProps {
  resultado: string;
  type?: 'funil' | 'mercado' | 'palavras' | 'texto';
}

export const ResultDisplay = ({ resultado, type = 'mercado' }: ResultDisplayProps) => {
  if (!resultado) return null;
  
  const formattedResult = formatResultString(resultado);
  
  // For 'funil' type, extract and display table data
  if (type === 'funil') {
    return <FunnelTableDisplay formattedResult={formattedResult} />;
  } else if (type === 'palavras' || type === 'texto') {
    // Special handling for 'palavras' or 'texto' type with formatted markdown
    console.log("Exibindo resultado para tipo:", type, formattedResult);
    
    // Format plain text as markdown if needed
    const enhancedContent = formatPlainTextAsMarkdown(formattedResult, type);
    return <MarkdownDisplay content={enhancedContent} />;
  } else {
    // Default display with markdown for mercado and other types
    return <MarkdownDisplay content={formattedResult} />;
  }
};
