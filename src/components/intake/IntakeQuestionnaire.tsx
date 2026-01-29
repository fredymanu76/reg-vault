'use client';

import { useState } from 'react';
import { useIntakeStore, useUIStore } from '@/lib/store';
import { Button, Card, CardContent, CardHeader, Input, Select } from '@/components/common';
import Progress from '@/components/common/Progress';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Save,
  Building2,
  Users,
  Shield,
  FileText,
  CreditCard,
  Scale,
  Landmark,
  BookOpen,
} from 'lucide-react';

// FCA-style questionnaire sections
const INTAKE_SECTIONS = [
  { id: 'organisation', title: 'Organisation Profile', icon: Building2, questions: 8 },
  { id: 'business_model', title: 'Business Model', icon: CreditCard, questions: 12 },
  { id: 'governance', title: 'Governance & Control', icon: Scale, questions: 10 },
  { id: 'key_personnel', title: 'Key Personnel', icon: Users, questions: 6 },
  { id: 'aml_compliance', title: 'AML & Compliance', icon: Shield, questions: 14 },
  { id: 'safeguarding', title: 'Safeguarding', icon: Landmark, questions: 8 },
  { id: 'it_security', title: 'IT & Security', icon: FileText, questions: 10 },
  { id: 'complaints', title: 'Complaints Handling', icon: BookOpen, questions: 5 },
];

// Sample questions for the Business Model section
const BUSINESS_MODEL_QUESTIONS = [
  {
    id: 'bm_1',
    question: 'What payment services will your firm provide?',
    type: 'multiselect',
    options: [
      'Money remittance',
      'Payment execution',
      'Card issuing',
      'Merchant acquiring',
      'Account information services (AISP)',
      'Payment initiation services (PISP)',
    ],
    helpText: 'Select all services that apply to your business model',
    fcaReference: 'SUP 3.10.4',
  },
  {
    id: 'bm_2',
    question: 'What is your projected average monthly payment volume in the first 12 months?',
    type: 'select',
    options: [
      'Less than £100,000',
      '£100,000 - £500,000',
      '£500,000 - £1,000,000',
      '£1,000,000 - £3,000,000',
      'More than £3,000,000',
    ],
    helpText: 'This helps determine the appropriate licence category',
    fcaReference: 'PSR 2017 Reg 4',
  },
  {
    id: 'bm_3',
    question: 'Who are your target customers?',
    type: 'multiselect',
    options: [
      'Individuals (consumers)',
      'Small businesses (SMEs)',
      'Large corporations',
      'Other payment institutions',
      'Government bodies',
    ],
    helpText: 'Select all customer segments you intend to serve',
    fcaReference: 'SUP 3.10.4',
  },
  {
    id: 'bm_4',
    question: 'What currencies will you handle?',
    type: 'multiselect',
    options: ['GBP', 'EUR', 'USD', 'Other major currencies', 'Exotic currencies'],
    helpText: 'This affects your safeguarding and risk assessment requirements',
    fcaReference: 'PSR 2017 Reg 19-24',
  },
  {
    id: 'bm_5',
    question: 'Will you use agents or distributors?',
    type: 'radio',
    options: ['Yes', 'No', 'Under consideration'],
    helpText: 'Agents must be registered with the FCA',
    fcaReference: 'PSR 2017 Reg 37-38',
  },
  {
    id: 'bm_6',
    question: 'Describe your revenue model',
    type: 'textarea',
    placeholder: 'e.g., Transaction fees, subscription model, foreign exchange margin...',
    helpText: 'Provide a clear explanation of how your firm will generate revenue',
    fcaReference: 'SUP 3.10.4',
  },
  {
    id: 'bm_7',
    question: 'What is your projected break-even timeline?',
    type: 'select',
    options: [
      'Within 6 months',
      '6-12 months',
      '12-18 months',
      '18-24 months',
      'More than 24 months',
    ],
    helpText: 'FCA expects realistic financial projections',
    fcaReference: 'SUP 3.10.4',
  },
  {
    id: 'bm_8',
    question: 'Will you outsource any critical functions?',
    type: 'radio',
    options: ['Yes', 'No'],
    conditionalFollowUp: 'bm_8_detail',
    helpText: 'Critical outsourcing requires FCA notification',
    fcaReference: 'SYSC 8',
  },
  {
    id: 'bm_8_detail',
    question: 'Which functions will be outsourced?',
    type: 'multiselect',
    options: [
      'Payment processing',
      'IT infrastructure',
      'Customer onboarding (KYC)',
      'AML monitoring',
      'Customer support',
      'Card production',
    ],
    dependsOn: { questionId: 'bm_8', answer: 'Yes' },
    helpText: 'List all functions you plan to outsource',
    fcaReference: 'SYSC 8.1',
  },
];

