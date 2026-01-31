'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Building2,
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Play,
  Eye,
  Download,
  MoreVertical,
  Search,
  Filter,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Input } from '@/components/common';
import { FormCockpit } from './FormCockpit';
import { fcaForms, FCAForm, LicenceType, calculateFormCompletion } from '@/data/fca-forms';
import { cn } from '@/lib/utils';

interface ApplicationForm {
  id: string;
  licenceType: LicenceType;
  companyName: string;
  status: 'not_started' | 'in_progress' | 'review' | 'submitted' | 'approved';
  progress: number;
  lastUpdated: string;
  answers: Record<string, unknown>;
}

const licenceTypeConfig = {
  SPI: {
    icon: Wallet,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    label: 'Small Payment Institution',
    description: 'For payment service providers with monthly transactions under €3 million',
  },
  SMALL_EMI: {
    icon: CreditCard,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    label: 'Small EMI',
    description: 'For e-money issuers with average outstanding e-money under €5 million',
  },
  API: {
    icon: Building2,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    label: 'Authorised Payment Institution',
    description: 'Full authorisation for payment services of any volume',
  },
  EMI: {
    icon: Banknote,
    color: 'text-gold-500',
    bg: 'bg-gold-500/10',
    border: 'border-gold-500/30',
    label: 'Authorised EMI',
    description: 'Full authorisation for e-money issuance of any volume',
  },
  CONSUMER_CREDIT: {
    icon: FileText,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    label: 'Consumer Credit',
    description: 'Authorisation for consumer credit activities',
  },
};

const statusConfig = {
  not_started: {
    label: 'Not Started',
    color: 'text-gray-400',
    bg: 'bg-gray-500/20',
    icon: Clock,
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    icon: Clock,
  },
  review: {
    label: 'Under Review',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    icon: Eye,
  },
  submitted: {
    label: 'Submitted',
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    icon: CheckCircle,
  },
  approved: {
    label: 'Approved',
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    icon: CheckCircle,
  },
};

// Mock data - in production this would come from the database
const mockApplicationForms: ApplicationForm[] = [
  {
    id: '1',
    licenceType: 'SPI',
    companyName: 'Acme Payments Ltd',
    status: 'in_progress',
    progress: 45,
    lastUpdated: '2024-01-30T14:30:00Z',
    answers: {},
  },
];

