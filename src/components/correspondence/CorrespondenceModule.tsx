'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Input } from '@/components/common';
import Badge from '@/components/common/Badge';
import {
  Mail,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  Eye,
  Edit,
  Paperclip,
  MessageSquare,
  User,
  Calendar,
  ChevronRight,
  RefreshCw,
  Sparkles,
  FileText,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

// Mock FCA correspondence data
const MOCK_CORRESPONDENCE = [
  {
    id: '1',
    fcaReference: 'FCA-2024-001234',
    applicationRef: 'RV-2024-001',
    subject: 'Request for additional information - Safeguarding arrangements',
    status: 'pending_response',
    priority: 'high',
    receivedDate: '2024-01-18',
    dueDate: '2024-01-25',
    caseworker: 'J. Smith',
    excerpt: 'Please provide additional details regarding your proposed safeguarding arrangements, specifically: (1) Name of designated safeguarding bank...',
    hasAttachments: true,
    attachmentCount: 2,
  },
  {
    id: '2',
    fcaReference: 'FCA-2024-001198',
    applicationRef: 'RV-2024-002',
    subject: 'Clarification required - Business model and target customers',
    status: 'draft_response',
    priority: 'medium',
    receivedDate: '2024-01-15',
    dueDate: '2024-01-29',
    caseworker: 'A. Johnson',
    excerpt: 'We require further clarification on your business model, particularly regarding the expected transaction volumes and customer segments...',
    hasAttachments: false,
    attachmentCount: 0,
  },
  {
    id: '3',
    fcaReference: 'FCA-2024-001056',
    applicationRef: 'RV-2024-003',
    subject: 'Application acknowledgement and initial review',
    status: 'responded',
    priority: 'low',
    receivedDate: '2024-01-10',
    dueDate: null,
    caseworker: 'M. Williams',
    excerpt: 'We acknowledge receipt of your application for authorisation as a Payment Institution. Your application has been assigned reference...',
    hasAttachments: true,
    attachmentCount: 1,
  },
  {
    id: '4',
    fcaReference: 'FCA-2024-000987',
    applicationRef: 'RV-2024-004',
    subject: 'Request for information - AML/KYC procedures',
    status: 'responded',
    priority: 'high',
    receivedDate: '2024-01-05',
    dueDate: null,
    caseworker: 'J. Smith',
    excerpt: 'Please provide detailed information about your proposed AML/KYC procedures, including customer due diligence measures...',
    hasAttachments: true,
    attachmentCount: 3,
  },
];

// Mock AI draft response
const MOCK_DRAFT_RESPONSE = `Dear Ms. Smith,

Re: FCA-2024-001234 - Additional Information Request - Safeguarding Arrangements

Thank you for your letter dated 18 January 2024 requesting additional information regarding our proposed safeguarding arrangements.

Please find below our responses to each of your queries:

**1. Designated Safeguarding Bank**
Our designated safeguarding bank is Barclays Bank plc, with accounts held at their Commercial Banking division. The account details are:
- Account Name: [Organisation Name] Client Funds Account
- Sort Code: XX-XX-XX
- Account Number: XXXXXXXX

**2. Reconciliation Procedures**
We have implemented daily reconciliation procedures as follows:
- End-of-day reconciliation of all client money movements
- Automated matching between our ledger and bank statements
- Independent review by our MLRO within T+1

**3. Insurance Coverage**
We have obtained professional indemnity insurance with the following coverage:
- Insurer: Lloyd's of London
- Policy Number: XXXXX
- Coverage Amount: £X,XXX,XXX

Please find attached the relevant supporting documentation as requested.

Should you require any further information, please do not hesitate to contact us.

Yours sincerely,
[Name]
[Title]`;

export default function CorrespondenceModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<string | null>(null);
  const [showDraftEditor, setShowDraftEditor] = useState(false);
  const [draftContent, setDraftContent] = useState(MOCK_DRAFT_RESPONSE);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredCorrespondence = MOCK_CORRESPONDENCE.filter(item =>
    item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.fcaReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.applicationRef.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_response':
        return <Badge variant="warning"><AlertTriangle className="w-3 h-3 mr-1" />Pending Response</Badge>;
      case 'draft_response':
        return <Badge variant="gold"><Edit className="w-3 h-3 mr-1" />Draft Ready</Badge>;
      case 'responded':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Responded</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error" size="sm">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">Medium</Badge>;
      case 'low':
        return <Badge variant="default" size="sm">Low</Badge>;
      default:
        return null;
    }
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsGenerating(false);
    setShowDraftEditor(true);
  };

  const selectedItem = MOCK_CORRESPONDENCE.find(c => c.id === selectedCorrespondence);

  const pendingCount = MOCK_CORRESPONDENCE.filter(c => c.status === 'pending_response').length;
  const draftCount = MOCK_CORRESPONDENCE.filter(c => c.status === 'draft_response').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">FCA Correspondence</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Manage FCA caseworker queries and draft responses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Sync Inbox
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            New Response
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--color-text)]">{MOCK_CORRESPONDENCE.length}</p>
                <p className="text-sm text-[var(--color-text-muted)]">Total Items</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--color-gold)]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
                <p className="text-sm text-[var(--color-text-muted)]">Pending Response</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--color-gold)]">{draftCount}</p>
                <p className="text-sm text-[var(--color-text-muted)]">Drafts Ready</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center">
                <Edit className="w-5 h-5 text-[var(--color-gold)]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-400">
                  {MOCK_CORRESPONDENCE.filter(c => c.status === 'responded').length}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">Responded</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search by reference, subject, or application..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Correspondence List */}
        <div className="col-span-12 lg:col-span-5">
          <Card>
            <CardHeader title="Inbox" description={`${filteredCorrespondence.length} items`} />
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--color-border)]">
                {filteredCorrespondence.map(item => {
                  const isSelected = selectedCorrespondence === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCorrespondence(item.id)}
                      className={`w-full p-4 text-left transition-all hover:bg-[var(--color-surface-hover)] ${
                        isSelected ? 'bg-[var(--color-gold)]/5 border-l-2 border-[var(--color-gold)]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'}`}>
                            {item.fcaReference}
                          </span>
                          {getPriorityBadge(item.priority)}
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className={`text-sm font-medium line-clamp-2 ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text)]'}`}>
                        {item.subject}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.receivedDate}
                        </span>
                        {item.dueDate && (
                          <span className="flex items-center gap-1 text-amber-400">
                            <Clock className="w-3 h-3" />
                            Due: {item.dueDate}
                          </span>
                        )}
                        {item.hasAttachments && (
                          <span className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            {item.attachmentCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Correspondence Detail */}
        <div className="col-span-12 lg:col-span-7">
          {selectedItem ? (
            <Card>
              <CardHeader
                title={selectedItem.subject}
                description={`${selectedItem.fcaReference} • Application: ${selectedItem.applicationRef}`}
                action={
                  <div className="flex gap-2">
                    {selectedItem.status === 'pending_response' && (
                      <Button
                        onClick={handleGenerateDraft}
                        isLoading={isGenerating}
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Generate Draft
                      </Button>
                    )}
                    {selectedItem.status === 'draft_response' && (
                      <Button variant="secondary">
                        <Eye className="w-4 h-4 mr-1" />
                        View Draft
                      </Button>
                    )}
                  </div>
                }
              />
              <CardContent>
                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Caseworker</p>
                    <p className="text-sm font-medium text-[var(--color-text)] flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedItem.caseworker}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Received</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">{selectedItem.receivedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Due Date</p>
                    <p className={`text-sm font-medium ${selectedItem.dueDate ? 'text-amber-400' : 'text-[var(--color-text-muted)]'}`}>
                      {selectedItem.dueDate || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Priority</p>
                    <p className="text-sm font-medium text-[var(--color-text)] capitalize">{selectedItem.priority}</p>
                  </div>
                </div>

                {/* Original Message */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">Original Query</h3>
                  <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-text)] whitespace-pre-line">
                      {selectedItem.excerpt}
                    </p>
                    {selectedItem.hasAttachments && (
                      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-text-muted)] mb-2">Attachments ({selectedItem.attachmentCount})</p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            FCA_Query_Form.pdf
                          </Button>
                          {selectedItem.attachmentCount > 1 && (
                            <Button variant="ghost" size="sm">
                              <FileText className="w-4 h-4 mr-1" />
                              Additional_Info_Request.pdf
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Draft Response Editor */}
                {showDraftEditor && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">AI-Generated Draft Response</h3>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-gold)]/30">
                      <textarea
                        value={draftContent}
                        onChange={(e) => setDraftContent(e.target.value)}
                        rows={15}
                        className="w-full bg-transparent text-sm text-[var(--color-text)] focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                        <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
                        AI-generated draft - Review and edit before sending
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary">
                          Save Draft
                        </Button>
                        <Button>
                          <Send className="w-4 h-4 mr-1" />
                          Submit for Review
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!showDraftEditor && selectedItem.status === 'pending_response' && (
                  <div className="p-4 bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-[var(--color-gold)] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">Response Required</p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                          Click &quot;Generate Draft&quot; to create an AI-assisted response based on your application data and FCA requirements.
                          The draft will be reviewed by your compliance team before submission.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Mail className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                  Select a Message
                </h3>
                <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
                  Choose an item from the inbox to view the full message and draft a response.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
