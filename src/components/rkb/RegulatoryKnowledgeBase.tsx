'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Input } from '@/components/common';
import Badge from '@/components/common/Badge';
import {
  Search,
  BookOpen,
  FileText,
  Scale,
  Shield,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Link as LinkIcon,
  Filter,
  Bookmark,
  Clock,
} from 'lucide-react';

// Mock regulatory data structure
const REGULATORY_SOURCES = [
  {
    id: 'psr2017',
    name: 'Payment Services Regulations 2017',
    abbreviation: 'PSR 2017',
    type: 'primary_legislation',
    lastUpdated: '2024-01-15',
    sections: [
      {
        id: 'psr2017-part1',
        title: 'Part 1 - General',
        regulations: [
          { id: 'reg1', number: '1', title: 'Citation and commencement', summary: 'These Regulations may be cited as the Payment Services Regulations 2017.' },
          { id: 'reg2', number: '2', title: 'Interpretation', summary: 'Defines key terms used throughout the regulations.' },
          { id: 'reg3', number: '3', title: 'Payment services', summary: 'Defines the scope of payment services covered by these regulations.' },
        ],
      },
      {
        id: 'psr2017-part2',
        title: 'Part 2 - Registration',
        regulations: [
          { id: 'reg4', number: '4', title: 'Small payment institutions', summary: 'Requirements for registration as a small payment institution.' },
          { id: 'reg5', number: '5', title: 'Conditions for registration', summary: 'Conditions that must be met for registration.' },
        ],
      },
      {
        id: 'psr2017-part3',
        title: 'Part 3 - Authorisation',
        regulations: [
          { id: 'reg6', number: '6', title: 'Authorised payment institutions', summary: 'Requirements for authorisation as a payment institution.' },
          { id: 'reg7', number: '7', title: 'Application for authorisation', summary: 'Process and requirements for authorisation applications.' },
          { id: 'reg8', number: '8', title: 'Conditions for authorisation', summary: 'Conditions that must be satisfied for authorisation.' },
        ],
      },
      {
        id: 'psr2017-part4',
        title: 'Part 4 - Capital requirements',
        regulations: [
          { id: 'reg19', number: '19', title: 'Initial capital', summary: 'Minimum initial capital requirements for authorised PIs and EMIs.' },
          { id: 'reg20', number: '20', title: 'Own funds', summary: 'Ongoing own funds requirements.' },
        ],
      },
      {
        id: 'psr2017-part5',
        title: 'Part 5 - Safeguarding',
        regulations: [
          { id: 'reg21', number: '21', title: 'Safeguarding requirements', summary: 'Requirements for safeguarding relevant funds.' },
          { id: 'reg22', number: '22', title: 'Segregation method', summary: 'Method 1: Segregation of relevant funds in a designated account.' },
          { id: 'reg23', number: '23', title: 'Insurance method', summary: 'Method 2: Coverage by an insurance policy or guarantee.' },
        ],
      },
    ],
  },
  {
    id: 'emr2011',
    name: 'Electronic Money Regulations 2011',
    abbreviation: 'EMR 2011',
    type: 'primary_legislation',
    lastUpdated: '2024-01-10',
    sections: [
      {
        id: 'emr2011-part1',
        title: 'Part 1 - General',
        regulations: [
          { id: 'emr-reg1', number: '1', title: 'Citation and commencement', summary: 'These Regulations may be cited as the Electronic Money Regulations 2011.' },
          { id: 'emr-reg2', number: '2', title: 'Interpretation', summary: 'Defines electronic money and related terms.' },
        ],
      },
      {
        id: 'emr2011-part2',
        title: 'Part 2 - Authorisation and Registration',
        regulations: [
          { id: 'emr-reg6', number: '6', title: 'Conditions for authorisation', summary: 'Conditions for EMI authorisation.' },
          { id: 'emr-reg13', number: '13', title: 'Small electronic money institutions', summary: 'Registration requirements for small EMIs.' },
        ],
      },
    ],
  },
  {
    id: 'sup',
    name: 'Supervision Manual',
    abbreviation: 'SUP',
    type: 'fca_handbook',
    lastUpdated: '2024-01-20',
    sections: [
      {
        id: 'sup-3',
        title: 'SUP 3 - Auditors',
        regulations: [
          { id: 'sup-3.10', number: '3.10', title: 'Notification requirements', summary: 'Requirements for notification to the FCA.' },
        ],
      },
      {
        id: 'sup-10a',
        title: 'SUP 10A - Senior Management Arrangements',
        regulations: [
          { id: 'sup-10a.1', number: '10A.1', title: 'Application', summary: 'Application of the senior managers regime.' },
          { id: 'sup-10a.4', number: '10A.4', title: 'Controlled functions', summary: 'Definition and requirements for controlled functions.' },
        ],
      },
    ],
  },
  {
    id: 'sysc',
    name: 'Senior Management Systems and Controls',
    abbreviation: 'SYSC',
    type: 'fca_handbook',
    lastUpdated: '2024-01-18',
    sections: [
      {
        id: 'sysc-3',
        title: 'SYSC 3 - Systems and controls',
        regulations: [
          { id: 'sysc-3.1', number: '3.1', title: 'Systems and controls', summary: 'General organisational requirements.' },
          { id: 'sysc-3.2', number: '3.2', title: 'Areas covered', summary: 'Specific areas requiring systems and controls.' },
        ],
      },
      {
        id: 'sysc-6',
        title: 'SYSC 6 - Compliance, internal audit and financial crime',
        regulations: [
          { id: 'sysc-6.1', number: '6.1', title: 'Compliance', summary: 'Compliance function requirements.' },
          { id: 'sysc-6.3', number: '6.3', title: 'Financial crime', summary: 'Systems and controls for financial crime prevention.' },
        ],
      },
      {
        id: 'sysc-8',
        title: 'SYSC 8 - Outsourcing',
        regulations: [
          { id: 'sysc-8.1', number: '8.1', title: 'General outsourcing requirements', summary: 'Requirements when outsourcing critical functions.' },
        ],
      },
    ],
  },
];

