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
  
  const elements: React.ReactElement[] = [];
  let listItems: React.ReactElement[] = [];
  let listIdx = 0;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];

    // Check for headers
    if (line.startsWith('## ')) {
      // Flush any pending list
      if (listItems.length > 0) {
        elements.push(
          React.createElement('ul', { key: `ul-${listIdx}`, className: 'list-disc list-inside mb-4 space-y-1' }, listItems)
        );
        listItems = [];
        listIdx++;
      }
      elements.push(
        React.createElement(
          'h2',
          { key: `h2-${lineIdx}`, className: 'text-2xl font-bold mt-4 mb-2' },
          processText(line.substring(3))
        )
      );
      continue;
    }

    if (line.startsWith('# ')) {
      // Flush any pending list
      if (listItems.length > 0) {
        elements.push(
          React.createElement('ul', { key: `ul-${listIdx}`, className: 'list-disc list-inside mb-4 space-y-1' }, listItems)
        );
        listItems = [];
        listIdx++;
      }
      elements.push(
        React.createElement(
          'h1',
          { key: `h1-${lineIdx}`, className: 'text-3xl font-bold mt-4 mb-2' },
          processText(line.substring(2))
        )
      );
      continue;
    }

    // Check for bullet points
    if (line.trim().startsWith('- ')) {
      listItems.push(
        React.createElement('li', { key: `li-${lineIdx}` }, processText(line.substring(2).trim()))
      );
      continue;
    }

    // Empty line - flush list if any
    if (line.trim() === '') {
      if (listItems.length > 0) {
        elements.push(
          React.createElement('ul', { key: `ul-${listIdx}`, className: 'list-disc list-inside mb-4 space-y-1' }, listItems)
        );
        listItems = [];
        listIdx++;
      }
      elements.push(React.createElement('div', { key: `space-${lineIdx}`, className: 'mb-2' }));
      continue;
    }

    // Flush any pending list before paragraph
    if (listItems.length > 0) {
      elements.push(
        React.createElement('ul', { key: `ul-${listIdx}`, className: 'list-disc list-inside mb-4 space-y-1' }, listItems)
      );
      listItems = [];
      listIdx++;
    }

    // Regular paragraph with formatting
    elements.push(
      React.createElement(
        'p',
        { key: `p-${lineIdx}`, className: 'mb-2' },
        processText(line)
      )
    );
  }

  // Flush any remaining list items
  if (listItems.length > 0) {
    elements.push(
      React.createElement('ul', { key: `ul-${listIdx}`, className: 'list-disc list-inside mb-4 space-y-1' }, listItems)
    );
  }

  return React.createElement(
    React.Fragment,
    null,
    elements
  );
}

// Server-side markdown to HTML converter
export function markdownToHTML(text: string): string {
  let html = '';
  const lines = text.split('\n');
  let inList = false;
  let listHtml = '';

  for (const line of lines) {
    // Apply inline formatting first
    let formatted = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>');

    // Check for headers
    if (line.startsWith('## ')) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      html += `<h2 class="text-2xl font-bold mt-4 mb-2">${formatted.substring(3)}</h2>\n`;
      continue;
    }

    if (line.startsWith('# ')) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      html += `<h1 class="text-3xl font-bold mt-4 mb-2">${formatted.substring(2)}</h1>\n`;
      continue;
    }

    // Check for bullet points
    if (line.trim().startsWith('- ')) {
      if (!inList) {
        html += '<ul class="list-disc list-inside mb-4 space-y-1">\n';
        inList = true;
      }
      html += `<li>${formatted.substring(2).trim()}</li>\n`;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      html += '<div class="mb-2"></div>\n';
      continue;
    }

    // Regular paragraph
    if (inList) {
      html += '</ul>\n';
      inList = false;
    }
    html += `<p class="mb-2">${formatted}</p>\n`;
  }

  // Close any open list
  if (inList) {
    html += '</ul>\n';
  }

  return html;
}
