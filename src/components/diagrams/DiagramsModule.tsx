'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, Button, Input } from '@/components/common';
import Badge from '@/components/common/Badge';
import {
  GitBranch,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Wallet,
  Building2,
  CreditCard,
  Users,
  Shield,
  CheckCircle,
  Clock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  ChevronRight,
  FileText,
  Code,
  X,
  Send,
  AlertCircle,
} from 'lucide-react';
import { MermaidRenderer } from './MermaidRenderer';
import {
  unrelatedPayments,
  UnrelatedPayment,
  FlowDiagram,
  naturalLanguageToMermaid
} from '@/data/unrelated-payments';
import { cn } from '@/lib/utils';

type DiagramType = 'funds_flow' | 'process_flow';
type ViewMode = 'list' | 'editor' | 'preview';

interface DiagramItem {
  id: string;
  name: string;
  type: DiagramType;
  status: 'draft' | 'review' | 'approved';
  version: string;
  lastUpdated: string;
  description: string;
  mermaidCode: string;
  paymentServiceId?: string;
}

export default function DiagramsModule() {
  const [diagrams, setDiagrams] = useState<DiagramItem[]>([]);
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [editableCode, setEditableCode] = useState('');
  const [showNaturalLanguageInput, setShowNaturalLanguageInput] = useState(false);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [selectedPaymentService, setSelectedPaymentService] = useState<UnrelatedPayment | null>(null);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [newDiagramType, setNewDiagramType] = useState<'process' | 'funds'>('process');

  // Initialize diagrams from unrelated payments
  useEffect(() => {
    const generatedDiagrams: DiagramItem[] = [];

    unrelatedPayments.forEach(payment => {
      // Process Flow
      generatedDiagrams.push({
        id: `${payment.id}-process`,
        name: `${payment.serviceName} - Process Flow`,
        type: 'process_flow',
        status: 'draft',
        version: '1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        description: payment.processFlow.description,
        mermaidCode: payment.processFlow.mermaidCode || '',
        paymentServiceId: payment.id,
      });

      // Funds Flow
      generatedDiagrams.push({
        id: `${payment.id}-funds`,
        name: `${payment.serviceName} - Funds Flow`,
        type: 'funds_flow',
        status: 'draft',
        version: '1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        description: payment.fundsFlow.description,
        mermaidCode: payment.fundsFlow.mermaidCode || '',
        paymentServiceId: payment.id,
      });
    });

    setDiagrams(generatedDiagrams);
    if (generatedDiagrams.length > 0) {
      setSelectedDiagram(generatedDiagrams[0]);
    }
  }, []);

  const handleSelectDiagram = (diagram: DiagramItem) => {
    setSelectedDiagram(diagram);
    setEditableCode(diagram.mermaidCode);
  };

  const handleCopyCode = () => {
    if (selectedDiagram) {
      navigator.clipboard.writeText(selectedDiagram.mermaidCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleUpdateCode = () => {
    if (selectedDiagram) {
      const updated = {
        ...selectedDiagram,
        mermaidCode: editableCode,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setDiagrams(prev => prev.map(d => d.id === selectedDiagram.id ? updated : d));
      setSelectedDiagram(updated);
      setShowCodeEditor(false);
    }
  };

  const handleGenerateFromNaturalLanguage = () => {
    if (naturalLanguageInput.trim()) {
      const newCode = naturalLanguageToMermaid(naturalLanguageInput, newDiagramType);

      // Create a new diagram entry
      const newDiagram: DiagramItem = {
        id: `custom-${Date.now()}`,
        name: `Custom ${newDiagramType === 'process' ? 'Process' : 'Funds'} Flow`,
        type: newDiagramType === 'process' ? 'process_flow' : 'funds_flow',
        status: 'draft',
        version: '1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        description: naturalLanguageInput.split('\n')[0].substring(0, 100) + '...',
        mermaidCode: newCode,
      };

      setDiagrams(prev => [newDiagram, ...prev]);
      setSelectedDiagram(newDiagram);
      setEditableCode(newCode);
      setNaturalLanguageInput('');
      setShowNaturalLanguageInput(false);
      setShowCodeEditor(true);
    }
  };

  const handleExportSVG = async () => {
    // In production, this would export the rendered SVG
    alert('Export functionality would download the diagram as SVG/PNG');
  };

  const handleGenerateFromPayment = (payment: UnrelatedPayment, type: 'process' | 'funds') => {
    const flow = type === 'process' ? payment.processFlow : payment.fundsFlow;
    const newDiagram: DiagramItem = {
      id: `custom-${Date.now()}`,
      name: `${payment.serviceName} - ${type === 'process' ? 'Process' : 'Funds'} Flow`,
      type: type === 'process' ? 'process_flow' : 'funds_flow',
      status: 'draft',
      version: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      description: flow.description,
      mermaidCode: flow.mermaidCode || '',
      paymentServiceId: payment.id,
    };
    setDiagrams(prev => [newDiagram, ...prev]);
    setSelectedDiagram(newDiagram);
    setShowPaymentSelector(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'review':
        return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
      case 'draft':
        return <Badge variant="gold"><Edit className="w-3 h-3 mr-1" />Draft</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: DiagramType) => {
    switch (type) {
      case 'funds_flow':
        return <Badge variant="gold" size="sm"><Wallet className="w-3 h-3 mr-1" />Funds Flow</Badge>;
      case 'process_flow':
        return <Badge variant="info" size="sm"><GitBranch className="w-3 h-3 mr-1" />Process Flow</Badge>;
      default:
        return null;
    }
  };

  const stats = {
    total: diagrams.length,
    approved: diagrams.filter(d => d.status === 'approved').length,
    fundsFlow: diagrams.filter(d => d.type === 'funds_flow').length,
    processFlow: diagrams.filter(d => d.type === 'process_flow').length,
  };

  // Get related payment service for selected diagram
  const relatedPayment = selectedDiagram?.paymentServiceId
    ? unrelatedPayments.find(p => p.id === selectedDiagram.paymentServiceId)
    : null;

  return (
    <div className={cn(
      'space-y-6',
      isFullscreen && 'fixed inset-0 z-50 bg-black p-6 overflow-auto'
    )}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Process & Funds Flow Diagrams</h1>
          <p className="text-gray-400 mt-1">
            FCA-compliant diagrams for unrelated payment services
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowNaturalLanguageInput(true)}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Generate from Text
          </Button>
          <Button
            onClick={() => setShowPaymentSelector(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Diagram
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-400">Total Diagrams</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-gold-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
                <p className="text-sm text-gray-400">Approved</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gold-500">{stats.fundsFlow}</p>
                <p className="text-sm text-gray-400">Funds Flow</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-gold-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-400">{stats.processFlow}</p>
                <p className="text-sm text-gray-400">Process Flow</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Diagrams List */}
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader
              title="Available Diagrams"
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowNaturalLanguageInput(true)}
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              }
            />
            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
              {/* Create from Natural Language Card */}
              <button
                onClick={() => setShowNaturalLanguageInput(true)}
                className="w-full p-4 text-left transition-all bg-gradient-to-r from-gold-500/10 to-transparent border-b border-white/10 hover:from-gold-500/20 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
                    <Sparkles className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <span className="font-medium text-gold-500 block">Create from Natural Language</span>
                    <span className="text-xs text-gray-400">Paste your process description here</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gold-500/50 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <div className="divide-y divide-white/10">
                {diagrams.map(diagram => {
                  const isSelected = selectedDiagram?.id === diagram.id;

                  return (
                    <button
                      key={diagram.id}
                      onClick={() => handleSelectDiagram(diagram)}
                      className={cn(
                        'w-full p-4 text-left transition-all hover:bg-white/5',
                        isSelected && 'bg-gold-500/5 border-l-2 border-gold-500'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={cn(
                          'font-medium text-sm line-clamp-1',
                          isSelected ? 'text-gold-500' : 'text-white'
                        )}>
                          {diagram.name}
                        </span>
                        {getStatusBadge(diagram.status)}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                        {diagram.description}
                      </p>
                      <div className="flex items-center gap-3">
                        {getTypeBadge(diagram.type)}
                        <span className="text-xs text-gray-500">v{diagram.version}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Diagram Viewer */}
        <div className="col-span-12 lg:col-span-8">
          {selectedDiagram ? (
            <Card>
              <CardHeader
                title={selectedDiagram.name}
                description={`Version ${selectedDiagram.version} • Last updated ${selectedDiagram.lastUpdated}`}
                action={
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditableCode(selectedDiagram.mermaidCode);
                        setShowCodeEditor(true);
                      }}
                    >
                      <Code className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                      {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleExportSVG}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </div>
                }
              />
              <CardContent>
                {/* Zoom Controls */}
                <div className="flex items-center justify-between mb-4 p-2 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-400 w-12 text-center">{zoom}%</span>
                    <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setZoom(100)}>
                      Reset
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(selectedDiagram.type)}
                  </div>
                </div>

                {/* Diagram Preview */}
                <div
                  className="relative bg-gray-900/50 rounded-lg border border-white/10 p-8 min-h-[500px] overflow-auto"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    minHeight: zoom < 100 ? `${500 * (100 / zoom)}px` : '500px'
                  }}
                >
                  <MermaidRenderer
                    code={selectedDiagram.mermaidCode}
                    className="flex justify-center"
                    theme="dark"
                  />
                </div>

                {/* Related Payment Service Info */}
                {relatedPayment && (
                  <div className="mt-4 p-4 bg-gold-500/5 border border-gold-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          Payment Service #{relatedPayment.serviceNumber}: {relatedPayment.serviceName}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {relatedPayment.serviceDescription}
                        </p>
                        {relatedPayment.keyControls && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {relatedPayment.keyControls.slice(0, 4).map((control, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="text-gray-500">{control.area}:</span>{' '}
                                <span className="text-gray-300">{control.control}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <GitBranch className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Select a Diagram
                </h3>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                  Choose a diagram from the list to preview, edit, or export for your FCA application.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={() => setShowNaturalLanguageInput(true)}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Create from Text
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowPaymentSelector(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    From Payment Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Code Editor Modal */}
      <AnimatePresence>
        {showCodeEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCodeEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Edit Mermaid Code</h2>
                <button
                  onClick={() => setShowCodeEditor(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 divide-x divide-white/10">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Code</h3>
                  <textarea
                    value={editableCode}
                    onChange={e => setEditableCode(e.target.value)}
                    className="w-full h-[400px] p-4 bg-black/50 border border-white/10 rounded-lg text-sm text-white font-mono resize-none focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    spellCheck={false}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Preview</h3>
                  <div className="h-[400px] bg-black/50 border border-white/10 rounded-lg overflow-auto p-4">
                    <MermaidRenderer code={editableCode} theme="dark" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-white/10 bg-black/20">
                <Button variant="ghost" onClick={() => setShowCodeEditor(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCode}>
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Natural Language Input Modal */}
      <AnimatePresence>
        {showNaturalLanguageInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNaturalLanguageInput(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Generate from Natural Language</h2>
                    <p className="text-sm text-gray-400">Describe your process flow in plain English</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNaturalLanguageInput(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-300">
                      <p className="font-medium mb-1">How to use:</p>
                      <ul className="text-blue-400 space-y-1 list-disc list-inside text-xs">
                        <li>Paste or type your process description below</li>
                        <li>Describe each step in sequence (numbered or bullet points work best)</li>
                        <li>Include decision points if any (e.g., "If approved, then...")</li>
                        <li>The system will convert your text into a visual flowchart</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <textarea
                  value={naturalLanguageInput}
                  onChange={e => setNaturalLanguageInput(e.target.value)}
                  placeholder={`Paste your process or funds flow description here...

Example:
1. Customer initiates payment request in mobile app
2. System validates payment details and checks balance
3. If sufficient funds: Debit customer account
   If insufficient funds: Return error to customer
4. Route payment to recipient's bank via payment network
5. Await confirmation from receiving bank
6. Update transaction status and notify customer`}
                  className="w-full h-[300px] p-4 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between p-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Diagram type:</span>
                  <div className="flex items-center bg-white/5 rounded-lg p-1">
                    <button
                      onClick={() => setNewDiagramType('process')}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        newDiagramType === 'process'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      )}
                    >
                      <GitBranch className="w-3.5 h-3.5 inline mr-1.5" />
                      Process Flow
                    </button>
                    <button
                      onClick={() => setNewDiagramType('funds')}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        newDiagramType === 'funds'
                          ? 'bg-gold-500 text-black'
                          : 'text-gray-400 hover:text-white'
                      )}
                    >
                      <Wallet className="w-3.5 h-3.5 inline mr-1.5" />
                      Funds Flow
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => setShowNaturalLanguageInput(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateFromNaturalLanguage}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    disabled={!naturalLanguageInput.trim()}
                  >
                    Generate Diagram
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Service Selector Modal */}
      <AnimatePresence>
        {showPaymentSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl bg-gray-900 border border-white/10 rounded-2xl overflow-hidden max-h-[80vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Generate from Payment Service</h2>
                <button
                  onClick={() => setShowPaymentSelector(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {unrelatedPayments.map(payment => (
                  <div
                    key={payment.id}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-gold-500/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-gold-500">{payment.serviceNumber}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white">{payment.serviceName}</h3>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{payment.serviceDescription}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleGenerateFromPayment(payment, 'process')}
                          >
                            <GitBranch className="w-3 h-3 mr-1" />
                            Process Flow
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleGenerateFromPayment(payment, 'funds')}
                          >
                            <Wallet className="w-3 h-3 mr-1" />
                            Funds Flow
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
