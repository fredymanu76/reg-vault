'use client';

import { useState } from 'react';
import { useNewApplicationStore, useUIStore } from '@/lib/store';
import { Button, Input, Select, Card, CardContent, CardHeader } from '@/components/common';
import { LicenceType } from '@/types/database';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Shield,
  CreditCard,
  Landmark,
  Globe,
  Wallet,
} from 'lucide-react';

const WIZARD_STEPS = [
  { id: 1, title: 'Organisation', description: 'Basic company information' },
  { id: 2, title: 'Business Model', description: 'Services and activities' },
  { id: 3, title: 'Licence Type', description: 'Recommended licence category' },
  { id: 4, title: 'Key Personnel', description: 'Directors and controllers' },
  { id: 5, title: 'Review', description: 'Confirm and create' },
];

const LICENCE_OPTIONS: { value: LicenceType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'SPI', label: 'Small Payment Institution', description: 'For payment services under €3M monthly volume', icon: CreditCard },
  { value: 'SMALL_EMI', label: 'Small E-Money Institution', description: 'For e-money issuance under €5M outstanding', icon: Wallet },
  { value: 'API', label: 'Authorised Payment Institution', description: 'Full payment services authorisation', icon: Landmark },
  { value: 'EMI', label: 'E-Money Institution', description: 'Full e-money issuance authorisation', icon: Globe },
  { value: 'AISP', label: 'Account Information Service', description: 'Read-only access to payment accounts', icon: FileText },
  { value: 'PISP', label: 'Payment Initiation Service', description: 'Initiate payments from customer accounts', icon: ArrowRight },
  { value: 'RAISP', label: 'Registered AISP', description: 'Registered account information service', icon: Shield },
];

