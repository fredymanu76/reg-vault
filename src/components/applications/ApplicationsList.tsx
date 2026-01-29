'use client';

import { useState } from 'react';
import { useUIStore } from '@/lib/store';
import { Card, CardHeader, CardContent, Button, Input } from '@/components/common';
import Badge from '@/components/common/Badge';
import Progress from '@/components/common/Progress';
import { formatDate, formatStatus } from '@/lib/utils';
import {
  Search,
  Filter,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  ChevronDown,
} from 'lucide-react';

// Mock applications data
const mockApplications = [
  {
    id: '1',
    reference_number: 'RV-2024-001',
    organisation_name: 'PayFlow Technologies Ltd',
    licence_type: 'SPI',
    status: 'intake_in_progress',
    progress_percentage: 45,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    next_action: 'Complete business model questionnaire',
  },
  {
    id: '2',
    reference_number: 'RV-2024-002',
    organisation_name: 'QuickPay Services',
    licence_type: 'SMALL_EMI',
    status: 'review_pending',
    progress_percentage: 85,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-19T16:00:00Z',
    next_action: 'Internal review before submission',
  },
  {
    id: '3',
    reference_number: 'RV-2024-003',
    organisation_name: 'OpenBank Connect',
    licence_type: 'AISP',
    status: 'submitted_to_fca',
    progress_percentage: 100,
    created_at: '2024-01-05T11:00:00Z',
    updated_at: '2024-01-18T10:00:00Z',
    next_action: 'Awaiting FCA acknowledgement',
  },
  {
    id: '4',
    reference_number: 'RV-2024-004',
    organisation_name: 'FinTrust Payments',
    licence_type: 'API',
    status: 'fca_queries',
    progress_percentage: 100,
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-17T12:00:00Z',
    next_action: 'Respond to safeguarding query',
  },
  {
    id: '5',
    reference_number: 'RV-2023-012',
    organisation_name: 'SecurePay Solutions',
    licence_type: 'EMI',
    status: 'approved',
    progress_percentage: 100,
    created_at: '2023-11-15T09:00:00Z',
    updated_at: '2024-01-10T11:00:00Z',
    next_action: 'Application approved',
  },
  {
    id: '6',
    reference_number: 'RV-2024-005',
    organisation_name: 'PayWise Ltd',
    licence_type: 'PISP',
    status: 'draft',
    progress_percentage: 15,
    created_at: '2024-01-20T14:00:00Z',
    updated_at: '2024-01-20T14:00:00Z',
    next_action: 'Complete organisation details',
  },
];

const statusFilters = [
  { value: 'all', label: 'All Applications' },
  { value: 'draft', label: 'Draft' },
  { value: 'intake_in_progress', label: 'Intake In Progress' },
  { value: 'review_pending', label: 'Pending Review' },
  { value: 'submitted_to_fca', label: 'Submitted to FCA' },
  { value: 'fca_queries', label: 'FCA Queries' },
  { value: 'approved', label: 'Approved' },
];

export default function ApplicationsList() {
  const { setActiveModule } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.reference_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.organisation_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'fca_queries':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'submitted_to_fca':
        return <FileText className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'fca_queries':
        return 'warning';
      case 'submitted_to_fca':
        return 'info';
      case 'draft':
        return 'default';
      default:
        return 'gold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Applications</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Manage your FCA licence applications
          </p>
        </div>
        <Button
          onClick={() => setActiveModule('new-application')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Application
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by reference or organisation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Button
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  rightIcon={<ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {statusFilter === 'all' ? 'All Status' : statusFilters.find(f => f.value === statusFilter)?.label}
                </Button>
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg z-10">
                    {statusFilters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => {
                          setStatusFilter(filter.value);
                          setShowFilters(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--color-surface-hover)] transition-colors ${
                          statusFilter === filter.value
                            ? 'text-[var(--color-gold)] bg-[var(--color-gold)]/5'
                            : 'text-[var(--color-text)]'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                No applications found
              </h3>
              <p className="text-[var(--color-text-muted)] mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first application'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button onClick={() => setActiveModule('new-application')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Application
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => (
            <Card key={app.id} hover className="cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-[var(--color-text)]">
                        {app.reference_number}
                      </span>
                      <Badge variant="gold" size="sm">
                        {app.licence_type}
                      </Badge>
                      <Badge
                        variant={getStatusBadgeVariant(app.status) as 'default' | 'gold' | 'success' | 'warning' | 'danger' | 'info'}
                        size="sm"
                      >
                        {getStatusIcon(app.status)}
                        <span className="ml-1">{formatStatus(app.status)}</span>
                      </Badge>
                    </div>
                    <p className="text-[var(--color-text-muted)]">{app.organisation_name}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-[var(--color-text-muted)]">
                      <span>Created {formatDate(app.created_at)}</span>
                      <span>Updated {formatDate(app.updated_at)}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="w-full md:w-48">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[var(--color-text-muted)]">Progress</span>
                      <span className="text-xs font-semibold text-[var(--color-gold)]">
                        {app.progress_percentage}%
                      </span>
                    </div>
                    <Progress value={app.progress_percentage} size="sm" />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveModule('intake')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {selectedApp === app.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg z-10">
                          <button className="w-full px-4 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[var(--color-surface-hover)] flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Next Action */}
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[var(--color-text-muted)]">Next action:</span>
                    <span className="text-[var(--color-gold)]">{app.next_action}</span>
                    <ArrowRight className="w-4 h-4 text-[var(--color-gold)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-text)]">{mockApplications.length}</p>
            <p className="text-sm text-[var(--color-text-muted)]">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">
              {mockApplications.filter(a => a.status === 'intake_in_progress' || a.status === 'draft').length}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {mockApplications.filter(a => a.status === 'submitted_to_fca').length}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {mockApplications.filter(a => a.status === 'approved').length}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">Approved</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
