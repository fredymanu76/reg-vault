// REG-VAULT Chat Interface
// Message display and input for AI Assistant

import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { SuggestionChips } from './SuggestionChips';
import { useJourneyStore, useAIAssistant } from '@/lib/stores/journeyStore';
import { JOURNEY_STAGES } from '@/types/journey';
import { Send, Loader2, Paperclip, Mic, StopCircle } from 'lucide-react';

export function ChatInterface() {
  const journeyStore = useJourneyStore();
  const {
    messages,
    isLoading,
    currentContext,
    suggestions,
    sendMessage,
  } = useAIAssistant();

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    sendMessage(input.trim());
    setInput('');

    // Simulate AI response
    simulateResponse(journeyStore, input.trim(), currentContext.stage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (action: string) => {
    // Handle predefined suggestions
    const suggestionResponses: Record<string, string> = {
      explain_licences: 'Can you explain the difference between the various FCA licence types?',
      compare_licences: 'Compare Payment Institution vs Electronic Money Institution',
      explain_capital: 'What are the capital requirements for each licence type?',
      help_question: 'I need help understanding this question',
      autofill_company: 'Can you auto-fill my company information from Companies House?',
      fca_requirements: 'What does the FCA require for this section?',
      autofill_forms: 'Auto-fill the forms using my intake data',
      validate_forms: 'Please validate my form answers',
      form_help: 'Help me understand what to enter in this form',
      generate_section: 'Generate content for this section',
      section_guidance: 'What should I include in this section?',
      check_alignment: 'Check if this section meets FCA requirements',
      suggest_assumptions: 'Suggest appropriate financial assumptions',
      explain_capital_methods: 'Explain the different capital calculation methods',
      validate_calculations: 'Check my financial calculations',
      generate_policy: 'Generate this policy document',
      customize_policy: 'Help me customize this policy for my business',
      map_regulations: 'Map this policy to relevant regulations',
      generate_diagram: 'Generate a diagram from my description',
      diagram_requirements: 'What diagrams does the FCA expect?',
      review_diagram: 'Review my diagram for completeness',
      check_bundle: 'Check my application bundle for completeness',
      fca_checklist: 'Show me the FCA application checklist',
      cross_reference: 'Cross-reference my documents for consistency',
      final_validation: 'Perform final validation of my application',
      next_steps: 'What happens after I submit?',
      generate_cover_letter: 'Generate a cover letter for my application',
    };

    const query = suggestionResponses[action] || action;
    sendMessage(query);
    simulateResponse(journeyStore, query, currentContext.stage);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-mist-gray text-sm">
              Start a conversation or choose a quick action above.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-pellucid-cyan/20 flex items-center justify-center">
                  <Loader2 size={16} className="text-pellucid-cyan animate-spin" />
                </div>
                <div className="bg-white/5 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pellucid-cyan animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-pellucid-cyan animate-pulse delay-100" />
                    <span className="w-2 h-2 rounded-full bg-pellucid-cyan animate-pulse delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Follow-up suggestions after messages */}
      {messages.length > 0 && suggestions.length > 0 && !isLoading && (
        <div className="px-4 py-2 border-t border-white/10">
          <SuggestionChips
            suggestions={suggestions}
            onSelect={handleSuggestionClick}
            compact
          />
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-white/10 bg-void-black">
        <div className="flex items-end gap-2">
          {/* Attachment button */}
          <button
            className="p-2 rounded-lg text-mist-gray hover:text-photon-white hover:bg-white/5 transition-colors"
            title="Attach file"
          >
            <Paperclip size={18} />
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10
                text-photon-white placeholder-mist-gray resize-none
                focus:outline-none focus:ring-2 focus:ring-pellucid-cyan/50 focus:border-pellucid-cyan"
            />
          </div>

          {/* Voice input button */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 rounded-lg transition-colors ${
              isRecording
                ? 'bg-red-500/20 text-red-400'
                : 'text-mist-gray hover:text-photon-white hover:bg-white/5'
            }`}
            title={isRecording ? 'Stop recording' : 'Voice input'}
          >
            {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
          </button>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-lg transition-colors ${
              input.trim() && !isLoading
                ? 'bg-pellucid-cyan text-void-black hover:bg-pellucid-cyan/90'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>

        <p className="text-xs text-mist-gray mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

// Simulate AI response (placeholder for actual AI integration)
function simulateResponse(
  journeyStore: ReturnType<typeof useJourneyStore>,
  query: string,
  stage: string
) {
  journeyStore.setAILoading(true);

  const stageInfo = JOURNEY_STAGES[stage as keyof typeof JOURNEY_STAGES];

  setTimeout(() => {
    // Generate contextual response based on query keywords
    let response = '';

    if (query.toLowerCase().includes('capital')) {
      response = `**Capital Requirements Overview**

The FCA requires different capital levels depending on your licence type:

| Licence | Initial Capital |
|---------|----------------|
| SPI | €0 |
| API | €125,000 |
| SEMI | €0 |
| EMI | €350,000 |
| RAISP | €0 |

**Ongoing Capital** is calculated using one of these methods:
- **Method A**: 10% of fixed overheads
- **Method B**: Sliding scale based on payment volume
- **Method C**: Sliding scale based on relevant income
- **Method D**: 2% of average outstanding e-money (EMIs only)

You must use whichever method produces the *higher* amount.`;
    } else if (query.toLowerCase().includes('difference') || query.toLowerCase().includes('compare')) {
      response = `**Licence Type Comparison**

**Payment Institution (PI)** vs **Electronic Money Institution (EMI)**:

| Feature | PI | EMI |
|---------|-----|-----|
| E-money issuance | No | Yes |
| Initial capital | €125k | €350k |
| Regulation | PSR 2017 | EMR 2011 |
| Card issuing | Limited | Full |

**Key Difference**: EMIs can issue electronic money (store customer funds as e-money), while PIs can only execute payment transactions.

Choose EMI if you want to:
- Issue prepaid cards
- Hold customer balances as e-money
- Offer digital wallets`;
    } else if (query.toLowerCase().includes('requirement') || query.toLowerCase().includes('fca')) {
      response = `For the **${stageInfo?.name || stage}** stage, the FCA requires:

1. **Completeness**: All required information must be provided
2. **Accuracy**: Information must be true and not misleading
3. **Evidence**: Claims should be supported by documentation
4. **Compliance**: Demonstrate you understand and will meet regulatory obligations

The FCA will assess your application against these criteria, and may request additional information if needed.

Would you like specific guidance on any of these requirements?`;
    } else {
      response = `I understand you're asking about: "${query}"

Based on your current stage (${stageInfo?.name || stage}), here are some relevant points:

• This section is important for demonstrating your regulatory readiness
• The FCA expects clear, accurate, and well-documented responses
• I can help you understand requirements, auto-fill information, or validate your answers

What specific aspect would you like help with?`;
    }

    journeyStore.addMessage({
      role: 'assistant',
      content: response,
    });

    journeyStore.setAILoading(false);
  }, 1000 + Math.random() * 1000);
}
