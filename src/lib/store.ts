import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Organisation, Application, LicenceType } from '@/types/database';

// =============================================================================
// AUTH STORE
// =============================================================================

interface AuthState {
  user: User | null;
  organisation: Organisation | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setOrganisation: (org: Organisation | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      organisation: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setOrganisation: (organisation) => set({ organisation }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, organisation: null, isAuthenticated: false }),
    }),
    {
      name: 'reg-vault-auth',
      partialize: (state) => ({
        user: state.user,
        organisation: state.organisation,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

// =============================================================================
// APPLICATION STORE
// =============================================================================

interface ApplicationState {
  currentApplication: Application | null;
  applications: Application[];
  isLoading: boolean;
  setCurrentApplication: (app: Application | null) => void;
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  setLoading: (loading: boolean) => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  currentApplication: null,
  applications: [],
  isLoading: false,
  setCurrentApplication: (currentApplication) => set({ currentApplication }),
  setApplications: (applications) => set({ applications }),
  addApplication: (app) => set((state) => ({
    applications: [...state.applications, app]
  })),
  updateApplication: (id, updates) => set((state) => ({
    applications: state.applications.map((app) =>
      app.id === id ? { ...app, ...updates } : app
    ),
    currentApplication: state.currentApplication?.id === id
      ? { ...state.currentApplication, ...updates }
      : state.currentApplication,
  })),
  setLoading: (isLoading) => set({ isLoading }),
}));

// =============================================================================
// UI STORE
// =============================================================================

interface UIState {
  sidebarOpen: boolean;
  activeModule: string;
  theme: 'dark';
  notifications: Notification[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveModule: (module: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeModule: 'dashboard',
  theme: 'dark',
  notifications: [],
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActiveModule: (activeModule) => set({ activeModule }),
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      { ...notification, id: crypto.randomUUID() },
    ],
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
  clearNotifications: () => set({ notifications: [] }),
}));

// =============================================================================
// INTAKE STORE
// =============================================================================

interface IntakeState {
  currentSection: number;
  answers: Record<string, unknown>;
  completedSections: string[];
  isSubmitting: boolean;
  setCurrentSection: (section: number) => void;
  setAnswer: (questionId: string, value: unknown) => void;
  setAnswers: (answers: Record<string, unknown>) => void;
  markSectionComplete: (sectionId: string) => void;
  setSubmitting: (submitting: boolean) => void;
  resetIntake: () => void;
}

export const useIntakeStore = create<IntakeState>((set) => ({
  currentSection: 0,
  answers: {},
  completedSections: [],
  isSubmitting: false,
  setCurrentSection: (currentSection) => set({ currentSection }),
  setAnswer: (questionId, value) => set((state) => ({
    answers: { ...state.answers, [questionId]: value },
  })),
  setAnswers: (answers) => set({ answers }),
  markSectionComplete: (sectionId) => set((state) => ({
    completedSections: state.completedSections.includes(sectionId)
      ? state.completedSections
      : [...state.completedSections, sectionId],
  })),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  resetIntake: () => set({
    currentSection: 0,
    answers: {},
    completedSections: [],
    isSubmitting: false,
  }),
}));

// =============================================================================
// NEW APPLICATION WIZARD STORE
// =============================================================================

interface KeyPerson {
  name: string;
  role: string;
  email: string;
}

interface NewApplicationState {
  currentStep: number;
  organisationName: string;
  companyNumber: string;
  selectedLicenceType: LicenceType | null;
  businessActivities: string[];
  keyPersonnel: KeyPerson[];
  setCurrentStep: (step: number) => void;
  setOrganisationName: (name: string) => void;
  setCompanyNumber: (number: string) => void;
  setSelectedLicenceType: (type: LicenceType) => void;
  addBusinessActivity: (activity: string) => void;
  removeBusinessActivity: (index: number) => void;
  addKeyPerson: (person: KeyPerson) => void;
  removeKeyPerson: (index: number) => void;
  reset: () => void;
}

export const useNewApplicationStore = create<NewApplicationState>((set) => ({
  currentStep: 1,
  organisationName: '',
  companyNumber: '',
  selectedLicenceType: null,
  businessActivities: [],
  keyPersonnel: [],
  setCurrentStep: (currentStep) => set({ currentStep }),
  setOrganisationName: (organisationName) => set({ organisationName }),
  setCompanyNumber: (companyNumber) => set({ companyNumber }),
  setSelectedLicenceType: (selectedLicenceType) => set({ selectedLicenceType }),
  addBusinessActivity: (activity) => set((state) => ({
    businessActivities: [...state.businessActivities, activity],
  })),
  removeBusinessActivity: (index) => set((state) => ({
    businessActivities: state.businessActivities.filter((_, i) => i !== index),
  })),
  addKeyPerson: (person) => set((state) => ({
    keyPersonnel: [...state.keyPersonnel, person],
  })),
  removeKeyPerson: (index) => set((state) => ({
    keyPersonnel: state.keyPersonnel.filter((_, i) => i !== index),
  })),
  reset: () => set({
    currentStep: 1,
    organisationName: '',
    companyNumber: '',
    selectedLicenceType: null,
    businessActivities: [],
    keyPersonnel: [],
  }),
}));
