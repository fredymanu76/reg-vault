// REG-VAULT Bundle Checklist
// Document checklist with status indicators

import { BundleDocument } from './SmartBundleGenerator';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  XCircle,
  FileText,
  ExternalLink,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface BundleChecklistProps {
  documents: BundleDocument[];
  onDocumentClick: (document: BundleDocument) => void;
}

export function BundleChecklist({ documents, onDocumentClick }: BundleChecklistProps) {
  const getStatusConfig = (status: BundleDocument['status']) => {
    switch (status) {
      case 'complete':
        return {
          icon: CheckCircle,
          color: 'text-deep-teal',
          bg: 'bg-deep-teal/10',
          label: 'Complete',
        };
      case 'incomplete':
        return {
          icon: AlertTriangle,
          color: 'text-apex-amber',
          bg: 'bg-apex-amber/10',
          label: 'Incomplete',
        };
      case 'missing':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          label: 'Missing',
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          label: 'Error',
        };
    }
  };

  const getSourceLabel = (source: BundleDocument['source']) => {
    switch (source) {
      case 'journey':
        return 'From Journey';
      case 'financial':
        return 'Financial Module';
      case 'policy':
        return 'Policies Module';
      case 'form':
        return 'FCA Forms';
      case 'manual':
        return 'Manual Upload';
    }
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white/5 rounded-lg p-8 text-center">
        <FileText size={48} className="mx-auto text-mist-gray mb-4" />
        <h3 className="text-lg font-medium text-photon-white mb-2">No Documents</h3>
        <p className="text-mist-gray">
          Select a category to view documents.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-medium text-photon-white">
          Documents ({documents.length})
        </h3>
      </div>

      <div className="divide-y divide-white/5">
        {documents.map((doc) => {
          const statusConfig = getStatusConfig(doc.status);
          const StatusIcon = statusConfig.icon;

          return (
            <button
              key={doc.id}
              onClick={() => onDocumentClick(doc)}
              className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
            >
              {/* Status Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig.bg}`}>
                <StatusIcon size={20} className={statusConfig.color} />
              </div>

              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-photon-white truncate">
                    {doc.name}
                  </h4>
                  {doc.fcaRequired && (
                    <span className="px-1.5 py-0.5 bg-apex-amber/20 text-apex-amber text-xs rounded">
                      Required
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-mist-gray">{getSourceLabel(doc.source)}</span>
                  {doc.fcaReference && (
                    <span className="text-xs text-pellucid-cyan flex items-center gap-1">
                      <ExternalLink size={10} />
                      {doc.fcaReference}
                    </span>
                  )}
                  {doc.lastUpdated && (
                    <span className="text-xs text-mist-gray flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(doc.lastUpdated).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Validation Errors */}
                {doc.validationErrors && doc.validationErrors.length > 0 && (
                  <div className="mt-2">
                    {doc.validationErrors.map((error, i) => (
                      <p key={i} className="text-xs text-red-400 flex items-start gap-1">
                        <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Badge & Arrow */}
              <div className="flex items-center gap-3">
                <span className={`text-xs ${statusConfig.color}`}>{statusConfig.label}</span>
                <ChevronRight size={16} className="text-mist-gray" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-deep-teal">
              <CheckCircle size={14} />
              {documents.filter((d) => d.status === 'complete').length} Complete
            </span>
            <span className="flex items-center gap-1 text-apex-amber">
              <AlertTriangle size={14} />
              {documents.filter((d) => d.status === 'incomplete').length} Incomplete
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <XCircle size={14} />
              {documents.filter((d) => d.status === 'missing').length} Missing
            </span>
          </div>
          <span className="text-mist-gray">
            {documents.filter((d) => d.fcaRequired && d.status !== 'complete').length} required items pending
          </span>
        </div>
      </div>
    </div>
  );
}

// Detailed document view component
interface DocumentDetailProps {
  document: BundleDocument;
  onClose: () => void;
  onEdit: () => void;
}

export function DocumentDetail({ document, onClose, onEdit }: DocumentDetailProps) {
  const statusConfig = {
    complete: { color: 'text-deep-teal', bg: 'bg-deep-teal/10' },
    incomplete: { color: 'text-apex-amber', bg: 'bg-apex-amber/10' },
    missing: { color: 'text-red-400', bg: 'bg-red-500/10' },
    error: { color: 'text-red-400', bg: 'bg-red-500/10' },
  }[document.status];

  return (
    <div className="fixed inset-0 bg-void-black/80 flex items-center justify-center z-50">
      <div className="bg-jet-black rounded-lg border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig.bg}`}>
              <FileText size={20} className={statusConfig.color} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-photon-white">{document.name}</h3>
              <p className="text-sm text-mist-gray capitalize">{document.status}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-mist-gray hover:text-photon-white"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Document Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-mist-gray mb-1">Source</p>
              <p className="text-sm text-photon-white capitalize">
                {document.source.replace('_', ' ')}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-mist-gray mb-1">FCA Reference</p>
              <p className="text-sm text-pellucid-cyan">
                {document.fcaReference || 'N/A'}
              </p>
            </div>
          </div>

          {/* FCA Requirement */}
          {document.fcaRequired && (
            <div className="bg-apex-amber/10 border border-apex-amber/20 rounded-lg p-3">
              <p className="text-sm text-apex-amber font-medium">FCA Required Document</p>
              <p className="text-xs text-mist-gray mt-1">
                This document is mandatory for your FCA application.
              </p>
            </div>
          )}

          {/* Validation Errors */}
          {document.validationErrors && document.validationErrors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-400 font-medium mb-2">Validation Issues</p>
              <ul className="space-y-1">
                {document.validationErrors.map((error, i) => (
                  <li key={i} className="text-xs text-mist-gray flex items-start gap-2">
                    <AlertCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Last Updated */}
          {document.lastUpdated && (
            <p className="text-xs text-mist-gray">
              Last updated: {new Date(document.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        <div className="p-4 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-mist-gray hover:text-photon-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-pellucid-cyan hover:bg-pellucid-cyan/80 text-void-black font-medium rounded-lg transition-colors"
          >
            Edit Document
          </button>
        </div>
      </div>
    </div>
  );
}