export default function IntakeQuestionnaire() {
  const { setActiveModule } = useUIStore();
  const [activeSection, setActiveSection] = useState('business_model');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentSectionIndex = INTAKE_SECTIONS.findIndex(s => s.id === activeSection);
  const overallProgress = Math.round((Object.keys(answers).length / 73) * 100); // Total questions estimate

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelect = (questionId: string, option: string) => {
    const current = (answers[questionId] as string[]) || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    handleAnswer(questionId, updated);
  };

  const isQuestionVisible = (question: typeof BUSINESS_MODEL_QUESTIONS[0]) => {
    if (!question.dependsOn) return true;
    const { questionId, answer } = question.dependsOn;
    return answers[questionId] === answer;
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleNextSection = () => {
    if (currentSectionIndex < INTAKE_SECTIONS.length - 1) {
      setActiveSection(INTAKE_SECTIONS[currentSectionIndex + 1].id);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setActiveSection(INTAKE_SECTIONS[currentSectionIndex - 1].id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Client Intake</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            RV-2024-001 • PayFlow Technologies Ltd
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleSave} isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Progress
          </Button>
          <Button onClick={() => setActiveModule('applications')}>
            Exit
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Overall Progress</span>
            <span className="text-sm font-semibold text-[var(--color-gold)]">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Section Navigation */}
        <div className="col-span-12 lg:col-span-3">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4 uppercase tracking-wider">
                Sections
              </h3>
              <nav className="space-y-1">
                {INTAKE_SECTIONS.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  const isCompleted = index < currentSectionIndex;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30'
                          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive
                          ? 'bg-[var(--color-gold)]/20'
                          : isCompleted
                          ? 'bg-emerald-500/10'
                          : 'bg-[var(--color-surface)]'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-gold)]' : ''}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? 'text-[var(--color-gold)]' : ''}`}>
                          {section.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {section.questions} questions
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Questions Panel */}
        <div className="col-span-12 lg:col-span-9">
          <Card>
            <CardHeader
              title={INTAKE_SECTIONS.find(s => s.id === activeSection)?.title || ''}
              description="Complete all required questions in this section"
            />
            <CardContent className="p-6">
              <div className="space-y-8">
                {BUSINESS_MODEL_QUESTIONS.filter(isQuestionVisible).map((question, index) => (
                  <div key={question.id} className="relative">
                    {/* Question Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-[var(--color-text)]">{question.question}</p>
                        {question.fcaReference && (
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            FCA Reference: {question.fcaReference}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setShowHelp(showHelp === question.id ? null : question.id)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors"
                      >
                        <HelpCircle className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Help Text */}
                    {showHelp === question.id && question.helpText && (
                      <div className="ml-9 mb-3 p-3 bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-lg">
                        <p className="text-sm text-[var(--color-text-muted)]">{question.helpText}</p>
                      </div>
                    )}

                    {/* Answer Input */}
                    <div className="ml-9">
                      {question.type === 'select' && question.options && (
                        <Select
                          value={(answers[question.id] as string) || ''}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          options={[
                            { value: '', label: 'Select an option...' },
                            ...question.options.map(opt => ({ value: opt, label: opt })),
                          ]}
                        />
                      )}

                      {question.type === 'radio' && question.options && (
                        <div className="flex flex-wrap gap-3">
                          {question.options.map((option) => (
                            <label
                              key={option}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                                answers[question.id] === option
                                  ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]'
                                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-gold)]/50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={answers[question.id] === option}
                                onChange={(e) => handleAnswer(question.id, e.target.value)}
                                className="sr-only"
                              />
                              {answers[question.id] === option && (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              {option}
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === 'multiselect' && question.options && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option) => {
                            const selected = ((answers[question.id] as string[]) || []).includes(option);
                            return (
                              <label
                                key={option}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                  selected
                                    ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10'
                                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-gold)]/50'
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded flex items-center justify-center border ${
                                    selected
                                      ? 'bg-[var(--color-gold)] border-[var(--color-gold)]'
                                      : 'border-[var(--color-border)]'
                                  }`}
                                >
                                  {selected && <CheckCircle className="w-3 h-3 text-black" />}
                                </div>
                                <span className={selected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text)]'}>
                                  {option}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {question.type === 'textarea' && (
                        <textarea
                          value={(answers[question.id] as string) || ''}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          placeholder={question.placeholder}
                          rows={4}
                          className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] resize-none"
                        />
                      )}

                      {/* Validation indicator */}
                      {answers[question.id] && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-emerald-400">
                          <CheckCircle className="w-4 h-4" />
                          Answer saved
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
                <Button
                  variant="ghost"
                  onClick={handlePrevSection}
                  disabled={currentSectionIndex === 0}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous Section
                </Button>
                <Button
                  onClick={handleNextSection}
                  disabled={currentSectionIndex === INTAKE_SECTIONS.length - 1}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next Section
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
