// REG-VAULT AI Assistant
// Slide-out panel from right side with contextual help

import { useEffect, useRef } from 'react';
import { ChatInterface } from './ChatInterface';
import { SuggestionChips } from './SuggestionChips';
import { useJourneyStore, useAIAssistant } from '@/lib/stores/journeyStore';
import { JOURNEY_STAGES } from '@/types/journey';
import {
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  MessageSquare,
  BookOpen,
  Lightbulb,
} from 'lucide-react';

export function AIAssistant() {
  const journeyStore = useJourneyStore();
  const {
    isOpen,
    isMinimized,
    messages,
    isLoading,
    currentContext,
    suggestions,
    toggle,
    close,
    minimize,
  } = useAIAssistant();

  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  if (!isOpen) {
    return (
      <FloatingTrigger onClick={toggle} hasUnread={messages.length > 0} />
    );
  }

  const stageInfo = JOURNEY_STAGES[currentContext.stage];

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={close}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`
          fixed right-0 top-0 bottom-0 w-full max-w-md bg-deep-space border-l border-white/10 z-50
          transform transition-transform duration-300 ease-out
          ${isMinimized ? 'translate-y-[calc(100%-60px)]' : 'translate-y-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-void-black">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pellucid-cyan/20 flex items-center justify-center">
              <Sparkles size={18} className="text-pellucid-cyan" />
            </div>
            <div>
              <h3 className="font-medium text-photon-white">AI Assistant</h3>
              <p className="text-xs text-mist-gray">
                {stageInfo.name}
                {currentContext.field && ` • ${currentContext.field}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={minimize}
              className="p-2 rounded-lg text-mist-gray hover:text-photon-white hover:bg-white/5 transition-colors"
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button
              onClick={close}
              className="p-2 rounded-lg text-mist-gray hover:text-photon-white hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Context Info */}
            <div className="px-4 py-3 bg-pellucid-cyan/5 border-b border-white/10">
              <div className="flex items-center gap-2 text-sm text-mist-gray mb-2">
                <Lightbulb size={14} className="text-pellucid-cyan" />
                How can I help?
              </div>
              <p className="text-xs text-mist-gray">
                I'm here to assist you with the {stageInfo.name} stage. Ask me anything about
                FCA requirements, best practices, or how to complete this section.
              </p>
            </div>

            {/* Suggestion Chips */}
            {suggestions.length > 0 && messages.length === 0 && (
              <div className="px-4 py-3 border-b border-white/10">
                <SuggestionChips suggestions={suggestions} />
              </div>
            )}

            {/* Quick Actions */}
            {messages.length === 0 && (
              <div className="px-4 py-4 border-b border-white/10">
                <p className="text-xs text-mist-gray mb-3 uppercase tracking-wider">
                  Quick Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <QuickActionButton
                    icon={MessageSquare}
                    label="Ask a question"
                    description="Get help with this section"
                    onClick={() => {
                      journeyStore.addMessage({
                        role: 'system',
                        content: 'User wants to ask a question. Ready to help.',
                      });
                    }}
                  />
                  <QuickActionButton
                    icon={BookOpen}
                    label="FCA Requirements"
                    description="View regulatory guidance"
                    onClick={() => {
                      journeyStore.addMessage({
                        role: 'user',
                        content: `What are the FCA requirements for the ${stageInfo.name} section?`,
                        context: currentContext,
                      });
                      // Simulate AI response
                      simulateAIResponse(journeyStore, stageInfo.name);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Chat Interface */}
            <ChatInterface />
          </>
        )}
      </div>
    </>
  );
}

// Floating trigger button
interface FloatingTriggerProps {
  onClick: () => void;
  hasUnread: boolean;
}

function FloatingTrigger({ onClick, hasUnread }: FloatingTriggerProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-pellucid-cyan text-void-black
        shadow-lg shadow-pellucid-cyan/25 hover:bg-pellucid-cyan/90 transition-all
        flex items-center justify-center z-50 group"
    >
      <Sparkles
        size={24}
        className="group-hover:scale-110 transition-transform"
      />
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-apex-amber rounded-full flex items-center justify-center">
          <span className="text-[10px] font-bold text-void-black">!</span>
        </span>
      )}
    </button>
  );
}

// Quick action button
interface QuickActionButtonProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
  onClick: () => void;
}

function QuickActionButton({
  icon: Icon,
  label,
  description,
  onClick,
}: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-1 p-3 rounded-lg bg-white/5 border border-white/10
        hover:bg-white/10 hover:border-white/20 transition-all text-left"
    >
      <Icon size={18} className="text-pellucid-cyan" />
      <span className="text-sm font-medium text-photon-white">{label}</span>
      <span className="text-xs text-mist-gray">{description}</span>
    </button>
  );
}

// Simulate AI response (placeholder for actual AI integration)
function simulateAIResponse(journeyStore: ReturnType<typeof useJourneyStore>, stageName: string) {
  journeyStore.setAILoading(true);

  setTimeout(() => {
    const responses: Record<string, string> = {
      'Licence Advisor': `For the Licence Advisor stage, the FCA requires you to clearly understand which type of authorisation your business needs. Key considerations include:

• **Payment Services**: If you only provide payment services (money remittance, payment execution), you'll need a Payment Institution licence under PSR 2017.

• **E-Money**: If you issue electronic money (prepaid cards, digital wallets), you'll need an EMI licence under EMR 2011.

• **Volume Thresholds**: Small institutions (SPI/SEMI) have volume limits but lower capital requirements.

• **Passporting**: Only authorised (not registered) institutions can passport to other EEA states.

Would you like me to explain any of these requirements in more detail?`,

      'Intake Questionnaire': `For the Intake Questionnaire, the FCA expects comprehensive information about:

• **Business Model**: Clear description of your payment services, revenue model, and target customers.

• **Ownership Structure**: Details of all beneficial owners with 10%+ ownership.

• **Key Personnel**: CVs and regulatory history of directors, compliance officers, and MLRO.

• **Operational Details**: Systems, controls, and outsourcing arrangements.

All information provided will be used to populate your FCA application forms. Accuracy is critical as the FCA will verify this information.`,

      'FCA Forms': `The FCA application forms you'll need to complete depend on your licence type:

**For Payment Institutions:**
• Form A - Application for authorisation/registration
• Form H - Individual controllers
• Form I - Application for approved persons

**Key Requirements:**
• All forms must be complete and accurate
• Supporting documents must be provided
• Fees must be paid (£500 for SPI, £5,000 for API)

I can help auto-fill forms using data from your intake questionnaire.`,

      'Financial Projections': `For Financial Projections, the FCA expects:

• **3-5 Year Forecasts**: P&L, Balance Sheet, and Cash Flow projections

• **Capital Adequacy**: Demonstrate you'll meet ongoing capital requirements using Method A, B, C, or D

• **Realistic Assumptions**: Growth rates should be justifiable and stress-tested

• **Sensitivity Analysis**: Show best, base, and worst-case scenarios

Would you like help with capital calculations or building your financial model?`,
    };

    const response = responses[stageName] || `I can help you with the ${stageName} stage. What specific questions do you have about completing this section?`;

    journeyStore.addMessage({
      role: 'assistant',
      content: response,
      citations: [
        {
          source: 'FCA Handbook',
          text: 'Payment Services Regulations 2017',
          url: 'https://www.legislation.gov.uk/uksi/2017/752',
        },
      ],
    });

    journeyStore.setAILoading(false);
  }, 1500);
}
