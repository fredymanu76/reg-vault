'use client';

import { useState } from 'react';
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
  ArrowDown,
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
} from 'lucide-react';

// Mock diagrams data
const MOCK_DIAGRAMS = [
  {
    id: '1',
    name: 'Customer Funds Flow',
    type: 'funds_flow',
    status: 'approved',
    version: '1.2',
    lastUpdated: '2024-01-18',
    description: 'End-to-end flow of customer funds from receipt to settlement',
  },
  {
    id: '2',
    name: 'Payment Processing Flow',
    type: 'process_flow',
    status: 'draft',
    version: '0.5',
    lastUpdated: '2024-01-20',
    description: 'Internal payment processing and reconciliation workflow',
  },
  {
    id: '3',
    name: 'Safeguarding Arrangements',
    type: 'funds_flow',
    status: 'review',
    version: '1.0',
    lastUpdated: '2024-01-19',
    description: 'Client money safeguarding account structure',
  },
  {
    id: '4',
    name: 'Customer Onboarding Process',
    type: 'process_flow',
    status: 'approved',
    version: '2.0',
    lastUpdated: '2024-01-15',
    description: 'KYC and customer onboarding workflow',
  },
];

// Mermaid-style diagram representation
const FUNDS_FLOW_DIAGRAM = `
┌─────────────────┐
│    Customer     │
│   (Payer)       │
└────────┬────────┘
         │ ① Initiates Payment
         ▼
┌─────────────────┐
│   Payment API   │
│   (Our System)  │
└────────┬────────┘
         │ ② Validation & AML Check
         ▼
┌─────────────────┐
│  Safeguarding   │
│    Account      │
│  (Barclays)     │
└────────┬────────┘
         │ ③ Funds Held T+1
         ▼
┌─────────────────┐
│   Settlement    │
│    System       │
└────────┬────────┘
         │ ④ Transfer to Beneficiary
         ▼
┌─────────────────┐
│   Beneficiary   │
│    Account      │
└─────────────────┘
`;

