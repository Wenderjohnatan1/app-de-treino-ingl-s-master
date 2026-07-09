import React from 'react';

interface FormatPronunciationTipProps {
  tip: string;
}

export function FormatPronunciationTip({ tip }: FormatPronunciationTipProps) {
  // Extract emoji at the beginning of the string (e.g. "💡 ", "🗣️ ", "🤠 ")
  const emojiRegex = /^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+(?:[\u{200D}\u{FE0F}][\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+)*)\s*/u;
  const matchEmoji = tip.match(emojiRegex);
  let emoji = '';
  let rest = tip;
  
  if (matchEmoji) {
    emoji = matchEmoji[1];
    rest = tip.substring(matchEmoji[0].length);
  }

  // Tokenize the string to find **bold** and *italic* structures
  const tokens: Array<{ text: string; type: 'text' | 'bold' | 'italic' }> = [];
  let i = 0;
  
  while (i < rest.length) {
    if (rest.startsWith('**', i)) {
      const endIdx = rest.indexOf('**', i + 2);
      if (endIdx !== -1) {
        tokens.push({
          text: rest.substring(i + 2, endIdx),
          type: 'bold'
        });
        i = endIdx + 2;
      } else {
        tokens.push({ text: rest.substring(i), type: 'text' });
        break;
      }
    } else if (rest.startsWith('*', i)) {
      const endIdx = rest.indexOf('*', i + 1);
      if (endIdx !== -1) {
        tokens.push({
          text: rest.substring(i + 1, endIdx),
          type: 'italic'
        });
        i = endIdx + 1;
      } else {
        tokens.push({ text: rest.substring(i), type: 'text' });
        break;
      }
    } else {
      // Find the next star or double star
      const nextStar = rest.indexOf('*', i);
      if (nextStar === -1) {
        tokens.push({ text: rest.substring(i), type: 'text' });
        break;
      } else {
        tokens.push({ text: rest.substring(i, nextStar), type: 'text' });
        i = nextStar;
      }
    }
  }

  return (
    <span className="inline-flex items-start gap-1.5 leading-relaxed text-slate-700 text-xs">
      {emoji && <span className="shrink-0 text-sm select-none">{emoji}</span>}
      <span className="flex-1 leading-normal">
        {tokens.map((token, idx) => {
          if (token.type === 'bold') {
            return (
              <strong 
                key={idx} 
                className="font-black text-amber-900 bg-amber-100/60 px-1 py-0.5 rounded border border-amber-200/40 text-[10.5px] uppercase tracking-wide inline-block"
              >
                {token.text}
              </strong>
            );
          }
          if (token.type === 'italic') {
            // Remove double quotes inside the italicized text if present (e.g. "morning" -> morning)
            const cleanedText = token.text.replace(/^["']|["']$/g, '');
            return (
              <span 
                key={idx} 
                className="font-mono font-black text-pink-600 bg-pink-100/70 px-1 py-0.5 rounded border border-pink-200/40 italic text-[11px] inline-block mx-0.5"
              >
                {cleanedText}
              </span>
            );
          }
          return <span key={idx}>{token.text}</span>;
        })}
      </span>
    </span>
  );
}
