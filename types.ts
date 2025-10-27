import React, { MutableRefObject } from "react";

export enum AppView {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  LISTS = 'LISTS',
  ENGAGE = 'ENGAGE',
  ANALYTICS = 'ANALYTICS',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS',
}

export type NotificationType = 'success' | 'error' | 'info';
export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface Confirmation {
  title: string;
  message: string;
  onConfirm: () => void;
}

export interface LinkedCompany {
  name: string;
  cnpj?: string;
  role?: string;
  numberOfEmployees?: string;
  productsOrServices?: string[];
}

export interface Partner {
  name: string;
  qualification: string;
  email?: string;
  phone?: string;
  linkedCompanies?: LinkedCompany[];
  linkedinProfileUrl?: string;
  headline?: string;
  deepAnalysis?: string;
  connectionPoints?: string[];
  actionPlan?: string;
}

export interface QSAItem {
    name: string;
    qualification: string;
    cpf?: string;
    share?: string;
}

export interface Director {
    name: string;
    position: string;
}

export interface QualificationAnalysis {
  score: number; // 1-100
  status: 'Hot' | 'Warm' | 'Cold';
  summary: string;
  budget: {
    analysis: string;
    hasBudget: boolean;
  };
  authority: {
    analysis: string;
    decisionMakerIdentified: boolean;
  };
  need: {
    analysis: string;
    hasNeed: boolean;
  };
  timeline: {
    analysis: string;
    isUrgent: boolean;
  };
}


export interface Prospect {
  name: string;
  tradeName?: string;
  description: string;
  website?: string;
  phone?: string;
  cnpj?: string;
  address?: string;
  mainActivity?: string;
  revenueRange?: string;
  segment?: string;
  recentNews?: string;
  swotAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  partners?: Partner[];
  qsa?: QSAItem[];
  directors?: Director[];
  corporateHistory?: string;
  numberOfEmployees?: string;
  productsOrServices?: string[];
  potentialClients?: {
    clientName: string;
    reason: string;
  }[];
  conversionProbability?: {
    score: 'Alta' | 'Média' | 'Baixa';
    justification: string;
  };
  qualificationAnalysis?: QualificationAnalysis;
}

export type Suspect = Prospect & { id: string; };
export type SavedProspect = Suspect & { savedAt: string; };


export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum TaskType {
  EMAIL = 'EMAIL',
  LINKEDIN = 'LINKEDIN',
  CALL = 'CALL',
  OTHER = 'OTHER',
}

export interface Task {
  id: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
}

export interface Cadence {
  id: string;
  name: string;
  prospectIds: string[];
  tasksByProspectId: { [prospectId: string]: Task[] };
}

export interface SheetRow {
  id: number;
  data: { [key: string]: any };
}

export enum GoalMetric {
  MEETINGS_SET = "Reuniões definidas",
  EMAILS_SENT = "Contas enviadas por e-mail",
  CALLS_CONNECTED = "Chamadas conectadas",
  PROSPECTS_ADDED = "Contatos adicionados à sequência",
}

export enum GoalTimeframe {
  DAILY = "Diário",
  WEEKLY = "Semanalmente",
  MONTHLY = "Mensal",
}

export interface Goal {
  id: string;
  name: string;
  assignee: string;
  timeframe: GoalTimeframe;
  metric: GoalMetric;
  targetValue: number;
}

export interface WorkflowTemplate {
    id: 'linear' | 'multi-branch' | 'generate-pipeline';
    name: string;
    description: string;
    icon: React.ReactNode;
}


export interface UIHook {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  notifications: Notification[];
  showNotification: (message: string, type?: NotificationType) => void;
  confirmation: Confirmation | null;
  setConfirmation: (confirmation: Confirmation | null) => void;
  handleExport: () => void;
  handleExportSheet: () => void;
  handleImportClick: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSheetFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: MutableRefObject<HTMLInputElement | null>;
  sheetFileInputRef: MutableRefObject<HTMLInputElement | null>;
  isLoadingState: boolean;
  isImporting: boolean;
  importProgress: string;
  isSessionLoaded: boolean;
  isSheetPreviewOpen: boolean;
  sheetPreviewData: SheetRow[];
  processSheetSelection: (selectedIds: number[]) => void;
  closeSheetPreview: () => void;

  // Goals
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (isOpen: boolean) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;

  // Workflows
  isTemplateModalOpen: boolean;
  isPersonalizationModalOpen: boolean;
  selectedTemplate: WorkflowTemplate | null;
  handleSelectTemplate: (template: WorkflowTemplate) => void;
  handleContinueToPersonalization: () => void;
  handleCreateWorkflow: (personalization: { painPoints: string; valueProp: string }) => void;
  closeWorkflowModals: () => void;

  // Integrations
  isGoogleConnected: boolean;
  handleGoogleConnect: () => void;
  importGoogleContacts: () => void;
  exportGoogleContacts: () => void;
}

export interface SuspectsHook {
    suspects: Suspect[];
    addSuspects: (newSuspects: Prospect[], source?: string) => void;
    removeSuspect: (suspectId: string) => void;
    setSuspects: React.Dispatch<React.SetStateAction<Suspect[]>>;
    updateProspect: (prospectId: string, updatedProspect: Prospect) => void;
}

export interface SavedProspectsHook {
  savedProspects: SavedProspect[];
  saveProspect: (suspectToSave: Suspect) => void;
  removeProspect: (prospectId: string) => void;
  investigateAndSaveLinkedCompany: (company: LinkedCompany) => Promise<void>;
  qualifyAndSaveSuspect: (suspectId: string) => Promise<void>;
  isQualifyingId: string | null;
  findMoreContacts: (prospectId: string, type: 'suspect' | 'prospect') => Promise<void>;
  isFindingContactsId: string | null;
}

export interface CadencesHook {
  cadences: Cadence[];
  setCadences: React.Dispatch<React.SetStateAction<Cadence[]>>;
}

export type CompanyNode = (SavedProspect | LinkedCompany) & { id: string; isSaved: boolean };


export interface AppContextType extends UIHook, SuspectsHook, SavedProspectsHook, CadencesHook {}