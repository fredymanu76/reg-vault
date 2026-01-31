'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, Button, Input } from '@/components/common';
import Badge from '@/components/common/Badge';
import {
  FileText,
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Download,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { PolicyList } from './PolicyList';
import { PolicyTemplateSelector } from './PolicyTemplateSelector';
import { PolicyViewer } from './PolicyViewer';
import { PolicyEditor } from './PolicyEditor';
import { PolicyGenerator } from './PolicyGenerator';
import {
  Policy,
  policyService,
  policyTemplateService,
  policyGenerationService,
  PolicyGenerationResult,
} from '@/services/policyService';
import { PolicyTemplate } from '@/data/policy-templates';

type ViewMode = 'list' | 'templates' | 'generating';

export default function PoliciesModule() {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [templates, setTemplates] = useState<PolicyTemplate[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock application data - in production, this would come from context/props
  const applicationId = 'mock-app-id';
  const companyName = 'Acme Payments Ltd';
  const licenceType = 'SPI';

  // Load policies from database
  const loadPolicies = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await policyService.getByApplicationId(applicationId);
      setPolicies(data);
    } catch (error) {
      console.error('Error loading policies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  // Load templates based on licence type
  useEffect(() => {
    const licenceTemplates = policyTemplateService.getForLicenceType(licenceType);
    setTemplates(licenceTemplates);
  }, [licenceType]);

  // Load policies on mount
  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  // Handlers
  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
  };

  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
    setSelectedPolicy(null);
  };

  const handleSavePolicy = async (policy: Policy, content: string) => {
    const updated = await policyService.update(policy.id, { content });
    if (updated) {
      setPolicies(prev =>
        prev.map(p => (p.id === policy.id ? updated : p))
      );
      setEditingPolicy(null);
    }
  };

  const handleDeletePolicy = async (policy: Policy) => {
    if (confirm(`Are you sure you want to delete "${policy.name}"?`)) {
      const success = await policyService.delete(policy.id);
      if (success) {
        setPolicies(prev => prev.filter(p => p.id !== policy.id));
      }
    }
  };

  const handleApprovePolicy = async (policy: Policy) => {
    const updated = await policyService.approve(policy.id, 'current-user-id');
    if (updated) {
      setPolicies(prev =>
        prev.map(p => (p.id === policy.id ? updated : p))
      );
      setSelectedPolicy(null);
    }
  };

  const handleDownloadPolicy = (policy: Policy) => {
    // Create a blob with the policy content
    const blob = new Blob([policy.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${policy.name.replace(/\s+/g, '_')}_v${policy.version}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateFromTemplates = (templateIds: string[]) => {
    setSelectedTemplates(templateIds);
    setViewMode('generating');
  };

  const handleGenerationComplete = (results: PolicyGenerationResult[]) => {
    setViewMode('list');
    setSelectedTemplates([]);
    loadPolicies();
  };

  // Stats calculations
  const stats = {
    total: policies.length,
    approved: policies.filter(p => p.status === 'approved').length,
    pending: policies.filter(p => p.status === 'review_pending').length,
    draft: policies.filter(p => p.status === 'draft').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {viewMode === 'templates' ? (
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Policies
            </button>
          ) : null}
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            {viewMode === 'templates' ? 'Generate New Policies' : 'Policies & Procedures'}
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            {viewMode === 'templates'
              ? 'Select policy templates to generate customized policies'
              : 'AI-generated policies mapped to FCA regulations'}
          </p>
        </div>
        {viewMode === 'list' && (
          <Button
            onClick={() => setViewMode('templates')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Generate Policies
          </Button>
        )}
      </div>

      {/* Stats - only show in list view */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Total Policies</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[var(--color-gold)]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-emerald-400">{stats.approved}</p>
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
                  <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Under Review</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[var(--color-gold)]">{stats.draft}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Drafts</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center">
                  <Edit className="w-5 h-5 text-[var(--color-gold)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'list' && (
        <Card>
          <CardContent className="p-6">
            <PolicyList
              policies={policies}
              onView={handleViewPolicy}
              onEdit={handleEditPolicy}
              onDelete={handleDeletePolicy}
              onApprove={handleApprovePolicy}
              onDownload={handleDownloadPolicy}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      )}

      {viewMode === 'templates' && (
        <Card>
          <CardContent className="p-6">
            <PolicyTemplateSelector
              licenceType={licenceType}
              selectedTemplates={selectedTemplates}
              onSelectionChange={setSelectedTemplates}
              onGenerate={handleGenerateFromTemplates}
              isGenerating={isGenerating}
            />
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedPolicy && (
          <PolicyViewer
            policy={selectedPolicy}
            onClose={() => setSelectedPolicy(null)}
            onEdit={handleEditPolicy}
            onDownload={handleDownloadPolicy}
            onApprove={handleApprovePolicy}
          />
        )}

        {editingPolicy && (
          <PolicyEditor
            policy={editingPolicy}
            onSave={handleSavePolicy}
            onClose={() => setEditingPolicy(null)}
          />
        )}

        {viewMode === 'generating' && selectedTemplates.length > 0 && (
          <PolicyGenerator
            applicationId={applicationId}
            companyName={companyName}
            licenceType={licenceType}
            templates={templates}
            selectedTemplateIds={selectedTemplates}
            onComplete={handleGenerationComplete}
            onClose={() => {
              setViewMode('templates');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
