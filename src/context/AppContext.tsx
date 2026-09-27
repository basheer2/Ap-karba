import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  ProjectStage,
  CatalogItem,
  WorkLog,
  Person,
  AttendanceRecord,
  PersonPayment,
  Client,
  Contract,
  ChangeOrder,
  Invoice,
  Receipt,
  Expense,
  Defect,
  Handover,
  ProjectFile,
  CompanySettings,
  AppSecuritySettings
} from '../types';
import { LocalRepository, getNextSequenceNumber } from '../data/storage';

export type NavigationTab =
  | 'dashboard'
  | 'daily_work'
  | 'projects'
  | 'workers'
  | 'clients'
  | 'contracts'
  | 'invoices'
  | 'finance'
  | 'defects'
  | 'handovers'
  | 'media'
  | 'reports'
  | 'android_code'
  | 'settings';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;

  // Data Collections
  projects: Project[];
  stages: ProjectStage[];
  items: CatalogItem[];
  workLogs: WorkLog[];
  persons: Person[];
  attendance: AttendanceRecord[];
  personPayments: PersonPayment[];
  clients: Client[];
  contracts: Contract[];
  changeOrders: ChangeOrder[];
  invoices: Invoice[];
  receipts: Receipt[];
  expenses: Expense[];
  defects: Defect[];
  handovers: Handover[];
  files: ProjectFile[];
  company: CompanySettings;
  security: AppSecuritySettings;

  // Actions / Mutations
  addProject: (project: Omit<Project, 'id' | 'projectNumber' | 'createdAt'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;

  addStage: (stage: Omit<ProjectStage, 'id' | 'createdAt'>) => void;
  updateStage: (stage: ProjectStage) => void;
  deleteStage: (id: string) => void;

  addWorkLog: (log: Omit<WorkLog, 'id' | 'createdAt'>) => void;
  deleteWorkLog: (id: string) => void;

  addPerson: (person: Omit<Person, 'id' | 'createdAt'>) => void;
  updatePerson: (person: Person) => void;
  deletePerson: (id: string) => void;

  recordAttendance: (record: Omit<AttendanceRecord, 'id' | 'createdAt'>) => void;
  addPersonPayment: (payment: Omit<PersonPayment, 'id' | 'voucherNumber' | 'createdAt'>) => void;

  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;

  addContract: (contract: Omit<Contract, 'id' | 'contractNumber' | 'createdAt' | 'currentValue'>) => void;
  addChangeOrder: (co: Omit<ChangeOrder, 'id' | 'orderNumber' | 'createdAt'>) => void;

  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => void;
  addReceipt: (receipt: Omit<Receipt, 'id' | 'receiptNumber' | 'createdAt'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'expenseNumber' | 'createdAt'>) => void;

  addDefect: (defect: Omit<Defect, 'id' | 'createdAt'>) => void;
  updateDefect: (defect: Defect) => void;
  deleteDefect: (id: string) => void;

  addHandover: (handover: Omit<Handover, 'id' | 'handoverNumber' | 'createdAt'>) => void;
  updateHandover: (handover: Handover) => void;

  addFile: (file: Omit<ProjectFile, 'id' | 'createdAt'>) => void;
  deleteFile: (id: string) => void;

  updateCompany: (settings: CompanySettings) => void;
  updateSecurity: (settings: AppSecuritySettings) => void;
  toggleHideFinancialAmounts: () => void;

  // Security / PIN
  isLocked: boolean;
  unlockApp: (pin: string) => boolean;
  lockApp: () => void;

  // Toast / Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Quick Action Modal
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  quickActionType: string | null;
  setQuickActionType: (type: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>(() => LocalRepository.getProjects());
  const [stages, setStages] = useState<ProjectStage[]>(() => LocalRepository.getStages());
  const [items, setItems] = useState<CatalogItem[]>(() => LocalRepository.getItems());
  const [workLogs, setWorkLogs] = useState<WorkLog[]>(() => LocalRepository.getWorkLogs());
  const [persons, setPersons] = useState<Person[]>(() => LocalRepository.getPersons());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => LocalRepository.getAttendance());
  const [personPayments, setPersonPayments] = useState<PersonPayment[]>(() => LocalRepository.getPersonPayments());
  const [clients, setClients] = useState<Client[]>(() => LocalRepository.getClients());
  const [contracts, setContracts] = useState<Contract[]>(() => LocalRepository.getContracts());
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(() => LocalRepository.getChangeOrders());
  const [invoices, setInvoices] = useState<Invoice[]>(() => LocalRepository.getInvoices());
  const [receipts, setReceipts] = useState<Receipt[]>(() => LocalRepository.getReceipts());
  const [expenses, setExpenses] = useState<Expense[]>(() => LocalRepository.getExpenses());
  const [defects, setDefects] = useState<Defect[]>(() => LocalRepository.getDefects());
  const [handovers, setHandovers] = useState<Handover[]>(() => LocalRepository.getHandovers());
  const [files, setFiles] = useState<ProjectFile[]>(() => LocalRepository.getFiles());
  const [company, setCompany] = useState<CompanySettings>(() => LocalRepository.getCompany());
  const [security, setSecurity] = useState<AppSecuritySettings>(() => LocalRepository.getSecurity());

  const [isLocked, setIsLocked] = useState<boolean>(() => security.isPinEnabled);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => { LocalRepository.saveProjects(projects); }, [projects]);
  useEffect(() => { LocalRepository.saveStages(stages); }, [stages]);
  useEffect(() => { LocalRepository.saveItems(items); }, [items]);
  useEffect(() => { LocalRepository.saveWorkLogs(workLogs); }, [workLogs]);
  useEffect(() => { LocalRepository.savePersons(persons); }, [persons]);
  useEffect(() => { LocalRepository.saveAttendance(attendance); }, [attendance]);
  useEffect(() => { LocalRepository.savePersonPayments(personPayments); }, [personPayments]);
  useEffect(() => { LocalRepository.saveClients(clients); }, [clients]);
  useEffect(() => { LocalRepository.saveContracts(contracts); }, [contracts]);
  useEffect(() => { LocalRepository.saveChangeOrders(changeOrders); }, [changeOrders]);
  useEffect(() => { LocalRepository.saveInvoices(invoices); }, [invoices]);
  useEffect(() => { LocalRepository.saveReceipts(receipts); }, [receipts]);
  useEffect(() => { LocalRepository.saveExpenses(expenses); }, [expenses]);
  useEffect(() => { LocalRepository.saveDefects(defects); }, [defects]);
  useEffect(() => { LocalRepository.saveHandovers(handovers); }, [handovers]);
  useEffect(() => { LocalRepository.saveFiles(files); }, [files]);
  useEffect(() => { LocalRepository.saveCompany(company); }, [company]);
  useEffect(() => { LocalRepository.saveSecurity(security); }, [security]);

  const unlockApp = (pin: string): boolean => {
    if (pin === security.pinCode || !security.isPinEnabled) {
      setIsLocked(false);
      showToast('تم إلغاء القفل بنجاح');
      return true;
    }
    return false;
  };

  const lockApp = () => {
    if (security.isPinEnabled) {
      setIsLocked(true);
    }
  };

  const toggleHideFinancialAmounts = () => {
    const updated = { ...security, hideFinancialAmounts: !security.hideFinancialAmounts };
    setSecurity(updated);
    showToast(updated.hideFinancialAmounts ? 'تم إخفاء المبالغ المالية (وضع الخصوصية)' : 'تم إظهار المبالغ المالية');
  };

  // CRUD Implementations
  const addProject = (data: Omit<Project, 'id' | 'projectNumber' | 'createdAt'>) => {
    const newPrj: Project = {
      ...data,
      id: `prj-${Date.now()}`,
      projectNumber: getNextSequenceNumber('PRJ'),
      createdAt: Date.now()
    };
    setProjects(prev => [newPrj, ...prev]);

    // Automatically create 3 standard electrical stages for the new project
    const defaultStages: ProjectStage[] = [
      {
        id: `stg-${Date.now()}-1`,
        projectId: newPrj.id,
        name: 'التأسيس ودفن المواسير',
        orderIndex: 1,
        description: 'تكسير وتثبيت علب الماجيك ومواسير السقف',
        progressPercent: 0,
        status: 'NOT_STARTED',
        stageValue: Math.round(newPrj.totalValue * 0.35),
        createdAt: Date.now()
      },
      {
        id: `stg-${Date.now()}-2`,
        projectId: newPrj.id,
        name: 'سحب الأسلاك وتمديد الكيابل',
        orderIndex: 2,
        description: 'سحب أسلاك الإنارة والأفياش والقوى والتأريض',
        progressPercent: 0,
        status: 'NOT_STARTED',
        stageValue: Math.round(newPrj.totalValue * 0.40),
        createdAt: Date.now()
      },
      {
        id: `stg-${Date.now()}-3`,
        projectId: newPrj.id,
        name: 'التشطيب وتركيب المفاتيح واللوحات',
        orderIndex: 3,
        description: 'تركيب القواطع، وشوش الأفياش، سبوت لايت، فحص التشغيل',
        progressPercent: 0,
        status: 'NOT_STARTED',
        stageValue: Math.round(newPrj.totalValue * 0.25),
        createdAt: Date.now()
      }
    ];
    setStages(prev => [...prev, ...defaultStages]);
    showToast(`تم إنشاء المشروع ${newPrj.name} برقم ${newPrj.projectNumber}`);
  };

  const updateProject = (project: Project) => {
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    showToast('تم تحديث بيانات المشروع');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setStages(prev => prev.filter(s => s.projectId !== id));
    showToast('تم حذف المشروع ومراحله المرتبطة');
  };

  const addStage = (stage: Omit<ProjectStage, 'id' | 'createdAt'>) => {
    const newStage: ProjectStage = {
      ...stage,
      id: `stg-${Date.now()}`,
      createdAt: Date.now()
    };
    setStages(prev => [...prev, newStage]);
    showToast(`تمت إضافة مرحلة «${newStage.name}»`);
  };

  const updateStage = (stage: ProjectStage) => {
    setStages(prev => prev.map(s => s.id === stage.id ? stage : s));
    showToast('تم تحديث المرحلة');
  };

  const deleteStage = (id: string) => {
    setStages(prev => prev.filter(s => s.id !== id));
    showToast('تم حذف المرحلة');
  };

  const addWorkLog = (log: Omit<WorkLog, 'id' | 'createdAt'>) => {
    const newLog: WorkLog = {
      ...log,
      id: `wl-${Date.now()}`,
      createdAt: Date.now()
    };
    setWorkLogs(prev => [newLog, ...prev]);
    showToast(`تم تسجيل إنجاز: ${newLog.workType} (${newLog.quantity})`);
  };

  const deleteWorkLog = (id: string) => {
    setWorkLogs(prev => prev.filter(w => w.id !== id));
    showToast('تم حذف سجل العمل');
  };

  const addPerson = (person: Omit<Person, 'id' | 'createdAt'>) => {
    const newP: Person = {
      ...person,
      id: `p-${Date.now()}`,
      createdAt: Date.now()
    };
    setPersons(prev => [...prev, newP]);
    showToast(`تمت إضافة ${newP.name} إلى فريق العمل`);
  };

  const updatePerson = (person: Person) => {
    setPersons(prev => prev.map(p => p.id === person.id ? person : p));
    showToast('تم تحديث بيانات العامل');
  };

  const deletePerson = (id: string) => {
    setPersons(prev => prev.filter(p => p.id !== id));
    showToast('تم حذف العامل من القائمة');
  };

  const recordAttendance = (record: Omit<AttendanceRecord, 'id' | 'createdAt'>) => {
    // Check if attendance already recorded today for this person
    const existingIndex = attendance.findIndex(a => a.personId === record.personId && a.date === record.date);
    if (existingIndex >= 0) {
      const updated = [...attendance];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...record
      };
      setAttendance(updated);
      showToast(`تم تعديل حضور ${record.personName || 'العامل'}`);
    } else {
      const newRec: AttendanceRecord = {
        ...record,
        id: `att-${Date.now()}`,
        createdAt: Date.now()
      };
      setAttendance(prev => [newRec, ...prev]);
      showToast(`تم تسجيل حضور ${record.personName || 'العامل'}`);
    }
  };

  const addPersonPayment = (payment: Omit<PersonPayment, 'id' | 'voucherNumber' | 'createdAt'>) => {
    const newPayment: PersonPayment = {
      ...payment,
      id: `pay-${Date.now()}`,
      voucherNumber: getNextSequenceNumber('PV'),
      createdAt: Date.now()
    };
    setPersonPayments(prev => [newPayment, ...prev]);
    showToast(`تم إصدار سند صرف ${newPayment.voucherNumber} للعامل`);
  };

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: `c-${Date.now()}`,
      createdAt: Date.now()
    };
    setClients(prev => [...prev, newClient]);
    showToast(`تمت إضافة العميل ${newClient.name}`);
  };

  const updateClient = (client: Client) => {
    setClients(prev => prev.map(c => c.id === client.id ? client : c));
    showToast('تم تحديث بيانات العميل');
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    showToast('تم حذف العميل');
  };

  const addContract = (contractData: Omit<Contract, 'id' | 'contractNumber' | 'createdAt' | 'currentValue'>) => {
    const newContract: Contract = {
      ...contractData,
      id: `ctr-${Date.now()}`,
      contractNumber: getNextSequenceNumber('CTR'),
      currentValue: contractData.initialValue,
      createdAt: Date.now()
    };
    setContracts(prev => [newContract, ...prev]);
    showToast(`تم إنشاء العقد ${newContract.contractNumber} بقيمة ${newContract.initialValue.toLocaleString()} ر.ي`);
  };

  const addChangeOrder = (coData: Omit<ChangeOrder, 'id' | 'orderNumber' | 'createdAt'>) => {
    const newCo: ChangeOrder = {
      ...coData,
      id: `co-${Date.now()}`,
      orderNumber: getNextSequenceNumber('CO'),
      createdAt: Date.now()
    };
    setChangeOrders(prev => [newCo, ...prev]);

    // If approved, update contract value immediately
    if (newCo.status === 'APPROVED') {
      setContracts(prev => prev.map(c => {
        if (c.id === newCo.contractId) {
          return {
            ...c,
            currentValue: c.currentValue + newCo.amount
          };
        }
        return c;
      }));
    }
    showToast(`تم تسجيل أمر التغيير ${newCo.orderNumber} بمبلغ ${newCo.amount.toLocaleString()} ر.ي`);
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNumber: getNextSequenceNumber('INV'),
      createdAt: Date.now()
    };
    setInvoices(prev => [newInvoice, ...prev]);
    showToast(`تم إصدار الفاتورة رقم ${newInvoice.invoiceNumber}`);
  };

  const addReceipt = (receiptData: Omit<Receipt, 'id' | 'receiptNumber' | 'createdAt'>) => {
    const newReceipt: Receipt = {
      ...receiptData,
      id: `rc-${Date.now()}`,
      receiptNumber: getNextSequenceNumber('RC'),
      createdAt: Date.now()
    };
    setReceipts(prev => [newReceipt, ...prev]);

    // Update corresponding invoice if specified
    if (newReceipt.invoiceId) {
      setInvoices(prev => prev.map(inv => {
        if (inv.id === newReceipt.invoiceId) {
          const newPaid = inv.paidAmount + newReceipt.amount;
          const newRemaining = Math.max(0, inv.totalAmount - newPaid);
          const newStatus = newRemaining === 0 ? 'PAID' : 'PARTIALLY_PAID';
          return {
            ...inv,
            paidAmount: newPaid,
            remainingAmount: newRemaining,
            status: newStatus
          };
        }
        return inv;
      }));
    }
    showToast(`تم تسجيل سند قبض ${newReceipt.receiptNumber} بمبلغ ${newReceipt.amount.toLocaleString()} ر.ي`);
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'expenseNumber' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      expenseNumber: getNextSequenceNumber('EXP'),
      createdAt: Date.now()
    };
    setExpenses(prev => [newExpense, ...prev]);
    showToast(`تم تسجيل المصروف ${newExpense.expenseNumber} بمبلغ ${newExpense.amount.toLocaleString()} ر.ي`);
  };

  const addDefect = (defectData: Omit<Defect, 'id' | 'createdAt'>) => {
    const newDefect: Defect = {
      ...defectData,
      id: `def-${Date.now()}`,
      createdAt: Date.now()
    };
    setDefects(prev => [newDefect, ...prev]);
    showToast(`تم تسجيل الملاحظة / العيب: ${newDefect.title}`);
  };

  const updateDefect = (defect: Defect) => {
    setDefects(prev => prev.map(d => d.id === defect.id ? defect : d));
    showToast('تم تحديث حالة العيب');
  };

  const deleteDefect = (id: string) => {
    setDefects(prev => prev.filter(d => d.id !== id));
    showToast('تم حذف الملاحظة');
  };

  const addHandover = (handoverData: Omit<Handover, 'id' | 'handoverNumber' | 'createdAt'>) => {
    const newHandover: Handover = {
      ...handoverData,
      id: `ho-${Date.now()}`,
      handoverNumber: getNextSequenceNumber('HO'),
      createdAt: Date.now()
    };
    setHandovers(prev => [newHandover, ...prev]);
    showToast(`تم إنشاء محضر التسليم رقم ${newHandover.handoverNumber}`);
  };

  const updateHandover = (handover: Handover) => {
    setHandovers(prev => prev.map(h => h.id === handover.id ? handover : h));
    showToast('تم تحديث محضر التسليم والتوقيعات');
  };

  const addFile = (fileData: Omit<ProjectFile, 'id' | 'createdAt'>) => {
    const newFile: ProjectFile = {
      ...fileData,
      id: `f-${Date.now()}`,
      createdAt: Date.now()
    };
    setFiles(prev => [newFile, ...prev]);
    showToast(`تمت إضافة الملف: ${newFile.name}`);
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    showToast('تم حذف الملف');
  };

  const updateCompany = (settings: CompanySettings) => {
    setCompany(settings);
    showToast('تم حفظ بيانات المنشأة');
  };

  const updateSecurity = (settings: AppSecuritySettings) => {
    setSecurity(settings);
    showToast('تم تحديث إعدادات الأمان والخصوصية');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        projects,
        stages,
        items,
        workLogs,
        persons,
        attendance,
        personPayments,
        clients,
        contracts,
        changeOrders,
        invoices,
        receipts,
        expenses,
        defects,
        handovers,
        files,
        company,
        security,
        addProject,
        updateProject,
        deleteProject,
        addStage,
        updateStage,
        deleteStage,
        addWorkLog,
        deleteWorkLog,
        addPerson,
        updatePerson,
        deletePerson,
        recordAttendance,
        addPersonPayment,
        addClient,
        updateClient,
        deleteClient,
        addContract,
        addChangeOrder,
        addInvoice,
        addReceipt,
        addExpense,
        addDefect,
        updateDefect,
        deleteDefect,
        addHandover,
        updateHandover,
        addFile,
        deleteFile,
        updateCompany,
        updateSecurity,
        toggleHideFinancialAmounts,
        isLocked,
        unlockApp,
        lockApp,
        toastMessage,
        showToast,
        isQuickActionOpen,
        setIsQuickActionOpen,
        quickActionType,
        setQuickActionType
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
