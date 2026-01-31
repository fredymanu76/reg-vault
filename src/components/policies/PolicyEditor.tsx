'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  X,
  Save,
  Eye,
  Undo,
  Redo,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  AlertCircle,
} from 'lucide-react';
import { Policy } from '@/services/policyService';
import { cn } from '@/lib/utils';

interface PolicyEditorProps {
  policy: Policy;
  onSave: (policy: Policy, content: string) => Promise<void>;
  onClose: () => void;
  onPreview?: (content: string) => void;
}

export function PolicyEditor({
  policy,
  onSave,
  onClose,
  onPreview,
}: PolicyEditorProps) {
  const [content, setContent] = useState(policy.content);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [history, setHistory] = useState<string[]>([policy.content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  useEffect(() => {
    setHasChanges(content !== policy.content);
  }, [content, policy.content]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setContent(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setContent(history[historyIndex + 1]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(policy, content);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving policy:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowUnsavedWarning(true);
    } else {
      onClose();
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('policy-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      content.substring(end);

    handleContentChange(newContent);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-gray-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Edit: {policy.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">v{policy.version}</span>
                {hasChanges && (
                  <span className="text-xs text-yellow-400">• Unsaved changes</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onPreview && (
              <button
                onClick={() => onPreview(content)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-black/20">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className={cn(
              'p-2 rounded-lg transition-colors',
              historyIndex === 0
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            )}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className={cn(
              'p-2 rounded-lg transition-colors',
              historyIndex >= history.length - 1
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            )}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          <button
            onClick={() => insertMarkdown('**', '**')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('*', '*')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          <button
            onClick={() => insertMarkdown('# ')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('## ')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          <button
            onClick={() => insertMarkdown('- ')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('1. ')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <textarea
            id="policy-editor"
            value={content}
            onChange={e => handleContentChange(e.target.value)}
            className="w-full h-full p-6 bg-transparent text-gray-300 font-mono text-sm leading-relaxed resize-none focus:outline-none"
            placeholder="Enter policy content..."
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-black/20">
          <div className="text-sm text-gray-500">
            {content.length.toLocaleString()} characters •{' '}
            {content.split(/\s+/).filter(Boolean).length.toLocaleString()} words
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all',
                hasChanges && !isSaving
                  ? 'bg-gold-500 text-black hover:bg-gold-400'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              )}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {showUnsavedWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Unsaved Changes</h3>
              </div>
              <p className="text-gray-400 mb-6">
                You have unsaved changes. Do you want to save them before closing?
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setShowUnsavedWarning(false);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={() => setShowUnsavedWarning(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handleSave();
                    setShowUnsavedWarning(false);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-medium bg-gold-500 text-black hover:bg-gold-400 rounded-lg transition-colors"
                >
                  Save & Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default PolicyEditor;
