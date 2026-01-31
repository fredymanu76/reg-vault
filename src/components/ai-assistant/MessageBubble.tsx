// REG-VAULT Message Bubble
// Chat message display with markdown support and citations

import { useState } from 'react';
import { ChatMessage } from '@/types/journey';
import {
  User,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: () => void;
  onFeedback?: (positive: boolean) => void;
}

export function MessageBubble({ message, onRetry, onFeedback }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);

  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return null; // Don't render system messages
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (positive: boolean) => {
    setFeedbackGiven(positive ? 'positive' : 'negative');
    onFeedback?.(positive);
  };

  return (
    <div
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`
          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
          ${isUser ? 'bg-white/10' : 'bg-pellucid-cyan/20'}
        `}
      >
        {isUser ? (
          <User size={16} className="text-photon-white" />
        ) : (
          <Sparkles size={16} className="text-pellucid-cyan" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`
            inline-block rounded-lg px-4 py-3 text-left
            ${isUser
              ? 'bg-pellucid-cyan/20 text-photon-white'
              : 'bg-white/5 text-photon-white'
            }
          `}
        >
          {/* Render content with basic markdown support */}
          <div className="prose prose-invert prose-sm max-w-none">
            <MessageContent content={message.content} />
          </div>

          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-mist-gray mb-2">Sources:</p>
              <div className="space-y-1">
                {message.citations.map((citation, index) => (
                  <a
                    key={index}
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-pellucid-cyan hover:underline"
                  >
                    <ExternalLink size={12} />
                    {citation.source}: {citation.text}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions within message */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className="text-xs px-2 py-1 rounded bg-pellucid-cyan/20 text-pellucid-cyan
                    hover:bg-pellucid-cyan/30 transition-colors"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p className={`text-xs text-mist-gray mt-1 ${isUser ? 'text-right' : ''}`}>
          {formatTimestamp(message.timestamp)}
        </p>

        {/* Actions for assistant messages */}
        {!isUser && (
          <div className={`flex items-center gap-1 mt-2 ${isUser ? 'justify-end' : ''}`}>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded text-mist-gray hover:text-photon-white hover:bg-white/5 transition-colors"
              title="Copy"
            >
              {copied ? <Check size={14} className="text-deep-teal" /> : <Copy size={14} />}
            </button>

            {onRetry && (
              <button
                onClick={onRetry}
                className="p-1.5 rounded text-mist-gray hover:text-photon-white hover:bg-white/5 transition-colors"
                title="Retry"
              >
                <RefreshCw size={14} />
              </button>
            )}

            <div className="w-px h-4 bg-white/10 mx-1" />

            <button
              onClick={() => handleFeedback(true)}
              disabled={feedbackGiven !== null}
              className={`p-1.5 rounded transition-colors ${
                feedbackGiven === 'positive'
                  ? 'text-deep-teal bg-deep-teal/20'
                  : feedbackGiven
                  ? 'text-white/20'
                  : 'text-mist-gray hover:text-photon-white hover:bg-white/5'
              }`}
              title="Helpful"
            >
              <ThumbsUp size={14} />
            </button>

            <button
              onClick={() => handleFeedback(false)}
              disabled={feedbackGiven !== null}
              className={`p-1.5 rounded transition-colors ${
                feedbackGiven === 'negative'
                  ? 'text-red-400 bg-red-400/20'
                  : feedbackGiven
                  ? 'text-white/20'
                  : 'text-mist-gray hover:text-photon-white hover:bg-white/5'
              }`}
              title="Not helpful"
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Render message content with basic markdown
function MessageContent({ content }: { content: string }) {
  // Split by double newlines for paragraphs
  const paragraphs = content.split('\n\n');

  return (
    <>
      {paragraphs.map((paragraph, pIndex) => {
        // Handle tables
        if (paragraph.includes('|') && paragraph.includes('---')) {
          return <MarkdownTable key={pIndex} content={paragraph} />;
        }

        // Handle lists
        if (paragraph.match(/^[-•*]\s/m)) {
          const items = paragraph.split('\n').filter((line) => line.trim());
          return (
            <ul key={pIndex} className="list-disc list-inside space-y-1 my-2">
              {items.map((item, iIndex) => (
                <li key={iIndex}>
                  <InlineMarkdown text={item.replace(/^[-•*]\s/, '')} />
                </li>
              ))}
            </ul>
          );
        }

        // Handle numbered lists
        if (paragraph.match(/^\d+\.\s/m)) {
          const items = paragraph.split('\n').filter((line) => line.trim());
          return (
            <ol key={pIndex} className="list-decimal list-inside space-y-1 my-2">
              {items.map((item, iIndex) => (
                <li key={iIndex}>
                  <InlineMarkdown text={item.replace(/^\d+\.\s/, '')} />
                </li>
              ))}
            </ol>
          );
        }

        // Handle headers
        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
          return (
            <h4 key={pIndex} className="font-semibold text-pellucid-cyan mt-3 mb-2">
              {paragraph.replace(/\*\*/g, '')}
            </h4>
          );
        }

        // Regular paragraph
        return (
          <p key={pIndex} className="my-2">
            <InlineMarkdown text={paragraph} />
          </p>
        );
      })}
    </>
  );
}

// Inline markdown (bold, italic, code)
function InlineMarkdown({ text }: { text: string }) {
  // Simple regex-based inline markdown
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-semibold text-photon-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={index} className="italic">
              {part.slice(1, -1)}
            </em>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={index}
              className="px-1.5 py-0.5 bg-white/10 rounded text-pellucid-cyan text-xs font-mono"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

// Simple markdown table
function MarkdownTable({ content }: { content: string }) {
  const lines = content.split('\n').filter((line) => line.trim());
  const headerLine = lines[0];
  const rows = lines.slice(2); // Skip header and separator

  const headers = headerLine
    .split('|')
    .map((h) => h.trim())
    .filter(Boolean);

  return (
    <div className="overflow-x-auto my-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((header, index) => (
              <th key={index} className="text-left px-2 py-1 text-pellucid-cyan font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const cells = row
              .split('|')
              .map((c) => c.trim())
              .filter(Boolean);
            return (
              <tr key={rowIndex} className="border-b border-white/5">
                {cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-2 py-1 text-mist-gray">
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Format timestamp
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
