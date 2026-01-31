'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface MermaidRendererProps {
  code: string;
  className?: string;
  theme?: 'dark' | 'light';
}

export function MermaidRenderer({ code, className, theme = 'dark' }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const renderDiagram = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Dynamic import of mermaid
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          themeVariables: theme === 'dark' ? {
            primaryColor: '#d4af37',
            primaryTextColor: '#fff',
            primaryBorderColor: '#d4af37',
            lineColor: '#888',
            secondaryColor: '#1f2937',
            tertiaryColor: '#374151',
            background: '#0a0a0a',
            mainBkg: '#1f2937',
            secondBkg: '#374151',
            border1: '#4b5563',
            border2: '#6b7280',
            arrowheadColor: '#888',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: '14px',
            textColor: '#fff',
            nodeTextColor: '#fff',
          } : {},
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 15,
            nodeSpacing: 50,
            rankSpacing: 50,
          },
          securityLevel: 'loose',
        });

        // Generate unique ID for this render
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const { svg: renderedSvg } = await mermaid.render(id, code);
        setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      renderDiagram();
    }
  }, [code, theme]);

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Rendering diagram...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('p-4 bg-red-500/10 border border-red-500/20 rounded-lg', className)}>
        <p className="text-sm text-red-400">Error rendering diagram: {error}</p>
        <pre className="mt-2 text-xs text-gray-400 overflow-auto">{code}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('mermaid-container', className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default MermaidRenderer;