export default function DiagramsModule() {
  const [selectedDiagram, setSelectedDiagram] = useState<string | null>('1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoom, setZoom] = useState(100);

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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'funds_flow':
        return <Badge variant="gold" size="sm">Funds Flow</Badge>;
      case 'process_flow':
        return <Badge variant="info" size="sm">Process Flow</Badge>;
      default:
        return null;
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const selectedDiagramData = MOCK_DIAGRAMS.find(d => d.id === selectedDiagram);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Process & Flow Diagrams</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Funds flow and process flow diagrams for FCA applications
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Create Diagram
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--color-text)]">{MOCK_DIAGRAMS.length}</p>
                <p className="text-sm text-[var(--color-text-muted)]">Total Diagrams</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-[var(--color-gold)]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-400">
                  {MOCK_DIAGRAMS.filter(d => d.status === 'approved').length}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">Approved</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--color-gold)]">
                  {MOCK_DIAGRAMS.filter(d => d.type === 'funds_flow').length}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">Funds Flow</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[var(--color-gold)]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-400">
                  {MOCK_DIAGRAMS.filter(d => d.type === 'process_flow').length}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">Process Flow</p>
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
            <CardHeader title="Your Diagrams" />
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--color-border)]">
                {MOCK_DIAGRAMS.map(diagram => {
                  const isSelected = selectedDiagram === diagram.id;

                  return (
                    <button
                      key={diagram.id}
                      onClick={() => setSelectedDiagram(diagram.id)}
                      className={`w-full p-4 text-left transition-all hover:bg-[var(--color-surface-hover)] ${
                        isSelected ? 'bg-[var(--color-gold)]/5 border-l-2 border-[var(--color-gold)]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`font-medium text-sm ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text)]'}`}>
                          {diagram.name}
                        </span>
                        {getStatusBadge(diagram.status)}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-2">
                        {diagram.description}
                      </p>
                      <div className="flex items-center gap-3">
                        {getTypeBadge(diagram.type)}
                        <span className="text-xs text-[var(--color-text-muted)]">v{diagram.version}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-[var(--color-text)] mb-3">Quick Generate</h3>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate from Intake
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Wallet className="w-4 h-4 mr-2" />
                  Funds Flow Template
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Process Flow Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Diagram Viewer */}
        <div className="col-span-12 lg:col-span-8">
          {selectedDiagramData ? (
            <Card>
              <CardHeader
                title={selectedDiagramData.name}
                description={`Version ${selectedDiagramData.version} • Last updated ${selectedDiagramData.lastUpdated}`}
                action={
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                }
              />
              <CardContent>
                {/* Zoom Controls */}
                <div className="flex items-center justify-between mb-4 p-2 bg-[var(--color-surface)] rounded-lg">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-[var(--color-text-muted)] w-12 text-center">{zoom}%</span>
                    <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(150, zoom + 10))}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Diagram Preview */}
                <div
                  className="relative bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-8 min-h-[500px] overflow-auto"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                >
                  {/* Visual Diagram */}
                  <div className="flex flex-col items-center gap-4">
                    {/* Customer */}
                    <div className="flex items-center justify-center w-48 h-16 bg-blue-500/10 border-2 border-blue-500/30 rounded-lg">
                      <Users className="w-5 h-5 text-blue-400 mr-2" />
                      <span className="text-sm font-medium text-[var(--color-text)]">Customer (Payer)</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <ArrowDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                      <span className="text-xs text-[var(--color-text-muted)] my-1">① Initiates Payment</span>
                    </div>

                    {/* Payment API */}
                    <div className="flex items-center justify-center w-48 h-16 bg-[var(--color-gold)]/10 border-2 border-[var(--color-gold)]/30 rounded-lg">
                      <CreditCard className="w-5 h-5 text-[var(--color-gold)] mr-2" />
                      <span className="text-sm font-medium text-[var(--color-text)]">Payment API</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <ArrowDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                      <span className="text-xs text-[var(--color-text-muted)] my-1">② Validation & AML Check</span>
                    </div>

                    {/* Safeguarding Account */}
                    <div className="flex items-center justify-center w-48 h-16 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-lg">
                      <Shield className="w-5 h-5 text-emerald-400 mr-2" />
                      <div className="text-center">
                        <span className="text-sm font-medium text-[var(--color-text)]">Safeguarding Account</span>
                        <p className="text-xs text-[var(--color-text-muted)]">(Barclays)</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <ArrowDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                      <span className="text-xs text-[var(--color-text-muted)] my-1">③ Funds Held T+1</span>
                    </div>

                    {/* Settlement System */}
                    <div className="flex items-center justify-center w-48 h-16 bg-purple-500/10 border-2 border-purple-500/30 rounded-lg">
                      <GitBranch className="w-5 h-5 text-purple-400 mr-2" />
                      <span className="text-sm font-medium text-[var(--color-text)]">Settlement System</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <ArrowDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                      <span className="text-xs text-[var(--color-text-muted)] my-1">④ Transfer to Beneficiary</span>
                    </div>

                    {/* Beneficiary */}
                    <div className="flex items-center justify-center w-48 h-16 bg-blue-500/10 border-2 border-blue-500/30 rounded-lg">
                      <Building2 className="w-5 h-5 text-blue-400 mr-2" />
                      <span className="text-sm font-medium text-[var(--color-text)]">Beneficiary Account</span>
                    </div>
                  </div>
                </div>

                {/* Diagram Info */}
                <div className="mt-4 p-4 bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[var(--color-gold)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">AI-Generated Diagram</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        This diagram was automatically generated based on your business model and safeguarding arrangements.
                        Edit to customise or export for your FCA submission bundle.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <GitBranch className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                  Select a Diagram
                </h3>
                <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
                  Choose a diagram from the list to preview, edit, or export for your FCA application.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
