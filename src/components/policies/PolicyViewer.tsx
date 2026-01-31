'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  X,
  Download,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { Policy } from '@/services/policyService';
import { cn } from '@/lib/utils';

interface PolicyViewerProps {
  policy: Policy;
  onClose: () => void;
  onEdit?: (policy: Policy) => void;
  onDownload?: (policy: Policy) => void;
  onApprove?: (policy: Policy) => void;
}

const statusConfig = {
  draft: {
    label: 'Draft',
    icon: FileText,
    color: 'text-gray-400',
    bg: 'bg-gray-500/20',
  },
  generating: {
    label: 'Generating',
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  review_pending: {
    label: 'Review Pending',
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
  },
  rejected: {
    label: 'Rejected',
    icon: AlertCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
  },
  final: {
    label: 'Final',
    icon: CheckCircle,
    color: 'text-gold-500',
    bg: 'bg-gold-500/20',
  },
};

export function PolicyViewer({
  policy,
  onClose,
  onEdit,
  onDownload,
  onApprove,
}: PolicyViewerProps) {
  const [copied, setCopied] = useState(false);
  const status = statusConfig[policy.status as keyof typeof statusConfig] || statusConfig.draft;
  const StatusIcon = status.icon;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(policy.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${policy.name}</title>
            <style>
              body {
                font-family: 'Times New Roman', serif;
                max-width: 800px;
                margin: 40px auto;
                padding: 20px;
                line-height: 1.6;
              }
              h1, h2, h3 { color: #1a1a1a; }
              h1 { font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 10px; }
              h2 { font-size: 18px; margin-top: 24px; }
              h3 { font-size: 16px; margin-top: 20px; }
              p { margin: 12px 0; }
              .meta { color: #666; font-size: 12px; margin-bottom: 20px; }
              @media print {
                body { margin: 0; padding: 20px; }
              }
            </style>
          </head>
          <body>
            <h1>${policy.name}</h1>
            <div class="meta">
              Version ${policy.version} | Status: ${status.label} |
              Last Updated: ${new Date(policy.updated_at).toLocaleDateString('en-GB')}
            </div>
            <div>${policy.content.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{policy.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={cn(
                    'flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full',
                    status.bg,
                    status.color
                  )}
                >
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
                <span className="text-xs text-gray-500">v{policy.version}</span>
                <span className="text-xs text-gray-500">
                  Updated {new Date(policy.updated_at).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
              {policy.content}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            {onDownload && (
              <button
                onClick={() => onDownload(policy)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {policy.status === 'review_pending' && onApprove && (
              <button
                onClick={() => onApprove(policy)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            )}
            {onEdit && policy.status !== 'final' && (
              <button
                onClick={() => onEdit(policy)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gold-500 text-black hover:bg-gold-400 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Policy
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PolicyViewer;
