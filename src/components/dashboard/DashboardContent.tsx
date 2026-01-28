'use client';

import { useApplicationStore, useAuthStore } from '@/lib/store';
import { Card, CardHeader, CardContent } from '@/components/common';
import Badge from '@/components/common/Badge';
import Progress from '@/components/common/Progress';
import { formatDate, formatLicenceType, formatStatus, getStatusColor } from '@/lib/utils';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Shield,
  ArrowRight,
  BarChart3,
  Activity,
} from 'lucide-react';

// Mock data for demo
const mockStats = {
  totalApplications: 12,
  inProgress: 5,
  submitted: 4,
  approved: 3,
  pendingReview: 2,
  fcaQueries: 1,
};

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
  },
];

const mockRecentActivity = [
  { id: 1, action: 'Policy approved', details: 'AML Policy v2 for RV-2024-001', time: '2 hours ago', icon: CheckCircle, iconColor: 'text-emerald-400' },
  { id: 2, action: 'FCA query received', details: 'Safeguarding clarification for RV-2024-004', time: '5 hours ago', icon: AlertTriangle, iconColor: 'text-amber-400' },
  { id: 3, action: 'Application submitted', details: 'RV-2024-003 submitted to FCA Connect', time: '1 day ago', icon: FileText, iconColor: 'text-blue-400' },
  { id: 4, action: 'Intake completed', details: 'RV-2024-002 ready for document generation', time: '2 days ago', icon: Users, iconColor: 'text-purple-400' },
];

export default function DashboardContent() {
  const { organisation, user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Welcome back, {user?.display_name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Here&apos;s an overview of your FCA applications
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Activity className="w-4 h-4" />
          Last updated: {formatDate(new Date())}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={mockStats.totalApplications}
          icon={FileText}
          trend="+2 this month"
          trendUp={true}
        />
        <StatCard
          title="In Progress"
          value={mockStats.inProgress}
          icon={Clock}
          iconColor="text-amber-400"
          bgColor="bg-amber-500/10"
        />
        <StatCard
          title="Pending Review"
          value={mockStats.pendingReview}
          icon={AlertTriangle}
          iconColor="text-orange-400"
          bgColor="bg-orange-500/10"
        />
        <StatCard
          title="Approved"
          value={mockStats.approved}
          icon={CheckCircle}
          iconColor="text-emerald-400"
          bgColor="bg-emerald-500/10"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent Applications"
              description="Your latest FCA licence applications"
              action={
                <button className="text-sm text-[var(--color-gold)] hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              }
            />
            <CardContent>
              <div className="space-y-4">
                {mockApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-gold)]/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--color-text)]">
                            {app.reference_number}
                          </span>
                          <Badge variant="gold" size="sm">
                            {app.licence_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                          {app.organisation_name}
                        </p>
                      </div>
                      <Badge
                        variant={
                          app.status === 'submitted_to_fca' || app.status === 'approved'
                            ? 'success'
                            : app.status === 'fca_queries'
                            ? 'warning'
                            : 'gold'
                        }
                        size="sm"
                      >
                        {formatStatus(app.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress
                        value={app.progress_percentage}
                        size="sm"
                        className="flex-1 mr-4"
                      />
                      <span className="text-xs text-[var(--color-text-muted)]">
                        Updated {formatDate(app.updated_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader
              title="Recent Activity"
              description="Latest updates across all applications"
            />
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center flex-shrink-0 ${activity.iconColor}`}
                    >
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {activity.action}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">
                        {activity.details}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          title="Start New Application"
          description="Begin a new FCA licence application"
          icon={FileText}
          action="Get Started"
        />
        <QuickActionCard
          title="View Knowledge Base"
          description="Access FCA regulations and guidance"
          icon={Shield}
          action="Browse RKB"
        />
        <QuickActionCard
          title="Analytics Dashboard"
          description="View detailed application metrics"
          icon={BarChart3}
          action="View Analytics"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  bgColor?: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-[var(--color-gold)]',
  bgColor = 'bg-[var(--color-gold)]/10',
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <Card hover>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">{title}</p>
            <p className="text-3xl font-bold text-[var(--color-text)] mt-1">{value}</p>
            {trend && (
              <p
                className={`text-xs mt-1 flex items-center gap-1 ${
                  trendUp ? 'text-emerald-400' : 'text-[var(--color-text-muted)]'
                }`}
              >
                {trendUp && <TrendingUp className="w-3 h-3" />}
                {trend}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
}

function QuickActionCard({ title, description, icon: Icon, action }: QuickActionCardProps) {
  return (
    <Card hover className="cursor-pointer group">
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center group-hover:bg-[var(--color-gold)]/20 transition-colors">
            <Icon className="w-5 h-5 text-[var(--color-gold)]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors">
              {title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{description}</p>
            <button className="text-sm text-[var(--color-gold)] mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
              {action}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
