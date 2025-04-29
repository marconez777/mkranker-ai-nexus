
export const formatResultString = (resultado: string): string => {
  // Process the resultado to handle both JSON and plain text formats
  let formattedResult = resultado;
  try {
    // Only try to parse if it looks like JSON (starts with { or [)
    if (typeof resultado === 'string' && (resultado.trim().startsWith('{') || resultado.trim().startsWith('['))) {
      const parsedData = JSON.parse(resultado);
      if (parsedData && parsedData.output) {
        formattedResult = parsedData.output;
      } else if (parsedData && parsedData.resultado) {
        formattedResult = parsedData.resultado;
      } else if (parsedData && typeof parsedData === 'object') {
        // If there's no specific output or resultado field but it's an object,
        // we might need to format it as text
        formattedResult = JSON.stringify(parsedData, null, 2);
      }
    }
  } catch (e) {
    console.log("Resultado não é um JSON válido, usando texto original");
  }
  
  // Clean up any escaped characters
  if (typeof formattedResult === 'string') {
    formattedResult = formattedResult
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\"/g, '"')
      .replace(/\\\*/g, '*')
      .replace(/\\#/g, '#')
      .replace(/\\_/g, '_');
  }

  return formattedResult;
};

export const formatPlainTextAsMarkdown = (text: string, type: 'palavras' | 'texto' | string): string => {
  if (!text.includes('#') && !text.includes('**')) {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length > 0 && type === 'palavras') {
      return `# Análise de Palavras-Chave\n\n${lines.map(line => `- ${line.trim()}`).join('\n')}`;
    }
  }
  return text;
};
