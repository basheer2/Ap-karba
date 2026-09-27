/**
 * أنواع وبيانات نظام كهرباني لإدارة المقاول الكهربائي
 * مطابق 1:1 لمخطط Room Entities و Domain Models
 */

export type ProjectStatus = 'NEW' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type ContractType = 'UNIT_ITEMS' | 'LUMP_SUM';
export type StageStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
export type PersonRole = 'OWNER' | 'MASTER_TECHNICIAN' | 'WORKER';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE' | 'EMERGENCY' | 'HALF_DAY' | 'CUSTOM_RATIO';
export type PaymentType = 'ADVANCE' | 'WEEKLY_PAYMENT' | 'FINAL_PAYMENT' | 'CUSTOM';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
export type ContractStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
export type ChangeOrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type DefectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DefectStatus = 'OPEN' | 'IN_PROGRESS' | 'FIXED' | 'CLOSED';
export type HandoverType = 'PRELIMINARY' | 'FINAL' | 'CUSTOM';
export type HandoverStatus = 'DRAFT' | 'ACCEPTED' | 'REJECTED' | 'ACCEPTED_WITH_REMARKS';
export type MediaType = 'PHOTO' | 'VIDEO' | 'BLUEPRINT' | 'DOCUMENT';
export type MediaCategory = 'LIGHTING_PLAN' | 'POWER_PLAN' | 'ARCHITECTURAL' | 'SITE_EXECUTION' | 'DEFECT' | 'HANDOVER' | 'OTHER';

export interface Project {
  id: string;
  projectNumber: string; // e.g. PRJ-0001
  name: string;
  clientId: string;
  clientName?: string;
  phone: string;
  location: string;
  description: string;
  notes: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: ProjectStatus;
  contractType: ContractType;
  totalValue: number; // بالريال اليمني
  isArchived: boolean;
  createdAt: number;
}

export interface ProjectStage {
  id: string;
  projectId: string;
  name: string; // التأسيس، سحب الأسلاك، التشطيب...
  orderIndex: number;
  description: string;
  assignedPersonId?: string;
  assignedPersonName?: string;
  startDatePlanned?: string;
  endDatePlanned?: string;
  startDateActual?: string;
  endDateActual?: string;
  progressPercent: number; // 0 - 100
  status: StageStatus;
  stageValue: number;
  createdAt: number;
}

export interface CatalogItem {
  id: string;
  name: string;
  unit: string; // نقطة، متر، لوحة، حبة
  description: string;
  defaultPrice: number;
  isActive: boolean;
}

export interface ItemStagePrice {
  id: string;
  itemId: string;
  stageName: string; // تأسيس، سحب أسلاك، تشطيب
  price: number;
}

export interface WorkLog {
  id: string;
  projectId: string;
  projectName?: string;
  stageId?: string;
  stageName?: string;
  personId?: string;
  personName?: string;
  itemId?: string;
  itemName?: string;
  date: string; // YYYY-MM-DD
  workType: string;
  quantity: number;
  unitPrice: number;
  total: number; // quantity * unitPrice
  durationMinutes: number;
  notes: string;
  createdAt: number;
}

export interface Person {
  id: string;
  name: string;
  phone: string;
  role: PersonRole;
  dailyWage: number; // الأجر اليومي بالريال
  notes: string;
  isActive: boolean;
  createdAt: number;
}

export interface AttendanceRecord {
  id: string;
  personId: string;
  personName?: string;
  projectId?: string;
  projectName?: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  ratio: number; // 1.0 (حاضر), 0.5 (نصف يوم), 0.0 (غائب)
  earnedWage: number; // dailyWage * ratio
  notes: string;
  createdAt: number;
}

export interface PersonPayment {
  id: string;
  voucherNumber: string; // PV-0001
  personId: string;
  personName?: string;
  projectId?: string;
  projectName?: string;
  date: string; // YYYY-MM-DD
  amount: number;
  type: PaymentType;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: number;
}

export interface Contract {
  id: string;
  contractNumber: string; // CTR-0001
  clientId: string;
  clientName?: string;
  projectId: string;
  projectName?: string;
  contractDate: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  initialValue: number;
  currentValue: number; // بعد احتساب أوامر التغيير المعتمدة
  downPayment: number;
  paymentTerms: string;
  scopeOfWork: string;
  excludedWork: string;
  agreementType: ContractType;
  status: ContractStatus;
  notes: string;
  createdAt: number;
}

export interface ChangeOrder {
  id: string;
  orderNumber: string; // CO-0001
  contractId: string;
  projectId: string;
  description: string;
  amount: number; // يمكن أن تكون موجبة أو سالبة
  date: string;
  status: ChangeOrderStatus;
  notes: string;
  createdAt: number;
}

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // INV-0001
  clientId: string;
  clientName?: string;
  projectId: string;
  projectName?: string;
  contractId?: string;
  issueDate: string;
  dueDate: string;
  lines: InvoiceLine[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  notes: string;
  createdAt: number;
}

export interface Receipt {
  id: string;
  receiptNumber: string; // RC-0001
  clientId: string;
  clientName?: string;
  projectId?: string;
  projectName?: string;
  invoiceId?: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: number;
}

export interface Expense {
  id: string;
  expenseNumber: string; // EXP-0001
  projectId?: string;
  projectName?: string;
  stageId?: string;
  stageName?: string;
  category: string; // مواد، أسلاك ومواسير، لوحات وقواطع، نقل، عدد وأدوات...
  amount: number;
  date: string;
  recipient: string;
  notes: string;
  createdAt: number;
}

export interface Defect {
  id: string;
  projectId: string;
  projectName?: string;
  stageId?: string;
  stageName?: string;
  title: string;
  description: string;
  date: string;
  priority: DefectPriority;
  assignedPersonId?: string;
  assignedPersonName?: string;
  dueDate?: string;
  status: DefectStatus;
  photoBeforeUri?: string;
  photoAfterUri?: string;
  createdAt: number;
}

export interface HandoverChecklistItem {
  id: string;
  itemTitle: string;
  isChecked: boolean;
  notes: string;
}

export interface Handover {
  id: string;
  handoverNumber: string; // HO-0001
  projectId: string;
  projectName?: string;
  date: string;
  type: HandoverType;
  recipientName: string;
  recipientRole: string;
  completedWorkSummary: string;
  pendingWorkSummary: string;
  checklists: HandoverChecklistItem[];
  status: HandoverStatus;
  contractorSignature?: string; // base64 / svg data uri
  clientSignature?: string;
  notes: string;
  createdAt: number;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  projectName?: string;
  stageId?: string;
  name: string;
  type: MediaType;
  category: MediaCategory;
  uri: string;
  thumbnailUri?: string;
  fileSizeBytes: number;
  isFavorite: boolean;
  isBeforeExecution?: boolean;
  createdAt: number;
}

export interface CompanySettings {
  companyName: string;
  contractorName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  commercialRecord: string;
  taxNumber: string;
  currency: string; // ريال يمني
  currencySymbol: string; // ر.ي
}

export interface AppSecuritySettings {
  isPinEnabled: boolean;
  pinCode: string;
  hideFinancialAmounts: boolean; // حجب المبالغ المالية ••••••
  screenshotProtection: boolean;
}

export interface DashboardCardConfig {
  id: string;
  title: string;
  visible: boolean;
}
