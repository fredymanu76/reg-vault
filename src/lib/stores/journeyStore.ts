// REG-VAULT Journey Store
// Central orchestration of the FCA licence application journey

import { useState, useEffect, useCallback } from 'react';
import {
  JourneyStage,
  JourneyState,
  JourneyData,
  StageProgress,
  StageStatus,
  ChatMessage,
  AIAssistantState,
  Suggestion,
  LicenceType,
  LicenceRecommendation,
  BusinessInfo,
  PaymentServicesInfo,
  PersonInfo,
  JOURNEY_STAGES,
} from '@/types/journey';

// ==========================================
// Initial State Factories
// ==========================================

function createInitialStageProgress(): Record<JourneyStage, StageProgress> {
  const stages = {} as Record<JourneyStage, StageProgress>;

  Object.values(JourneyStage).forEach((stage) => {
    const stageInfo = JOURNEY_STAGES[stage];
    stages[stage] = {
      stage,
      status: stage === JourneyStage.LICENCE_ADVISOR ? 'available' : 'locked',
      progress: 0,
      completedItems: [],
      totalItems: getTotalItemsForStage(stage),
    };
  });

  return stages;
}

function getTotalItemsForStage(stage: JourneyStage): number {
  const itemCounts: Record<JourneyStage, number> = {
    [JourneyStage.LICENCE_ADVISOR]: 20, // questions
    [JourneyStage.INTAKE]: 15, // sections
    [JourneyStage.FCA_FORMS]: 8, // forms
    [JourneyStage.BUSINESS_PLAN]: 10, // sections
    [JourneyStage.FINANCIAL_PROJECTIONS]: 6, // tabs
    [JourneyStage.POLICIES]: 9, // policies
    [JourneyStage.DIAGRAMS]: 5, // diagram types
    [JourneyStage.BUNDLE_REVIEW]: 5, // review steps
    [JourneyStage.SUBMISSION]: 3, // final steps
  };
  return itemCounts[stage] || 5;
}

