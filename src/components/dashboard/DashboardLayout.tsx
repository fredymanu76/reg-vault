'use client';

import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardContent from './DashboardContent';
import { ApplicationsList, NewApplicationWizard } from '@/components/applications';
import { IntakeQuestionnaire } from '@/components/intake';
import { RegulatoryKnowledgeBase } from '@/components/rkb';
import { PoliciesModule } from '@/components/policies';
import { CorrespondenceModule } from '@/components/correspondence';
import { BundleBuilder } from '@/components/bundle';
import { DiagramsModule } from '@/components/diagrams';
import { FCAFormsModule } from '@/components/fca-forms';
// Journey Components
import { JourneyOrchestrator } from '@/components/journey';
import { LicenceAdvisor } from '@/components/licence-advisor';
import { FinancialProjectionsModule } from '@/components/financial-projections';
import { BusinessPlanGenerator } from '@/components/business-plan';
import { SmartBundleGenerator } from '@/components/smart-bundle';

export default function DashboardLayout() {
  const { sidebarOpen, activeModule } = useUIStore();

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardContent />;
      case 'journey':
        return <JourneyOrchestrator />;
      case 'licence-advisor':
        return <LicenceAdvisor onComplete={() => {}} />;
      case 'financials':
        return <FinancialProjectionsModule />;
      case 'business-plan':
        return <BusinessPlanGenerator />;
      case 'applications':
        return <ApplicationsList />;
      case 'intake':
        return <IntakeQuestionnaire />;
      case 'fca-forms':
        return <FCAFormsModule />;
      case 'policies':
        return <PoliciesModule />;
      case 'diagrams':
        return <DiagramsModule />;
      case 'bundle':
        return <SmartBundleGenerator />;
      case 'correspondence':
        return <CorrespondenceModule />;
      case 'rkb':
        return <RegulatoryKnowledgeBase />;
      case 'new-application':
        return <NewApplicationWizard />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <Header />
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          sidebarOpen ? 'pl-64' : 'pl-20'
        )}
      >
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
}
