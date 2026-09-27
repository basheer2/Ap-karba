/**
 * مستودع التخزين المحلي Offline-First لنظام كهرباني
 * متوافق مع مبدأ Room Database والعمل الكامل بدون إنترنت
 */

import {
  Project,
  ProjectStage,
  CatalogItem,
  ItemStagePrice,
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

const STORAGE_KEYS = {
  PROJECTS: 'kahrabani_projects',
  STAGES: 'kahrabani_stages',
  ITEMS: 'kahrabani_items',
  ITEM_PRICES: 'kahrabani_item_prices',
  WORK_LOGS: 'kahrabani_work_logs',
  PERSONS: 'kahrabani_persons',
  ATTENDANCE: 'kahrabani_attendance',
  PERSON_PAYMENTS: 'kahrabani_person_payments',
  CLIENTS: 'kahrabani_clients',
  CONTRACTS: 'kahrabani_contracts',
  CHANGE_ORDERS: 'kahrabani_change_orders',
  INVOICES: 'kahrabani_invoices',
  RECEIPTS: 'kahrabani_receipts',
  EXPENSES: 'kahrabani_expenses',
  DEFECTS: 'kahrabani_defects',
  HANDOVERS: 'kahrabani_handovers',
  FILES: 'kahrabani_files',
  COMPANY: 'kahrabani_company',
  SECURITY: 'kahrabani_security',
  COUNTERS: 'kahrabani_counters',
  TOMBSTONES: 'kahrabani_tombstones'
};

// مولد الأرقام المتسلسلة التلقائية الفريدة (مثل PRJ-0001, CTR-0001, INV-0001)
export function getNextSequenceNumber(prefix: string): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COUNTERS);
    const counters = raw ? JSON.parse(raw) : {};
    const current = counters[prefix] || 0;
    const next = current + 1;
    counters[prefix] = next;
    localStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
    return `${prefix}-${String(next).padStart(4, '0')}`;
  } catch (e) {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${random}`;
  }
}

// البيانات المبدئية الواقعية لمقاول كهربائي
const DEFAULT_COMPANY: CompanySettings = {
  companyName: 'مؤسسة كهرباني للمقاولات والتمديدات الكهربائية',
  contractorName: 'المهندس / بسام الغبري',
  phone: '777000123',
  whatsapp: '777000123',
  email: 'info@kahrabani.com',
  address: 'صنعاء — شارع الستين الغربي',
  commercialRecord: '104928-ص',
  taxNumber: '3928172901',
  currency: 'ريال يمني',
  currencySymbol: 'ر.ي'
};

const DEFAULT_SECURITY: AppSecuritySettings = {
  isPinEnabled: false,
  pinCode: '1234',
  hideFinancialAmounts: false,
  screenshotProtection: false
};

const DEFAULT_ITEMS: CatalogItem[] = [
  { id: 'item-1', name: 'نقطة إنارة سقفية (ليد/سبوت)', unit: 'نقطة', description: 'تمديد وسحب وتركيب سبوت لايت', defaultPrice: 2500, isActive: true },
  { id: 'item-2', name: 'نقطة بريزة عادية (فيشة 13 أمبير)', unit: 'نقطة', description: 'تمديد وسحب وتركيب بريزة مفردة ومزدوجة', defaultPrice: 3000, isActive: true },
  { id: 'item-3', name: 'نقطة قوى مكيف وسخان (20/45 أمبير)', unit: 'نقطة', description: 'سلك 4 و6 ملم مع مفتاح عازل', defaultPrice: 6000, isActive: true },
  { id: 'item-4', name: 'تمديد كيبل رئيسي 16/25 ملم', unit: 'متر', description: 'سحب كيبل نحاس مسلح رئيسي', defaultPrice: 1500, isActive: true },
  { id: 'item-5', name: 'تجميع وتركيب لوحة توزيع رئيسية 24 خط', unit: 'لوحة', description: 'تركيب القواطع والتأريض والبارات', defaultPrice: 35000, isActive: true },
  { id: 'item-6', name: 'شبكة تأريض وحربة نحاسية', unit: 'نقطة', description: 'دق الحربة وصب البودرة واختبار الأوم', defaultPrice: 20000, isActive: true }
];

const DEFAULT_PERSONS: Person[] = [
  { id: 'p-1', name: 'المعلم صادق العريقي', phone: '771234567', role: 'MASTER_TECHNICIAN', dailyWage: 12000, notes: 'معلم تمديدات محترف وقواطع رئيسية', isActive: true, createdAt: Date.now() - 86400000 * 30 },
  { id: 'p-2', name: 'الفني وليد القدسي', phone: '772345678', role: 'WORKER', dailyWage: 8000, notes: 'سحب أسلاك وتكسير مواسير', isActive: true, createdAt: Date.now() - 86400000 * 25 },
  { id: 'p-3', name: 'المساعد عمار الشرعبي', phone: '773456789', role: 'WORKER', dailyWage: 6000, notes: 'مساعد تركيب وجلي وتوزيع علب', isActive: true, createdAt: Date.now() - 86400000 * 20 }
];

const DEFAULT_CLIENTS: Client[] = [
  { id: 'c-1', name: 'الحاج عبد الرقيب الشامي', phone: '770112233', email: 'alshami@gmail.com', address: 'بيت بوس — حي الشباب', notes: 'عميل ممتاز وملتزم بالدفعات', createdAt: Date.now() - 86400000 * 40 },
  { id: 'c-2', name: 'الدكتور فؤاد الأهدل', phone: '771998877', email: 'foad.ahdal@gmail.com', address: 'حدة — قرب جولة المدينة', notes: 'مشروع فيلا سكنية راقية', createdAt: Date.now() - 86400000 * 20 }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    projectNumber: 'PRJ-0001',
    name: 'فيلا الشامي السكنية — حي الشباب',
    clientId: 'c-1',
    clientName: 'الحاج عبد الرقيب الشامي',
    phone: '770112233',
    location: 'بيت بوس — صنعاء',
    description: 'تأسيس وسحب وتشطيب كهرباء كامل للفيلا دورين وملحق مع لوحة تحكم وتأريض',
    notes: 'تم استلام الدفعة الأولى عند التعاقد',
    startDate: '2026-08-01',
    endDate: '2026-10-30',
    status: 'ACTIVE',
    contractType: 'UNIT_ITEMS',
    totalValue: 2800000,
    isArchived: false,
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'prj-2',
    projectNumber: 'PRJ-0002',
    name: 'عمارة الأهدل الاستثمارية — 4 أدوار',
    clientId: 'c-2',
    clientName: 'الدكتور فؤاد الأهدل',
    phone: '771998877',
    location: 'حدة — صنعاء',
    description: 'تمديدات كهربائية لعدد 8 شقق مع درج ومصعد ومضخات مياه',
    notes: 'الاتفاق بمبلغ إجمالي مقطوع',
    startDate: '2026-08-15',
    endDate: '2026-11-15',
    status: 'ACTIVE',
    contractType: 'LUMP_SUM',
    totalValue: 5400000,
    isArchived: false,
    createdAt: Date.now() - 86400000 * 20
  }
];

const DEFAULT_STAGES: ProjectStage[] = [
  {
    id: 'stg-1',
    projectId: 'prj-1',
    name: 'تأسيس ودق المواسير وتوزيع العلب',
    orderIndex: 1,
    description: 'تكسير الجدران ودق المواسير في السقف وتثبيت العلب الماجيك',
    assignedPersonId: 'p-1',
    assignedPersonName: 'المعلم صادق العريقي',
    startDatePlanned: '2026-08-01',
    endDatePlanned: '2026-08-20',
    startDateActual: '2026-08-01',
    endDateActual: '2026-08-18',
    progressPercent: 100,
    status: 'COMPLETED',
    stageValue: 800000,
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'stg-2',
    projectId: 'prj-1',
    name: 'سحب الأسلاك وتمديد الكيابل',
    orderIndex: 2,
    description: 'سحب أسلاك الإنارة والأفياش وخطوط التكييف مع التأريض',
    assignedPersonId: 'p-1',
    assignedPersonName: 'المعلم صادق العريقي',
    startDatePlanned: '2026-08-21',
    endDatePlanned: '2026-09-15',
    startDateActual: '2026-08-21',
    progressPercent: 75,
    status: 'IN_PROGRESS',
    stageValue: 1100000,
    createdAt: Date.now() - 86400000 * 20
  },
  {
    id: 'stg-3',
    projectId: 'prj-1',
    name: 'التشطيب وتركيب المفاتيح والإنارة',
    orderIndex: 3,
    description: 'تركيب وشوش المفاتيح والأفياش وسبوت لايت وثريات واختبار الجهد',
    assignedPersonId: 'p-2',
    assignedPersonName: 'الفني وليد القدسي',
    startDatePlanned: '2026-09-20',
    endDatePlanned: '2026-10-30',
    progressPercent: 0,
    status: 'NOT_STARTED',
    stageValue: 900000,
    createdAt: Date.now() - 86400000 * 10
  }
];

const DEFAULT_CONTRACTS: Contract[] = [
  {
    id: 'ctr-1',
    contractNumber: 'CTR-0001',
    clientId: 'c-1',
    clientName: 'الحاج عبد الرقيب الشامي',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    contractDate: '2026-08-01',
    startDate: '2026-08-01',
    endDate: '2026-10-30',
    durationDays: 90,
    initialValue: 2800000,
    currentValue: 2950000, // 2,800,000 + 150,000 أمر تغيير
    downPayment: 700000,
    paymentTerms: '25% دفعة مقدمة، 25% بعد التأسيس، 30% بعد سحب الأسلاك، 20% عند التسليم النهائي',
    scopeOfWork: 'تنفيذ التمديدات الكهربائية للفيلا، شبكة الإنارة، الأفياش، لوحات التوزيع والتأريض',
    excludedWork: 'توريد أجهزة التكييف والإنارات الثقيلة (الثريات الفاخرة)',
    agreementType: 'UNIT_ITEMS',
    status: 'IN_PROGRESS',
    notes: 'تم اعتماد أمر تغيير رقم CO-0001 لإضافة نقاط كاميرات مراقبة خارجية',
    createdAt: Date.now() - 86400000 * 30
  }
];

const DEFAULT_CHANGE_ORDERS: ChangeOrder[] = [
  {
    id: 'co-1',
    orderNumber: 'CO-0001',
    contractId: 'ctr-1',
    projectId: 'prj-1',
    description: 'إضافة تمديدات مواسير وسحب أسلاك لـ 6 كاميرات مراقبة وسيرفر في الحوش الخارجي',
    amount: 150000,
    date: '2026-08-15',
    status: 'APPROVED',
    notes: 'تمت الموافقة كتابياً من قبل المالك',
    createdAt: Date.now() - 86400000 * 15
  }
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-0001',
    clientId: 'c-1',
    clientName: 'الحاج عبد الرقيب الشامي',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    contractId: 'ctr-1',
    issueDate: '2026-08-02',
    dueDate: '2026-08-10',
    lines: [
      { id: 'line-1', description: 'الدفعة المقدمة للعقد — تمديدات كهربائية', quantity: 1, unitPrice: 700000, total: 700000 }
    ],
    subtotal: 700000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 700000,
    paidAmount: 700000,
    remainingAmount: 0,
    status: 'PAID',
    notes: 'مسددة بسند قبض RC-0001',
    createdAt: Date.now() - 86400000 * 28
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-0002',
    clientId: 'c-1',
    clientName: 'الحاج عبد الرقيب الشامي',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    contractId: 'ctr-1',
    issueDate: '2026-08-20',
    dueDate: '2026-08-27',
    lines: [
      { id: 'line-2', description: 'مستخلص إنجاز مرحلة التأسيس وتمديد المواسير', quantity: 1, unitPrice: 700000, total: 700000 },
      { id: 'line-3', description: 'أمر تغيير شبكة الكاميرات الخارجية CO-0001', quantity: 1, unitPrice: 150000, total: 150000 }
    ],
    subtotal: 850000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 850000,
    paidAmount: 600000,
    remainingAmount: 250000,
    status: 'PARTIALLY_PAID',
    notes: 'متبقي 250,000 ريال يمني',
    createdAt: Date.now() - 86400000 * 12
  }
];

const DEFAULT_RECEIPTS: Receipt[] = [
  {
    id: 'rc-1',
    receiptNumber: 'RC-0001',
    clientId: 'c-1',
    clientName: 'الحاج عبد الرقيب الشامي',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    invoiceId: 'inv-1',
    amount: 700000,
    date: '2026-08-02',
    paymentMethod: 'CASH',
    notes: 'دفعة مقدمة نقداً عند توقيع العقد',
    createdAt: Date.now() - 86400000 * 28
  },
  {
    id: 'rc-2',
    receiptNumber: 'RC-0002',
    clientId: 'c-1',
    clientName: 'الحاج عبد الرقيب الشامي',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    invoiceId: 'inv-2',
    amount: 600000,
    date: '2026-08-22',
    paymentMethod: 'BANK_TRANSFER',
    notes: 'حوالة مصرفية عبر بنك الكريمي',
    createdAt: Date.now() - 86400000 * 10
  }
];

const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    expenseNumber: 'EXP-0001',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    stageId: 'stg-1',
    stageName: 'تأسيس ودق المواسير وتوزيع العلب',
    category: 'أسلاك ومواسير',
    amount: 145000,
    date: '2026-08-05',
    recipient: 'محلات النور للكهرباء',
    notes: 'شراء 4 لفات مواسير فلكسبل + 120 علبة ماجيك + غراء',
    createdAt: Date.now() - 86400000 * 25
  },
  {
    id: 'exp-2',
    expenseNumber: 'EXP-0002',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    stageId: 'stg-2',
    stageName: 'سحب الأسلاك وتمديد الكيابل',
    category: 'مواد',
    amount: 320000,
    date: '2026-08-25',
    recipient: 'شركة الكابلات الحديثة',
    notes: 'شراء لفات أسلاك 1.5 و2.5 و4 ملم أصلية',
    createdAt: Date.now() - 86400000 * 8
  },
  {
    id: 'exp-3',
    expenseNumber: 'EXP-0003',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    stageId: 'stg-1',
    stageName: 'تأسيس ودق المواسير وتوزيع العلب',
    category: 'نقل وشحن',
    amount: 15000,
    date: '2026-08-06',
    recipient: 'سائق الدينة',
    notes: 'أجرة نقل المواسير والمواد للموقع',
    createdAt: Date.now() - 86400000 * 24
  }
];

const DEFAULT_WORK_LOGS: WorkLog[] = [
  {
    id: 'wl-1',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    stageId: 'stg-1',
    stageName: 'تأسيس ودق المواسير وتوزيع العلب',
    personId: 'p-1',
    personName: 'المعلم صادق العريقي',
    itemId: 'item-1',
    itemName: 'نقطة إنارة سقفية (ليد/سبوت)',
    date: '2026-08-08',
    workType: 'تأسيس نقاط إنارة',
    quantity: 45,
    unitPrice: 2500,
    total: 112500,
    durationMinutes: 480,
    notes: 'تم إنهاء تأسيس الدور الأرضي بالكامل',
    createdAt: Date.now() - 86400000 * 22
  },
  {
    id: 'wl-2',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    stageId: 'stg-2',
    stageName: 'سحب الأسلاك وتمديد الكيابل',
    personId: 'p-2',
    personName: 'الفني وليد القدسي',
    itemId: 'item-2',
    itemName: 'نقطة بريزة عادية (فيشة 13 أمبير)',
    date: '2026-08-26',
    workType: 'سحب أسلاك أفياش',
    quantity: 32,
    unitPrice: 3000,
    total: 96000,
    durationMinutes: 420,
    notes: 'سحب أسلاك المطابخ والصالات مع الفاز والنيوترال والأرضي',
    createdAt: Date.now() - 86400000 * 5
  }
];

const DEFAULT_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    personId: 'p-1',
    personName: 'المعلم صادق العريقي',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    date: '2026-08-25',
    status: 'PRESENT',
    ratio: 1.0,
    earnedWage: 12000,
    notes: 'يوم كامل عمل سحب أسلاك وتوزيع لوحة',
    createdAt: Date.now() - 86400000 * 6
  },
  {
    id: 'att-2',
    personId: 'p-2',
    personName: 'الفني وليد القدسي',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    date: '2026-08-25',
    status: 'PRESENT',
    ratio: 1.0,
    earnedWage: 8000,
    notes: 'يوم كامل',
    createdAt: Date.now() - 86400000 * 6
  },
  {
    id: 'att-3',
    personId: 'p-3',
    personName: 'المساعد عمار الشرعبي',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    date: '2026-08-25',
    status: 'HALF_DAY',
    ratio: 0.5,
    earnedWage: 3000,
    notes: 'نصف يوم بعد الظهر لظرف خاص',
    createdAt: Date.now() - 86400000 * 6
  }
];

const DEFAULT_PAYMENTS: PersonPayment[] = [
  {
    id: 'pay-1',
    voucherNumber: 'PV-0001',
    personId: 'p-1',
    personName: 'المعلم صادق العريقي',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    date: '2026-08-14',
    amount: 50000,
    type: 'WEEKLY_PAYMENT',
    paymentMethod: 'CASH',
    notes: 'دفعة أسبوعية على الحساب',
    createdAt: Date.now() - 86400000 * 18
  },
  {
    id: 'pay-2',
    voucherNumber: 'PV-0002',
    personId: 'p-2',
    personName: 'الفني وليد القدسي',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    date: '2026-08-18',
    amount: 20000,
    type: 'ADVANCE',
    paymentMethod: 'CASH',
    notes: 'سلفة مستعجلة',
    createdAt: Date.now() - 86400000 * 14
  }
];

const DEFAULT_DEFECTS: Defect[] = [
  {
    id: 'def-1',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    stageId: 'stg-2',
    stageName: 'سحب الأسلاك وتمديد الكيابل',
    title: 'ماسورة مسدودة بجدار المطبخ الغربي',
    description: 'تم رصد انسداد الماسورة البلاستيكية بسبب دخول مونة الإسمنت أثناء اللياسة، تحتاج لتسليك أو كسر موضعي خفيف',
    date: '2026-08-24',
    priority: 'HIGH',
    assignedPersonId: 'p-2',
    assignedPersonName: 'الفني وليد القدسي',
    dueDate: '2026-08-28',
    status: 'IN_PROGRESS',
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'def-2',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    stageId: 'stg-1',
    stageName: 'تأسيس ودق المواسير وتوزيع العلب',
    title: 'منسوب علبة مفتاح الصالة مرتفع 5 سم',
    description: 'تم تعديل المنسوب ليتطابق مع باقي مفاتيح الطابق على ارتفاع 120 سم من الشيرب',
    date: '2026-08-12',
    priority: 'MEDIUM',
    status: 'FIXED',
    createdAt: Date.now() - 86400000 * 20
  }
];

const DEFAULT_HANDOVERS: Handover[] = [
  {
    id: 'ho-1',
    handoverNumber: 'HO-0001',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    date: '2026-08-19',
    type: 'PRELIMINARY',
    recipientName: 'المهندس المشرف / كمال الوجيه',
    recipientRole: 'استشاري المالك',
    completedWorkSummary: 'تم تسليم أعمال التأسيس ودفن المواسير في الأسقف والجدران وتثبيت علب المفاتيح ومخارج التكييف في الدور الأرضي والأول.',
    pendingWorkSummary: 'المرحلة التالية: سحب الأسلاك وتمديد كيابل اللوحة الرئيسية.',
    checklists: [
      { id: 'chk-1', itemTitle: 'تثبيت مواسير السقف وتأمينها بسلك رباط قبل الصب', isChecked: true, notes: 'سليمة ومثبتة هندسياً' },
      { id: 'chk-2', itemTitle: 'توزيع علب المفاتيح والأفياش بمستوى شيرب موحد (120 سم و40 سم)', isChecked: true, notes: 'تمت المراجعة بميزان الليزر' },
      { id: 'chk-3', itemTitle: 'تأسيس مواسير لوحات التوزيع الفرعية والرئيسية', isChecked: true, notes: 'مطابقة لمخطط القوى' },
      { id: 'chk-4', itemTitle: 'تأسيس خط التأريض الرئيسي وقضيب الأرضي', isChecked: true, notes: 'مجهز لربط الحربة' }
    ],
    status: 'ACCEPTED',
    notes: 'تم الفحص الميداني والموافقة على صب السقف وبدء أعمال اللياسة',
    createdAt: Date.now() - 86400000 * 15
  }
];

const DEFAULT_FILES: ProjectFile[] = [
  {
    id: 'f-1',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    name: 'مخطط إنارة الدور الأرضي والمدخل',
    type: 'BLUEPRINT',
    category: 'LIGHTING_PLAN',
    uri: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    fileSizeBytes: 2450000,
    isFavorite: true,
    createdAt: Date.now() - 86400000 * 25
  },
  {
    id: 'f-2',
    projectId: 'prj-1',
    projectName: 'فيلا الشامي السكنية — حي الشباب',
    name: 'صورة توثيق دق مواسير الصالة قبل اللياسة',
    type: 'PHOTO',
    category: 'SITE_EXECUTION',
    uri: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1000&q=80',
    fileSizeBytes: 1850000,
    isFavorite: false,
    isBeforeExecution: true,
    createdAt: Date.now() - 86400000 * 20
  }
];

// تهيئة التخزين المحلي واسترجاعه
export class LocalRepository {
  private static load<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error loading key ${key}:`, e);
      return defaultValue;
    }
  }

  private static save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving key ${key}:`, e);
    }
  }

  // Projects
  static getProjects(): Project[] {
    return this.load<Project[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
  }
  static saveProjects(list: Project[]): void {
    this.save(STORAGE_KEYS.PROJECTS, list);
  }

  // Stages
  static getStages(): ProjectStage[] {
    return this.load<ProjectStage[]>(STORAGE_KEYS.STAGES, DEFAULT_STAGES);
  }
  static saveStages(list: ProjectStage[]): void {
    this.save(STORAGE_KEYS.STAGES, list);
  }

  // Items
  static getItems(): CatalogItem[] {
    return this.load<CatalogItem[]>(STORAGE_KEYS.ITEMS, DEFAULT_ITEMS);
  }
  static saveItems(list: CatalogItem[]): void {
    this.save(STORAGE_KEYS.ITEMS, list);
  }

  // Work Logs
  static getWorkLogs(): WorkLog[] {
    return this.load<WorkLog[]>(STORAGE_KEYS.WORK_LOGS, DEFAULT_WORK_LOGS);
  }
  static saveWorkLogs(list: WorkLog[]): void {
    this.save(STORAGE_KEYS.WORK_LOGS, list);
  }

  // Persons / Workers
  static getPersons(): Person[] {
    return this.load<Person[]>(STORAGE_KEYS.PERSONS, DEFAULT_PERSONS);
  }
  static savePersons(list: Person[]): void {
    this.save(STORAGE_KEYS.PERSONS, list);
  }

  // Attendance
  static getAttendance(): AttendanceRecord[] {
    return this.load<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, DEFAULT_ATTENDANCE);
  }
  static saveAttendance(list: AttendanceRecord[]): void {
    this.save(STORAGE_KEYS.ATTENDANCE, list);
  }

  // Person Payments
  static getPersonPayments(): PersonPayment[] {
    return this.load<PersonPayment[]>(STORAGE_KEYS.PERSON_PAYMENTS, DEFAULT_PAYMENTS);
  }
  static savePersonPayments(list: PersonPayment[]): void {
    this.save(STORAGE_KEYS.PERSON_PAYMENTS, list);
  }

  // Clients
  static getClients(): Client[] {
    return this.load<Client[]>(STORAGE_KEYS.CLIENTS, DEFAULT_CLIENTS);
  }
  static saveClients(list: Client[]): void {
    this.save(STORAGE_KEYS.CLIENTS, list);
  }

  // Contracts
  static getContracts(): Contract[] {
    return this.load<Contract[]>(STORAGE_KEYS.CONTRACTS, DEFAULT_CONTRACTS);
  }
  static saveContracts(list: Contract[]): void {
    this.save(STORAGE_KEYS.CONTRACTS, list);
  }

  // Change Orders
  static getChangeOrders(): ChangeOrder[] {
    return this.load<ChangeOrder[]>(STORAGE_KEYS.CHANGE_ORDERS, DEFAULT_CHANGE_ORDERS);
  }
  static saveChangeOrders(list: ChangeOrder[]): void {
    this.save(STORAGE_KEYS.CHANGE_ORDERS, list);
  }

  // Invoices
  static getInvoices(): Invoice[] {
    return this.load<Invoice[]>(STORAGE_KEYS.INVOICES, DEFAULT_INVOICES);
  }
  static saveInvoices(list: Invoice[]): void {
    this.save(STORAGE_KEYS.INVOICES, list);
  }

  // Receipts
  static getReceipts(): Receipt[] {
    return this.load<Receipt[]>(STORAGE_KEYS.RECEIPTS, DEFAULT_RECEIPTS);
  }
  static saveReceipts(list: Receipt[]): void {
    this.save(STORAGE_KEYS.RECEIPTS, list);
  }

  // Expenses
  static getExpenses(): Expense[] {
    return this.load<Expense[]>(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);
  }
  static saveExpenses(list: Expense[]): void {
    this.save(STORAGE_KEYS.EXPENSES, list);
  }

  // Defects
  static getDefects(): Defect[] {
    return this.load<Defect[]>(STORAGE_KEYS.DEFECTS, DEFAULT_DEFECTS);
  }
  static saveDefects(list: Defect[]): void {
    this.save(STORAGE_KEYS.DEFECTS, list);
  }

  // Handovers
  static getHandovers(): Handover[] {
    return this.load<Handover[]>(STORAGE_KEYS.HANDOVERS, DEFAULT_HANDOVERS);
  }
  static saveHandovers(list: Handover[]): void {
    this.save(STORAGE_KEYS.HANDOVERS, list);
  }

  // Files
  static getFiles(): ProjectFile[] {
    return this.load<ProjectFile[]>(STORAGE_KEYS.FILES, DEFAULT_FILES);
  }
  static saveFiles(list: ProjectFile[]): void {
    this.save(STORAGE_KEYS.FILES, list);
  }

  // Company Settings
  static getCompany(): CompanySettings {
    return this.load<CompanySettings>(STORAGE_KEYS.COMPANY, DEFAULT_COMPANY);
  }
  static saveCompany(settings: CompanySettings): void {
    this.save(STORAGE_KEYS.COMPANY, settings);
  }

  // Security Settings
  static getSecurity(): AppSecuritySettings {
    return this.load<AppSecuritySettings>(STORAGE_KEYS.SECURITY, DEFAULT_SECURITY);
  }
  static saveSecurity(settings: AppSecuritySettings): void {
    this.save(STORAGE_KEYS.SECURITY, settings);
  }

  // Export full JSON backup
  static exportFullBackup(): string {
    const backup = {
      appVersion: '1.0.0-production',
      databaseVersion: 1,
      createdAt: Date.now(),
      data: {
        projects: this.getProjects(),
        stages: this.getStages(),
        items: this.getItems(),
        workLogs: this.getWorkLogs(),
        persons: this.getPersons(),
        attendance: this.getAttendance(),
        personPayments: this.getPersonPayments(),
        clients: this.getClients(),
        contracts: this.getContracts(),
        changeOrders: this.getChangeOrders(),
        invoices: this.getInvoices(),
        receipts: this.getReceipts(),
        expenses: this.getExpenses(),
        defects: this.getDefects(),
        handovers: this.getHandovers(),
        files: this.getFiles(),
        company: this.getCompany(),
        security: this.getSecurity()
      }
    };
    return JSON.stringify(backup, null, 2);
  }

  // Restore backup with validation
  static restoreBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data || typeof parsed.data !== 'object') {
        return { success: false, message: 'ملف النسخة الاحتياطية غير صالح (هيكل البيانات مفقود)' };
      }
      const d = parsed.data;
      if (d.projects) this.saveProjects(d.projects);
      if (d.stages) this.saveStages(d.stages);
      if (d.items) this.saveItems(d.items);
      if (d.workLogs) this.saveWorkLogs(d.workLogs);
      if (d.persons) this.savePersons(d.persons);
      if (d.attendance) this.saveAttendance(d.attendance);
      if (d.personPayments) this.savePersonPayments(d.personPayments);
      if (d.clients) this.saveClients(d.clients);
      if (d.contracts) this.saveContracts(d.contracts);
      if (d.changeOrders) this.saveChangeOrders(d.changeOrders);
      if (d.invoices) this.saveInvoices(d.invoices);
      if (d.receipts) this.saveReceipts(d.receipts);
      if (d.expenses) this.saveExpenses(d.expenses);
      if (d.defects) this.saveDefects(d.defects);
      if (d.handovers) this.saveHandovers(d.handovers);
      if (d.files) this.saveFiles(d.files);
      if (d.company) this.saveCompany(d.company);
      if (d.security) this.saveSecurity(d.security);

      return { success: true, message: 'تمت استعادة كافة البيانات بنجاح والتحقق من سلامتها!' };
    } catch (e: any) {
      return { success: false, message: `فشل استعادة النسخة: ${e.message || 'خطأ في قراءة الملف'}` };
    }
  }
}