function createInitialJourneyState(): JourneyState {
  return {
    id: generateId(),
    applicationName: 'New Application',
    currentStage: JourneyStage.LICENCE_ADVISOR,
    stages: createInitialStageProgress(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createInitialJourneyData(): JourneyData {
  return {
    customData: {},
  };
}

function createInitialAIState(): AIAssistantState {
  return {
    isOpen: false,
    isMinimized: false,
    messages: [],
    isLoading: false,
    currentContext: {
      stage: JourneyStage.LICENCE_ADVISOR,
    },
    suggestions: getDefaultSuggestions(JourneyStage.LICENCE_ADVISOR),
  };
}

function getDefaultSuggestions(stage: JourneyStage): Suggestion[] {
  const stageSuggestions: Record<JourneyStage, Suggestion[]> = {
    [JourneyStage.LICENCE_ADVISOR]: [
      { id: '1', type: 'quick_action', label: 'What licence do I need?', action: 'explain_licences' },
      { id: '2', type: 'guidance', label: 'Compare PI vs EMI', action: 'compare_licences' },
      { id: '3', type: 'quick_action', label: 'Capital requirements', action: 'explain_capital' },
    ],
    [JourneyStage.INTAKE]: [
      { id: '1', type: 'quick_action', label: 'Help with this question', action: 'help_question' },
      { id: '2', type: 'autofill', label: 'Auto-fill from Companies House', action: 'autofill_company' },
      { id: '3', type: 'guidance', label: 'What does FCA require?', action: 'fca_requirements' },
    ],
    [JourneyStage.FCA_FORMS]: [
      { id: '1', type: 'autofill', label: 'Auto-fill from intake', action: 'autofill_forms' },
      { id: '2', type: 'quick_action', label: 'Validate my answers', action: 'validate_forms' },
      { id: '3', type: 'guidance', label: 'Form guidance', action: 'form_help' },
    ],
    [JourneyStage.BUSINESS_PLAN]: [
      { id: '1', type: 'quick_action', label: 'Generate this section', action: 'generate_section' },
      { id: '2', type: 'guidance', label: 'What should I include?', action: 'section_guidance' },
      { id: '3', type: 'quick_action', label: 'Check regulatory alignment', action: 'check_alignment' },
    ],
    [JourneyStage.FINANCIAL_PROJECTIONS]: [
      { id: '1', type: 'quick_action', label: 'Suggest assumptions', action: 'suggest_assumptions' },
      { id: '2', type: 'guidance', label: 'Explain capital methods', action: 'explain_capital_methods' },
      { id: '3', type: 'quick_action', label: 'Check calculations', action: 'validate_calculations' },
    ],
    [JourneyStage.POLICIES]: [
      { id: '1', type: 'quick_action', label: 'Generate policy', action: 'generate_policy' },
      { id: '2', type: 'guidance', label: 'Customize for my business', action: 'customize_policy' },
      { id: '3', type: 'quick_action', label: 'Map to regulations', action: 'map_regulations' },
    ],
    [JourneyStage.DIAGRAMS]: [
      { id: '1', type: 'quick_action', label: 'Generate from description', action: 'generate_diagram' },
      { id: '2', type: 'guidance', label: 'What diagrams do I need?', action: 'diagram_requirements' },
      { id: '3', type: 'quick_action', label: 'Review my diagram', action: 'review_diagram' },
    ],
    [JourneyStage.BUNDLE_REVIEW]: [
      { id: '1', type: 'quick_action', label: 'Check completeness', action: 'check_bundle' },
      { id: '2', type: 'guidance', label: 'FCA checklist', action: 'fca_checklist' },
      { id: '3', type: 'quick_action', label: 'Cross-reference docs', action: 'cross_reference' },
    ],
    [JourneyStage.SUBMISSION]: [
      { id: '1', type: 'quick_action', label: 'Final validation', action: 'final_validation' },
      { id: '2', type: 'guidance', label: 'What happens next?', action: 'next_steps' },
      { id: '3', type: 'quick_action', label: 'Generate cover letter', action: 'generate_cover_letter' },
    ],
  };

  return stageSuggestions[stage] || [];
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==========================================
// Journey Store Class
// ==========================================

class JourneyStore {
  private journeyState: JourneyState = createInitialJourneyState();
  private journeyData: JourneyData = createInitialJourneyData();
  private aiState: AIAssistantState = createInitialAIState();
  private listeners: Set<() => void> = new Set();

  // ==========================================
  // Subscription
  // ==========================================

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // ==========================================
  // Journey State Getters
  // ==========================================

  getJourneyState(): JourneyState {
    return { ...this.journeyState };
  }

  getJourneyData(): JourneyData {
    return { ...this.journeyData };
  }

  getAIState(): AIAssistantState {
    return { ...this.aiState };
  }

  getCurrentStage(): JourneyStage {
    return this.journeyState.currentStage;
  }

  getStageProgress(stage: JourneyStage): StageProgress {
    return { ...this.journeyState.stages[stage] };
  }

  getStageStatus(stage: JourneyStage): StageStatus {
    return this.journeyState.stages[stage].status;
  }

  getOverallProgress(): number {
    const stages = Object.values(this.journeyState.stages);
    const totalProgress = stages.reduce((sum, stage) => sum + stage.progress, 0);
    return Math.round(totalProgress / stages.length);
  }

  getCompletedStages(): JourneyStage[] {
    return Object.values(JourneyStage).filter(
      (stage) => this.journeyState.stages[stage].status === 'completed'
    );
  }

  getAvailableStages(): JourneyStage[] {
    return Object.values(JourneyStage).filter(
      (stage) => this.journeyState.stages[stage].status === 'available' ||
                 this.journeyState.stages[stage].status === 'in_progress'
    );
  }

  // ==========================================
  // Journey State Mutations
  // ==========================================

  setApplicationName(name: string): void {
    this.journeyState = {
      ...this.journeyState,
      applicationName: name,
      updatedAt: new Date().toISOString(),
    };
    this.notify();
  }

  setCurrentStage(stage: JourneyStage): void {
    const stageInfo = this.journeyState.stages[stage];
    if (stageInfo.status === 'locked') {
      console.warn(`Cannot navigate to locked stage: ${stage}`);
      return;
    }

    // Mark previous stage as in_progress if it was available
    const prevStage = this.journeyState.currentStage;
    if (prevStage !== stage && this.journeyState.stages[prevStage].status === 'available') {
      this.journeyState.stages[prevStage] = {
        ...this.journeyState.stages[prevStage],
        status: 'in_progress',
        startedAt: new Date().toISOString(),
      };
    }

    // Update current stage
    if (this.journeyState.stages[stage].status === 'available') {
      this.journeyState.stages[stage] = {
        ...this.journeyState.stages[stage],
        status: 'in_progress',
        startedAt: new Date().toISOString(),
      };
    }

    this.journeyState = {
      ...this.journeyState,
      currentStage: stage,
      updatedAt: new Date().toISOString(),
    };

    // Update AI context
    this.aiState = {
      ...this.aiState,
      currentContext: { stage },
      suggestions: getDefaultSuggestions(stage),
    };

    this.notify();
  }

  updateStageProgress(
    stage: JourneyStage,
    progress: number,
    completedItems?: string[]
  ): void {
    const current = this.journeyState.stages[stage];

    this.journeyState.stages[stage] = {
      ...current,
      progress: Math.min(100, Math.max(0, progress)),
      completedItems: completedItems || current.completedItems,
      lastUpdatedAt: new Date().toISOString(),
    };

    this.journeyState = {
      ...this.journeyState,
      updatedAt: new Date().toISOString(),
    };

    this.notify();
  }

  completeStage(stage: JourneyStage): void {
    this.journeyState.stages[stage] = {
      ...this.journeyState.stages[stage],
      status: 'completed',
      progress: 100,
      completedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };

    // Unlock dependent stages
    this.unlockDependentStages(stage);

    this.journeyState = {
      ...this.journeyState,
      updatedAt: new Date().toISOString(),
    };

    this.notify();
  }

  private unlockDependentStages(completedStage: JourneyStage): void {
    Object.values(JourneyStage).forEach((stage) => {
      const stageInfo = JOURNEY_STAGES[stage];
      const currentStatus = this.journeyState.stages[stage].status;

      if (currentStatus === 'locked' && stageInfo.dependencies.includes(completedStage)) {
        // Check if all dependencies are met
        const allDependenciesMet = stageInfo.dependencies.every(
          (dep) => this.journeyState.stages[dep].status === 'completed'
        );

        if (allDependenciesMet) {
          this.journeyState.stages[stage] = {
            ...this.journeyState.stages[stage],
            status: 'available',
          };
        }
      }
    });
  }

  resetJourney(): void {
    this.journeyState = createInitialJourneyState();
    this.journeyData = createInitialJourneyData();
    this.aiState = createInitialAIState();
    this.notify();
  }

  // ==========================================
  // Journey Data Mutations
  // ==========================================

  setLicenceType(type: LicenceType): void {
    this.journeyData = {
      ...this.journeyData,
      licenceType: type,
    };
    this.notify();
  }

  setLicenceRecommendation(recommendation: LicenceRecommendation): void {
    this.journeyData = {
      ...this.journeyData,
      licenceRecommendation: recommendation,
      licenceType: recommendation.recommended,
    };
    this.notify();
  }

  setBusinessInfo(info: BusinessInfo): void {
    this.journeyData = {
      ...this.journeyData,
      businessInfo: info,
    };
    this.notify();
  }

  updateBusinessInfo(updates: Partial<BusinessInfo>): void {
    this.journeyData = {
      ...this.journeyData,
      businessInfo: {
        ...this.journeyData.businessInfo,
        ...updates,
      } as BusinessInfo,
    };
    this.notify();
  }

  setPaymentServices(services: PaymentServicesInfo): void {
    this.journeyData = {
      ...this.journeyData,
      paymentServices: services,
    };
    this.notify();
  }

  addPerson(person: PersonInfo): void {
    this.journeyData = {
      ...this.journeyData,
      persons: [...(this.journeyData.persons || []), person],
    };
    this.notify();
  }

  updatePerson(id: string, updates: Partial<PersonInfo>): void {
    this.journeyData = {
      ...this.journeyData,
      persons: this.journeyData.persons?.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    };
    this.notify();
  }

  removePerson(id: string): void {
    this.journeyData = {
      ...this.journeyData,
      persons: this.journeyData.persons?.filter((p) => p.id !== id),
    };
    this.notify();
  }

  setCustomData(key: string, value: unknown): void {
    this.journeyData = {
      ...this.journeyData,
      customData: {
        ...this.journeyData.customData,
        [key]: value,
      },
    };
    this.notify();
  }

  // ==========================================
  // AI Assistant Mutations
  // ==========================================

  toggleAIAssistant(): void {
    this.aiState = {
      ...this.aiState,
      isOpen: !this.aiState.isOpen,
      isMinimized: false,
    };
    this.notify();
  }

  openAIAssistant(): void {
    this.aiState = {
      ...this.aiState,
      isOpen: true,
      isMinimized: false,
    };
    this.notify();
  }

  closeAIAssistant(): void {
    this.aiState = {
      ...this.aiState,
      isOpen: false,
    };
    this.notify();
  }

  minimizeAIAssistant(): void {
    this.aiState = {
      ...this.aiState,
      isMinimized: true,
    };
    this.notify();
  }

  setAIContext(stage: JourneyStage, field?: string): void {
    this.aiState = {
      ...this.aiState,
      currentContext: { stage, field },
      suggestions: getDefaultSuggestions(stage),
    };
    this.notify();
  }

  addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): void {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };

    this.aiState = {
      ...this.aiState,
      messages: [...this.aiState.messages, newMessage],
    };
    this.notify();
  }

  setAILoading(loading: boolean): void {
    this.aiState = {
      ...this.aiState,
      isLoading: loading,
    };
    this.notify();
  }

  setSuggestions(suggestions: Suggestion[]): void {
    this.aiState = {
      ...this.aiState,
      suggestions,
    };
    this.notify();
  }

  clearMessages(): void {
    this.aiState = {
      ...this.aiState,
      messages: [],
    };
    this.notify();
  }

  // ==========================================
  // Persistence
  // ==========================================

  saveToLocalStorage(): void {
    try {
      localStorage.setItem(
        'regvault_journey_state',
        JSON.stringify(this.journeyState)
      );
      localStorage.setItem(
        'regvault_journey_data',
        JSON.stringify(this.journeyData)
      );
    } catch (error) {
      console.error('Failed to save journey state:', error);
    }
  }

  loadFromLocalStorage(): boolean {
    try {
      const stateJson = localStorage.getItem('regvault_journey_state');
      const dataJson = localStorage.getItem('regvault_journey_data');

      if (stateJson) {
        this.journeyState = JSON.parse(stateJson);
      }
      if (dataJson) {
        this.journeyData = JSON.parse(dataJson);
      }

      this.notify();
      return true;
    } catch (error) {
      console.error('Failed to load journey state:', error);
      return false;
    }
  }

  clearLocalStorage(): void {
    localStorage.removeItem('regvault_journey_state');
    localStorage.removeItem('regvault_journey_data');
  }

  // ==========================================
  // Export/Import
  // ==========================================

  exportJourney(): string {
    return JSON.stringify({
      state: this.journeyState,
      data: this.journeyData,
      exportedAt: new Date().toISOString(),
    });
  }

  importJourney(json: string): boolean {
    try {
      const imported = JSON.parse(json);
      if (imported.state && imported.data) {
        this.journeyState = imported.state;
        this.journeyData = imported.data;
        this.notify();
        return true;
      }
      return false;
    } catch {
      console.error('Failed to import journey');
      return false;
    }
  }
}

// ==========================================
// Singleton Instance
// ==========================================

export const journeyStore = new JourneyStore();

// ==========================================
// React Hook
// ==========================================

export function useJourneyStore() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = journeyStore.subscribe(() => forceUpdate({}));
    return () => {
      unsubscribe();
    };
  }, []);

  return journeyStore;
}

// Convenience hooks for specific parts of the store
export function useCurrentStage(): JourneyStage {
  const store = useJourneyStore();
  return store.getCurrentStage();
}

export function useJourneyData(): JourneyData {
  const store = useJourneyStore();
  return store.getJourneyData();
}

export function useAIAssistant() {
  const store = useJourneyStore();
  const state = store.getAIState();

  const toggle = useCallback(() => store.toggleAIAssistant(), [store]);
  const open = useCallback(() => store.openAIAssistant(), [store]);
  const close = useCallback(() => store.closeAIAssistant(), [store]);
  const minimize = useCallback(() => store.minimizeAIAssistant(), [store]);
  const sendMessage = useCallback(
    (content: string) => {
      store.addMessage({
        role: 'user',
        content,
        context: state.currentContext,
      });
    },
    [store, state.currentContext]
  );

  return {
    ...state,
    toggle,
    open,
    close,
    minimize,
    sendMessage,
  };
}

export function useStageProgress(stage: JourneyStage): StageProgress {
  const store = useJourneyStore();
  return store.getStageProgress(stage);
}
