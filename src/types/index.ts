export type OrbState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR' | 'SUCCESS';

export type IndianLanguage =
  | 'AUTO DETECT'
  | 'HINDI'
  | 'BHOJPURI'
  | 'HINGLISH'
  | 'ENGLISH'
  | 'BENGALI'
  | 'MARATHI'
  | 'TELUGU'
  | 'TAMIL'
  | 'GUJARATI'
  | 'KANNADA'
  | 'MALAYALAM'
  | 'PUNJABI'
  | 'ODIA'
  | 'ASSAMESE'
  | 'URDU';

export type AgentGender = 'Male' | 'Female';
export type SpeakingSpeed = 'Slow' | 'Normal' | 'Fast';
export type VoiceStyle = 'Masculine' | 'Feminine' | 'Neutral';
export type AddressingPreference = 'Formal' | 'Friendly' | 'Neutral';

export interface VoicePreferences {
  gender: AgentGender;
  speed: SpeakingSpeed;
  speedMultiplier: number;
  language: IndianLanguage;
  accent: 'Indian';
}

export interface AppInfo {
  displayName: string;
  packageName: string;
  activityName?: string;
  iconName?: string;
  aliases: string[];
  normalizedName: string;
  category?: 'Social' | 'Communication' | 'Productivity' | 'Media' | 'Shopping' | 'Banking' | 'System' | 'Tools';
  deepLinkUri?: string;
  androidIntentUrl?: string;
  isInstalled: boolean;
}

export type CapabilityStatus = 'Available' | 'Permission Required' | 'Unsupported';

export interface DeviceCapability {
  id: string;
  name: string;
  status: CapabilityStatus;
  requiredPermission?: string;
  description: string;
  icon: string;
}

export interface CommandContext {
  currentApp: string | null;
  lastCommand: string | null;
  lastDestination: string | null;
  lastRecipient: string | null;
  history: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  voiceText?: string;
  timestamp: number;
  toolCalls?: ToolCall[];
  planSteps?: string[];
  status?: 'pending' | 'executing' | 'verified' | 'failed';
  language?: string;
}

export interface ToolCall {
  id: string;
  toolName: string;
  parameters: Record<string, any>;
  requiresConfirmation?: boolean;
  confirmationPrompt?: string;
  status?: 'pending' | 'confirmed' | 'rejected' | 'executing' | 'success' | 'failed';
  result?: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
  requiredPermissions: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'System' | 'Communication' | 'Utility' | 'Navigation' | 'Media' | 'Hardware';
  iconName: string;
}

export interface TaskPlanStep {
  stepNumber: number;
  description: string;
  toolName: string;
  parameters: Record<string, any>;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  output?: any;
}

export interface MemoryItem {
  id: string;
  type: 'USER_PREFERENCE' | 'ROUTINE' | 'COMMAND_PATTERN' | 'CONVERSATION_CONTEXT' | 'USER_SETTING';
  key: string;
  value: string;
  timestamp: number;
}

export interface AppPermission {
  id: string;
  name: string;
  description: string;
  whyRequired: string;
  granted: boolean;
  category: 'HARDWARE' | 'SYSTEM' | 'ACCESSIBILITY' | 'DATA';
}

export interface ContactItem {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  avatarColor: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  timestamp: number;
  completed: boolean;
}

export interface AlarmItem {
  id: string;
  time: string;
  hour: number;
  minute: number;
  label: string;
  enabled: boolean;
  days: string[];
}

export interface TestCase {
  id: number;
  command: string;
  language: 'Hindi' | 'Hinglish' | 'English';
  category: string;
  expectedTool: string;
  description: string;
}