const LICENCE_APPLICABILITY = [
  { regulation: 'PSR 2017 Reg 4', licences: ['SPI'], requirement: 'Registration requirements' },
  { regulation: 'PSR 2017 Reg 6-8', licences: ['API'], requirement: 'Authorisation requirements' },
  { regulation: 'PSR 2017 Reg 19', licences: ['API', 'EMI'], requirement: 'Initial capital' },
  { regulation: 'PSR 2017 Reg 21-23', licences: ['SPI', 'API', 'SMALL_EMI', 'EMI'], requirement: 'Safeguarding' },
  { regulation: 'EMR 2011 Reg 6', licences: ['EMI'], requirement: 'EMI authorisation' },
  { regulation: 'EMR 2011 Reg 13', licences: ['SMALL_EMI'], requirement: 'Small EMI registration' },
];

export default function RegulatoryKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedLicenceFilter, setSelectedLicenceFilter] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleBookmark = (regId: string) => {
    setBookmarked(prev =>
      prev.includes(regId)
        ? prev.filter(id => id !== regId)
        : [...prev, regId]
    );
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'primary_legislation':
        return <Scale className="w-5 h-5" />;
      case 'fca_handbook':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getSourceTypeLabel = (type: string) => {
    switch (type) {
      case 'primary_legislation':
        return 'UK Legislation';
      case 'fca_handbook':
        return 'FCA Handbook';
      default:
        return 'Guidance';
    }
  };

  // Filter regulations based on search
  const filteredSources = REGULATORY_SOURCES.filter(source => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (source.name.toLowerCase().includes(query)) return true;
    if (source.abbreviation.toLowerCase().includes(query)) return true;
    return source.sections.some(section =>
      section.title.toLowerCase().includes(query) ||
      section.regulations.some(reg =>
        reg.title.toLowerCase().includes(query) ||
        reg.summary.toLowerCase().includes(query)
      )
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Regulatory Knowledge Base</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Browse FCA regulations, guidance, and requirements
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Clock className="w-4 h-4" />
          Last synced: 2024-01-20
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search regulations, guidance, or requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['SPI', 'API', 'SMALL_EMI', 'EMI', 'AISP', 'PISP'].map(licence => (
                <button
                  key={licence}
                  onClick={() => setSelectedLicenceFilter(selectedLicenceFilter === licence ? null : licence)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedLicenceFilter === licence
                      ? 'bg-[var(--color-gold)] text-black'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {licence}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Sources List */}
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader title="Regulatory Sources" />
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--color-border)]">
                {filteredSources.map(source => (
                  <button
                    key={source.id}
                    onClick={() => setSelectedSource(source.id)}
                    className={`w-full p-4 text-left transition-all hover:bg-[var(--color-surface-hover)] ${
                      selectedSource === source.id ? 'bg-[var(--color-gold)]/5 border-l-2 border-[var(--color-gold)]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedSource === source.id ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)]' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'
                      }`}>
                        {getSourceTypeIcon(source.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${selectedSource === source.id ? 'text-[var(--color-gold)]' : 'text-[var(--color-text)]'}`}>
                            {source.abbreviation}
                          </span>
                          <Badge variant="default" size="sm">
                            {getSourceTypeLabel(source.type)}
                          </Badge>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1 truncate">
                          {source.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                          {source.sections.length} sections • Updated {source.lastUpdated}
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-[var(--color-text-muted)] ${selectedSource === source.id ? 'text-[var(--color-gold)]' : ''}`} />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Source Details */}
        <div className="col-span-12 lg:col-span-8">
          {selectedSource ? (
            <Card>
              {(() => {
                const source = REGULATORY_SOURCES.find(s => s.id === selectedSource);
                if (!source) return null;

                return (
                  <>
                    <CardHeader
                      title={source.name}
                      description={`${source.abbreviation} • ${getSourceTypeLabel(source.type)}`}
                      action={
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Original
                        </Button>
                      }
                    />
                    <CardContent className="p-0">
                      <div className="divide-y divide-[var(--color-border)]">
                        {source.sections.map(section => (
                          <div key={section.id}>
                            <button
                              onClick={() => toggleSection(section.id)}
                              className="w-full p-4 flex items-center justify-between hover:bg-[var(--color-surface-hover)] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-[var(--color-text-muted)]" />
                                </div>
                                <div className="text-left">
                                  <p className="font-medium text-[var(--color-text)]">{section.title}</p>
                                  <p className="text-xs text-[var(--color-text-muted)]">
                                    {section.regulations.length} regulations
                                  </p>
                                </div>
                              </div>
                              <ChevronDown
                                className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform ${
                                  expandedSections.includes(section.id) ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {expandedSections.includes(section.id) && (
                              <div className="bg-[var(--color-surface)]/50 border-t border-[var(--color-border)]">
                                {section.regulations.map(reg => (
                                  <div
                                    key={reg.id}
                                    className="p-4 border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)]"
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                                            Reg {reg.number}
                                          </span>
                                          <span className="font-medium text-[var(--color-text)]">
                                            {reg.title}
                                          </span>
                                        </div>
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                          {reg.summary}
                                        </p>

                                        {/* Licence applicability */}
                                        {LICENCE_APPLICABILITY.filter(
                                          la => la.regulation.includes(reg.number)
                                        ).length > 0 && (
                                          <div className="flex items-center gap-2 mt-2">
                                            <LinkIcon className="w-3 h-3 text-[var(--color-text-muted)]" />
                                            <span className="text-xs text-[var(--color-text-muted)]">Applies to:</span>
                                            {LICENCE_APPLICABILITY
                                              .filter(la => la.regulation.includes(reg.number))
                                              .flatMap(la => la.licences)
                                              .filter((v, i, a) => a.indexOf(v) === i)
                                              .map(licence => (
                                                <Badge key={licence} variant="gold" size="sm">
                                                  {licence}
                                                </Badge>
                                              ))}
                                          </div>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => toggleBookmark(reg.id)}
                                        className={`p-2 rounded-lg transition-colors ${
                                          bookmarked.includes(reg.id)
                                            ? 'text-[var(--color-gold)] bg-[var(--color-gold)]/10'
                                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-gold)]'
                                        }`}
                                      >
                                        <Bookmark className={`w-4 h-4 ${bookmarked.includes(reg.id) ? 'fill-current' : ''}`} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </>
                );
              })()}
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <BookOpen className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                  Select a Regulatory Source
                </h3>
                <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
                  Choose a source from the left panel to browse its sections and regulations.
                  Use the search and filters to find specific requirements.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Licence Applicability Matrix */}
      <Card>
        <CardHeader
          title="Licence Applicability Matrix"
          description="Key regulatory requirements by licence type"
        />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left p-3 text-sm font-semibold text-[var(--color-text)]">Requirement</th>
                  <th className="text-center p-3 text-sm font-semibold text-[var(--color-text)]">SPI</th>
                  <th className="text-center p-3 text-sm font-semibold text-[var(--color-text)]">API</th>
                  <th className="text-center p-3 text-sm font-semibold text-[var(--color-text)]">Small EMI</th>
                  <th className="text-center p-3 text-sm font-semibold text-[var(--color-text)]">EMI</th>
                  <th className="text-center p-3 text-sm font-semibold text-[var(--color-text)]">AISP</th>
                  <th className="text-center p-3 text-sm font-semibold text-[var(--color-text)]">PISP</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { requirement: 'Initial Capital', spi: '-', api: '£125k', small_emi: '-', emi: '€350k', aisp: '-', pisp: '€50k' },
                  { requirement: 'Own Funds', spi: 'N/A', api: 'Method A/B/C', small_emi: 'N/A', emi: 'Method D', aisp: 'N/A', pisp: 'N/A' },
                  { requirement: 'Safeguarding', spi: '✓', api: '✓', small_emi: '✓', emi: '✓', aisp: '-', pisp: '-' },
                  { requirement: 'PI Insurance', spi: '-', api: '-', small_emi: '-', emi: '-', aisp: '✓', pisp: '✓' },
                  { requirement: 'Fit & Proper', spi: '✓', api: '✓', small_emi: '✓', emi: '✓', aisp: '✓', pisp: '✓' },
                  { requirement: 'Business Plan', spi: '✓', api: '✓', small_emi: '✓', emi: '✓', aisp: '✓', pisp: '✓' },
                  { requirement: 'AML Controls', spi: '✓', api: '✓', small_emi: '✓', emi: '✓', aisp: '✓', pisp: '✓' },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]">
                    <td className="p-3 text-sm text-[var(--color-text)]">{row.requirement}</td>
                    <td className="p-3 text-center text-sm text-[var(--color-text-muted)]">{row.spi}</td>
                    <td className="p-3 text-center text-sm text-[var(--color-text-muted)]">{row.api}</td>
                    <td className="p-3 text-center text-sm text-[var(--color-text-muted)]">{row.small_emi}</td>
                    <td className="p-3 text-center text-sm text-[var(--color-text-muted)]">{row.emi}</td>
                    <td className="p-3 text-center text-sm text-[var(--color-text-muted)]">{row.aisp}</td>
                    <td className="p-3 text-center text-sm text-[var(--color-text-muted)]">{row.pisp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
