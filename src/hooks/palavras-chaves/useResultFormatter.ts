
export const useResultFormatter = () => {
  const formatResult = (webhookResponse: any): string => {
    if (webhookResponse.resultado) {
      return webhookResponse.resultado;
    } 
    
    if (webhookResponse.output) {
      return processOutputFormat(webhookResponse.output);
    } 
    
    if (webhookResponse.text) {
      return webhookResponse.text;
    } 
    
    if (typeof webhookResponse === 'object') {
      let formattedResult = '# Análise de Palavras-Chave\n\n';
      
      if (Array.isArray(webhookResponse)) {
        formattedResult += webhookResponse.map(item => {
          if (typeof item === 'object') {
            return Object.entries(item)
              .map(([key, value]) => {
                const formattedKey = key
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                return `\n## **${formattedKey}**\n\n${value}\n`;
              })
              .join('\n\n');
          }
          return `\n- **${item}**\n`;
        }).join('\n\n');
      } else {
        formattedResult += Object.entries(webhookResponse)
          .map(([key, value]) => {
            const formattedKey = key
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            return `\n## **${formattedKey}**\n\n${value}\n`;
          })
          .join('\n\n');
      }
      
      return formattedResult;
    }
    
    return webhookResponse.toString();
  };

  const processOutputFormat = (output: string): string => {
    if (output.includes('**') && output.includes('\n\n')) {
      return output;
    }
    
    const sections = output.split(/\*\*([^*]+)\*\*/g);
    let formattedOutput = '';
    
    if (sections.length > 1) {
      let currentTitle = '';
      let isTitle = false;
      
      sections.forEach((section, index) => {
        const trimmedSection = section.trim();
        
        if (index % 2 === 1) {
          currentTitle = trimmedSection;
          formattedOutput += `\n\n## **${currentTitle}**\n\n`;
          isTitle = true;
        } else if (trimmedSection && isTitle) {
          const items = trimmedSection.split('\n')
            .map(item => item.trim())
            .filter(Boolean)
            .map(item => {
              if (item.startsWith('1.') || item.startsWith('-') || item.startsWith('*')) {
                return item;
              }
              return `- ${item}`;
            });
          
          formattedOutput += items.join('\n\n') + '\n\n';
          isTitle = false;
        }
      });
      
      return formattedOutput.trim();
    }
    
    return output.split('\n').join('\n\n');
  };

  return { formatResult };
};
