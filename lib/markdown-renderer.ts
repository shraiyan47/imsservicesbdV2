import React from 'react'

// Markdown to JSX renderer utility
export function renderMarkdownToJSX(text: string): React.ReactNode {
  // Process the text for bold, italic, and other formatting
  const processText = (str: string): (string | React.ReactElement)[] => {
    const result: (string | React.ReactElement)[] = [];
    let index = 0;

    while (index < str.length) {
      // Check for bold **text**
      const boldMatch = str.slice(index).match(/^\*\*(.*?)\*\*/);
      if (boldMatch) {
        result.push(
          React.createElement('strong', { key: `bold-${Math.random()}` }, boldMatch[1])
        );
        index += boldMatch[0].length;
        continue;
      }

      // Check for italic *text*
      const italicMatch = str.slice(index).match(/^\*(.*?)\*/);
      if (italicMatch) {
        result.push(
          React.createElement('em', { key: `italic-${Math.random()}` }, italicMatch[1])
        );
        index += italicMatch[0].length;
        continue;
      }

      // Check for bold __text__
      const boldMatch2 = str.slice(index).match(/^__(.*?)__/);
      if (boldMatch2) {
        result.push(
          React.createElement('strong', { key: `bold2-${Math.random()}` }, boldMatch2[1])
        );
        index += boldMatch2[0].length;
        continue;
      }

      // Check for italic _text_
      const italicMatch2 = str.slice(index).match(/^_(.*?)_/);
      if (italicMatch2) {
        result.push(
          React.createElement('em', { key: `italic2-${Math.random()}` }, italicMatch2[1])
        );
        index += italicMatch2[0].length;
        continue;
      }

      // Regular text
      const nextSpecial = str.slice(index).search(/[\*_]/);
      if (nextSpecial === -1) {
        result.push(str.slice(index));
        break;
      } else {
        result.push(str.slice(index, index + nextSpecial));
        index += nextSpecial;
      }
    }

    return result;
  };

  // Split by newlines and process each line
  const lines = text.split('\n');
  
  return React.createElement(
    React.Fragment,
    null,
    lines.map((line, lineIdx) => {
      // Check for headers
      if (line.startsWith('## ')) {
        return React.createElement(
          'h2',
          { key: `h2-${lineIdx}`, className: 'text-2xl font-bold mt-4 mb-2' },
          processText(line.substring(3))
        );
      }
      if (line.startsWith('# ')) {
        return React.createElement(
          'h1',
          { key: `h1-${lineIdx}`, className: 'text-3xl font-bold mt-4 mb-2' },
          processText(line.substring(2))
        );
      }
      if (line.trim() === '') {
        return React.createElement('div', { key: `space-${lineIdx}`, className: 'mb-2' });
      }

      // Regular paragraph with formatting
      return React.createElement(
        'p',
        { key: `p-${lineIdx}`, className: 'mb-2' },
        processText(line)
      );
    })
  );
}