export default function NewApplicationWizard() {
  const { setActiveModule } = useUIStore();
  const {
    currentStep,
    organisationName,
    companyNumber,
    selectedLicenceType,
    businessActivities,
    keyPersonnel,
    setCurrentStep,
    setOrganisationName,
    setCompanyNumber,
    setSelectedLicenceType,
    addBusinessActivity,
    removeBusinessActivity,
    addKeyPerson,
    removeKeyPerson,
    reset,
  } = useNewApplicationStore();

  const [newActivity, setNewActivity] = useState('');
  const [newPerson, setNewPerson] = useState({ name: '', role: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!organisationName.trim()) newErrors.organisationName = 'Organisation name is required';
        if (!companyNumber.trim()) newErrors.companyNumber = 'Company number is required';
        break;
      case 2:
        if (businessActivities.length === 0) newErrors.activities = 'At least one business activity is required';
        break;
      case 3:
        if (!selectedLicenceType) newErrors.licenceType = 'Please select a licence type';
        break;
      case 4:
        if (keyPersonnel.length === 0) newErrors.personnel = 'At least one key person is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      addBusinessActivity(newActivity.trim());
      setNewActivity('');
    }
  };

  const handleAddPerson = () => {
    if (newPerson.name.trim() && newPerson.role.trim()) {
      addKeyPerson(newPerson);
      setNewPerson({ name: '', role: '', email: '' });
    }
  };

  const handleSubmit = () => {
    // In production, this would create the application via API
    console.log('Creating application:', {
      organisationName,
      companyNumber,
      selectedLicenceType,
      businessActivities,
      keyPersonnel,
    });

    // Reset wizard and go to applications
    reset();
    setActiveModule('applications');
  };

  const handleCancel = () => {
    reset();
    setActiveModule('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {WIZARD_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep > step.id
                      ? 'bg-[var(--color-gold)] text-black'
                      : currentStep === step.id
                      ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)] border-2 border-[var(--color-gold)]'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] hidden md:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-border)]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {/* Step 1: Organisation */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[var(--color-gold)]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-text)]">Organisation Details</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">Enter your company information</p>
                </div>
              </div>

              <Input
                label="Organisation Name"
                placeholder="e.g., PayFlow Technologies Ltd"
                value={organisationName}
                onChange={(e) => setOrganisationName(e.target.value)}
                error={errors.organisationName}
                required
              />

              <Input
                label="Company Registration Number"
                placeholder="e.g., 12345678"
                value={companyNumber}
                onChange={(e) => setCompanyNumber(e.target.value)}
                error={errors.companyNumber}
                helperText="UK Companies House registration number"
                required
              />

              <Input
                label="Registered Address"
                placeholder="e.g., 123 Business Street, London, EC1A 1BB"
              />

              <Input
                label="Website"
                placeholder="e.g., https://www.example.com"
                type="url"
              />
            </div>
          )}

          {/* Step 2: Business Model */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[var(--color-gold)]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-text)]">Business Activities</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">Describe your payment services</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  What payment services will you provide?
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Card payment processing"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
                    className="flex-1"
                  />
                  <Button onClick={handleAddActivity} variant="secondary">
                    Add
                  </Button>
                </div>
                {errors.activities && (
                  <p className="text-sm text-red-400 mt-1">{errors.activities}</p>
                )}
              </div>

              {businessActivities.length > 0 && (
                <div className="space-y-2">
                  {businessActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]"
                    >
                      <span className="text-[var(--color-text)]">{activity}</span>
                      <button
                        onClick={() => removeBusinessActivity(index)}
                        className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-lg">
                <p className="text-sm text-[var(--color-text-muted)]">
                  <strong className="text-[var(--color-gold)]">Tip:</strong> Be specific about your payment services.
                  This helps determine the correct FCA licence category.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Licence Type */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[var(--color-gold)]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-text)]">Licence Category</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">Select the appropriate FCA licence type</p>
                </div>
              </div>

              {errors.licenceType && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.licenceType}
                </div>
              )}

              <div className="grid gap-4">
                {LICENCE_OPTIONS.map((licence) => {
                  const Icon = licence.icon;
                  return (
                    <button
                      key={licence.value}
                      onClick={() => setSelectedLicenceType(licence.value)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedLicenceType === licence.value
                          ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-gold)]/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedLicenceType === licence.value
                            ? 'bg-[var(--color-gold)]/20'
                            : 'bg-[var(--color-surface-hover)]'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            selectedLicenceType === licence.value
                              ? 'text-[var(--color-gold)]'
                              : 'text-[var(--color-text-muted)]'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              selectedLicenceType === licence.value
                                ? 'text-[var(--color-gold)]'
                                : 'text-[var(--color-text)]'
                            }`}>
                              {licence.label}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
                              {licence.value}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--color-text-muted)] mt-1">
                            {licence.description}
                          </p>
                        </div>
                        {selectedLicenceType === licence.value && (
                          <CheckCircle className="w-5 h-5 text-[var(--color-gold)]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Key Personnel */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[var(--color-gold)]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-text)]">Key Personnel</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">Directors, controllers, and key function holders</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label="Full Name"
                  placeholder="John Smith"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                />
                <Input
                  label="Role"
                  placeholder="e.g., Director, MLRO"
                  value={newPerson.role}
                  onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
                />
                <Input
                  label="Email"
                  placeholder="john@example.com"
                  type="email"
                  value={newPerson.email}
                  onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                />
              </div>
              <Button onClick={handleAddPerson} variant="secondary">
                Add Person
              </Button>

              {errors.personnel && (
                <p className="text-sm text-red-400">{errors.personnel}</p>
              )}

              {keyPersonnel.length > 0 && (
                <div className="space-y-2">
                  {keyPersonnel.map((person, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]"
                    >
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{person.name}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {person.role} {person.email && `• ${person.email}`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeKeyPerson(index)}
                        className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[var(--color-gold)]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-text)]">Review Application</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">Confirm your details before creating</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                  <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Organisation</h3>
                  <p className="font-semibold text-[var(--color-text)]">{organisationName}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Company #{companyNumber}</p>
                </div>

                <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                  <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Licence Type</h3>
                  <p className="font-semibold text-[var(--color-gold)]">
                    {LICENCE_OPTIONS.find(l => l.value === selectedLicenceType)?.label}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {LICENCE_OPTIONS.find(l => l.value === selectedLicenceType)?.description}
                  </p>
                </div>

                <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                  <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Business Activities</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {businessActivities.map((activity, index) => (
                      <li key={index} className="text-[var(--color-text)]">{activity}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                  <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Key Personnel ({keyPersonnel.length})</h3>
                  <div className="space-y-2">
                    {keyPersonnel.map((person, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-[var(--color-text)]">{person.name}</span>
                        <span className="text-[var(--color-text-muted)]">{person.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-lg">
                <p className="text-sm text-[var(--color-text-muted)]">
                  <strong className="text-[var(--color-gold)]">Next steps:</strong> After creating, you'll complete the
                  detailed client intake questionnaire and generate your FCA submission documents.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
            <Button
              variant="ghost"
              onClick={currentStep === 1 ? handleCancel : handleBack}
              leftIcon={currentStep === 1 ? undefined : <ArrowLeft className="w-4 h-4" />}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>

            {currentStep < WIZARD_STEPS.length ? (
              <Button
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Create Application
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