export function FCAFormsModule() {
  const [applicationForms, setApplicationForms] = useState<ApplicationForm[]>(mockApplicationForms);
  const [selectedForm, setSelectedForm] = useState<ApplicationForm | null>(null);
  const [showCockpit, setShowCockpit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFormModal, setShowNewFormModal] = useState(false);

  const handleOpenForm = (form: ApplicationForm) => {
    setSelectedForm(form);
    setShowCockpit(true);
  };

  const handleCloseForm = () => {
    setShowCockpit(false);
    setSelectedForm(null);
  };

  const handleSaveForm = async (answers: Record<string, unknown>) => {
    if (!selectedForm) return;

    // In production, this would save to the database
    const formDef = fcaForms[selectedForm.licenceType];
    const progress = calculateFormCompletion(formDef, answers);

    setApplicationForms(prev =>
      prev.map(f =>
        f.id === selectedForm.id
          ? {
              ...f,
              answers,
              progress,
              status: progress === 100 ? 'review' : 'in_progress',
              lastUpdated: new Date().toISOString(),
            }
          : f
      )
    );
  };

  const handleSubmitForm = async (answers: Record<string, unknown>) => {
    if (!selectedForm) return;

    setApplicationForms(prev =>
      prev.map(f =>
        f.id === selectedForm.id
          ? { ...f, answers, progress: 100, status: 'submitted', lastUpdated: new Date().toISOString() }
          : f
      )
    );

    setShowCockpit(false);
    setSelectedForm(null);
  };

  const handleCreateNewForm = (licenceType: LicenceType) => {
    const newForm: ApplicationForm = {
      id: Date.now().toString(),
      licenceType,
      companyName: 'New Application',
      status: 'not_started',
      progress: 0,
      lastUpdated: new Date().toISOString(),
      answers: {},
    };
    setApplicationForms(prev => [newForm, ...prev]);
    setShowNewFormModal(false);
    handleOpenForm(newForm);
  };

  // Stats
  const stats = {
    total: applicationForms.length,
    inProgress: applicationForms.filter(f => f.status === 'in_progress').length,
    submitted: applicationForms.filter(f => f.status === 'submitted' || f.status === 'approved').length,
    avgProgress: applicationForms.length > 0
      ? Math.round(applicationForms.reduce((acc, f) => acc + f.progress, 0) / applicationForms.length)
      : 0,
  };

  if (showCockpit && selectedForm) {
    const formDef = fcaForms[selectedForm.licenceType];
    return (
      <FormCockpit
        form={formDef}
        applicationId={selectedForm.id}
        initialAnswers={selectedForm.answers}
        onSave={handleSaveForm}
        onSubmit={handleSubmitForm}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">FCA Application Forms</h1>
          <p className="text-gray-400 mt-1">
            Complete and submit regulatory application forms
          </p>
        </div>
        <Button onClick={() => setShowNewFormModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Start New Application
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-400">Total Forms</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gold-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
                <p className="text-sm text-gray-400">In Progress</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-400">{stats.submitted}</p>
                <p className="text-sm text-gray-400">Submitted</p>
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
                <p className="text-2xl font-bold text-white">{stats.avgProgress}%</p>
                <p className="text-sm text-gray-400">Avg Progress</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search application forms..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </CardContent>
      </Card>

      {/* Application Forms List */}
      <div className="space-y-4">
        {applicationForms.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Application Forms</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Start a new FCA application form to begin the authorisation process.
              </p>
              <Button onClick={() => setShowNewFormModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Start New Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          applicationForms.map((form, index) => {
            const config = licenceTypeConfig[form.licenceType];
            const status = statusConfig[form.status];
            const Icon = config.icon;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:border-white/20 transition-all cursor-pointer group">
                  <CardContent className="p-6" onClick={() => handleOpenForm(form)}>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', config.bg)}>
                        <Icon className={cn('w-7 h-7', config.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-white group-hover:text-gold-500 transition-colors">
                            {config.label}
                          </h3>
                          <span className={cn('flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full', status.bg, status.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{form.companyName}</p>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{form.progress}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${form.progress}%` }}
                                transition={{ duration: 0.5 }}
                                className={cn(
                                  'h-full rounded-full',
                                  form.progress === 100 ? 'bg-green-500' : 'bg-gold-500'
                                )}
                              />
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            Updated {new Date(form.lastUpdated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenForm(form);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-black font-medium rounded-lg hover:bg-gold-400 transition-colors"
                        >
                          {form.status === 'not_started' ? (
                            <>
                              <Play className="w-4 h-4" />
                              Start
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-4 h-4" />
                              Continue
                            </>
                          )}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* New Form Modal */}
      <AnimatePresence>
        {showNewFormModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewFormModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Select Application Type</h2>
                <p className="text-gray-400 mt-1">
                  Choose the type of FCA authorisation you wish to apply for
                </p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(licenceTypeConfig) as LicenceType[]).map(type => {
                  const config = licenceTypeConfig[type];
                  const Icon = config.icon;
                  const formDef = fcaForms[type];

                  return (
                    <button
                      key={type}
                      onClick={() => handleCreateNewForm(type)}
                      className={cn(
                        'flex flex-col items-start p-4 rounded-xl border transition-all text-left',
                        'hover:border-gold-500/50 hover:bg-gold-500/5',
                        config.border,
                        config.bg
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', config.bg)}>
                          <Icon className={cn('w-5 h-5', config.color)} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{config.label}</h3>
                          <p className="text-xs text-gray-500">{formDef?.totalPages || 0} pages</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{config.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-white/10 bg-black/20">
                <button
                  onClick={() => setShowNewFormModal(false)}
                  className="w-full py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FCAFormsModule;
