'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  MoreVertical,
  Search,
  Filter,
} from 'lucide-react';
import { Policy } from '@/services/policyService';
import { cn } from '@/lib/utils';

interface PolicyListProps {
  policies: Policy[];
  onView: (policy: Policy) => void;
  onEdit: (policy: Policy) => void;
  onDelete: (policy: Policy) => void;
  onApprove: (policy: Policy) => void;
  onDownload: (policy: Policy) => void;
  isLoading?: boolean;
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

export function PolicyList({
  policies,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onDownload,
  isLoading = false,
}: PolicyListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || policy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-24 rounded-xl bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search policies..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-gold-500/50 focus:outline-none transition-colors"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setStatusFilter(statusFilter ? null : 'draft')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
              statusFilter
                ? 'bg-gold-500/10 border-gold-500/30 text-gold-500'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
            )}
          >
            <Filter className="w-4 h-4" />
            {statusFilter ? `Status: ${statusFilter}` : 'Filter'}
          </button>
        </div>
      </div>

      {/* Policy Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredPolicies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No policies found</h3>
              <p className="text-gray-400">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Generate policies from templates to get started'}
              </p>
            </motion.div>
          ) : (
            filteredPolicies.map((policy, index) => {
              const status = getStatusInfo(policy.status);
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative p-4 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gold-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white group-hover:text-gold-500 transition-colors">
                          {policy.name}
                        </h4>
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
                          <span className="text-xs text-gray-500">
                            v{policy.version}
                          </span>
                          <span className="text-xs text-gray-500">
                            Updated {new Date(policy.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(policy)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(policy)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDownload(policy)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* More Menu */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === policy.id ? null : policy.id)
                          }
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuId === policy.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 top-full mt-1 w-48 py-1 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-10"
                          >
                            {policy.status === 'review_pending' && (
                              <button
                                onClick={() => {
                                  onApprove(policy);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-400 hover:bg-white/5"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => {
                                onDelete(policy);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Summary */}
      {policies.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm text-gray-400">
          <span>
            Showing {filteredPolicies.length} of {policies.length} policies
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {policies.filter(p => p.status === 'approved').length} approved
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              {policies.filter(p => p.status === 'review_pending').length} pending
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              {policies.filter(p => p.status === 'draft').length} drafts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PolicyList;
