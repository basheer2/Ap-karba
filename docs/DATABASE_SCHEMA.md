# مخطط قاعدة البيانات (Room Database Schema) — كهرباني

قاعدة بيانات Room الأساسية: `KahrabaniDatabase`

### جداول الكيانات (Entities & Tables)

1. **projects** (المشاريع)
   - `id`: String (UUID) PRIMARY KEY
   - `projectNumber`: String UNIQUE (e.g. PRJ-0001)
   - `name`: String
   - `clientId`: String (Foreign Key -> clients.id)
   - `phone`: String
   - `location`: String
   - `description`: String
   - `notes`: String
   - `startDate`: Long (Epoch ms)
   - `endDate`: Long (Epoch ms)
   - `status`: String (NEW, ACTIVE, PAUSED, COMPLETED, CANCELLED)
   - `contractType`: String (UNIT_ITEMS, LUMP_SUM)
   - `totalValue`: Long (Minor currency units / Riyal)
   - `isArchived`: Boolean
   - `createdAt`: Long
   - `updatedAt`: Long

2. **project_stages** (مراحل المشروع)
   - `id`: String PRIMARY KEY
   - `projectId`: String (Foreign Key -> projects.id CASCADE)
   - `name`: String (التأسيس، سحب الأسلاك، التشطيب...)
   - `orderIndex`: Int
   - `description`: String
   - `assignedPersonId`: String? (Foreign Key -> persons.id)
   - `startDatePlanned`: Long?
   - `endDatePlanned`: Long?
   - `startDateActual`: Long?
   - `endDateActual`: Long?
   - `progressPercent`: Int (0-100)
   - `status`: String (NOT_STARTED, IN_PROGRESS, COMPLETED, PAUSED)
   - `stageValue`: Long
   - `createdAt`: Long

3. **items** (دليل البنود المركزية)
   - `id`: String PRIMARY KEY
   - `name`: String
   - `unit`: String (نقطة، متر، لوحة، حبة...)
   - `description`: String
   - `defaultPrice`: Long
   - `isActive`: Boolean

4. **item_prices** (أسعار البنود حسب المرحلة أو المشروع)
   - `id`: String PRIMARY KEY
   - `itemId`: String (Foreign Key -> items.id)
   - `projectId`: String?
   - `stageName`: String (تأسيس، سحب أسلاك، تشطيب)
   - `price`: Long

5. **work_logs** (سجل الإنجاز والعمل اليومي)
   - `id`: String PRIMARY KEY
   - `projectId`: String (Foreign Key -> projects.id)
   - `stageId`: String? (Foreign Key -> project_stages.id)
   - `personId`: String? (Foreign Key -> persons.id)
   - `itemId`: String? (Foreign Key -> items.id)
   - `date`: Long
   - `workType`: String
   - `quantity`: Double
   - `unitPrice`: Long
   - `total`: Long (quantity * unitPrice)
   - `durationMinutes`: Int
   - `completionPercent`: Int
   - `notes`: String
   - `createdAt`: Long

6. **persons** (فريق العمل والأشخاص)
   - `id`: String PRIMARY KEY
   - `name`: String
   - `phone`: String
   - `role`: String (OWNER, MASTER_TECHNICIAN, WORKER)
   - `dailyWage`: Long
   - `notes`: String
   - `isActive`: Boolean
   - `createdAt`: Long

7. **attendance** (سجل الحضور والغياب)
   - `id`: String PRIMARY KEY
   - `personId`: String (Foreign Key -> persons.id)
   - `projectId`: String?
   - `date`: Long
   - `status`: String (PRESENT, ABSENT, LEAVE, EMERGENCY, HALF_DAY, CUSTOM_RATIO)
   - `ratio`: Double (1.0, 0.5, 0.0, custom)
   - `earnedWage`: Long (dailyWage * ratio)
   - `notes`: String
   - `createdAt`: Long

8. **person_payments** (سلف ودفعات العمال)
   - `id`: String PRIMARY KEY
   - `voucherNumber`: String UNIQUE (PV-0001...)
   - `personId`: String (Foreign Key -> persons.id)
   - `projectId`: String?
   - `date`: Long
   - `amount`: Long
   - `type`: String (ADVANCE, WEEKLY_PAYMENT, FINAL_PAYMENT, CUSTOM)
   - `paymentMethod`: String (CASH, BANK_TRANSFER, OTHER)
   - `notes`: String
   - `createdAt`: Long

9. **clients** (العملاء)
   - `id`: String PRIMARY KEY
   - `name`: String
   - `phone`: String
   - `email`: String
   - `address`: String
   - `notes`: String
   - `createdAt`: Long

10. **contracts** (العقود)
    - `id`: String PRIMARY KEY
    - `contractNumber`: String UNIQUE (CTR-0001)
    - `clientId`: String (Foreign Key -> clients.id)
    - `projectId`: String (Foreign Key -> projects.id)
    - `contractDate`: Long
    - `startDate`: Long
    - `endDate`: Long
    - `durationDays`: Int
    - `initialValue`: Long
    - `currentValue`: Long (including approved change orders)
    - `downPayment`: Long
    - `paymentTerms`: String
    - `scopeOfWork`: String
    - `excludedWork`: String
    - `agreementType`: String (UNIT_ITEMS, LUMP_SUM)
    - `status`: String (DRAFT, IN_REVIEW, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED)
    - `notes`: String
    - `createdAt`: Long

11. **change_orders** (أوامر التغيير)
    - `id`: String PRIMARY KEY
    - `orderNumber`: String UNIQUE (CO-0001)
    - `contractId`: String (Foreign Key -> contracts.id)
    - `description`: String
    - `amount`: Long (+/-)
    - `date`: Long
    - `status`: String (PENDING, APPROVED, REJECTED)
    - `notes`: String
    - `createdAt`: Long

12. **invoices** (الفواتير)
    - `id`: String PRIMARY KEY
    - `invoiceNumber`: String UNIQUE (INV-0001)
    - `clientId`: String (Foreign Key -> clients.id)
    - `projectId`: String (Foreign Key -> projects.id)
    - `contractId`: String?
    - `issueDate`: Long
    - `dueDate`: Long
    - `subtotal`: Long
    - `discountAmount`: Long
    - `taxAmount`: Long
    - `totalAmount`: Long
    - `paidAmount`: Long
    - `remainingAmount`: Long
    - `status`: String (DRAFT, ISSUED, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED)
    - `notes`: String
    - `createdAt`: Long

13. **invoice_lines** (بنود الفاتورة)
    - `id`: String PRIMARY KEY
    - `invoiceId`: String (Foreign Key -> invoices.id CASCADE)
    - `description`: String
    - `quantity`: Double
    - `unitPrice`: Long
    - `total`: Long

14. **receipts** (سندات القبض من العملاء)
    - `id`: String PRIMARY KEY
    - `receiptNumber`: String UNIQUE (RC-0001)
    - `clientId`: String (Foreign Key -> clients.id)
    - `projectId`: String (Foreign Key -> projects.id)
    - `invoiceId`: String?
    - `amount`: Long
    - `date`: Long
    - `paymentMethod`: String (CASH, BANK, CHEQUE)
    - `notes`: String
    - `createdAt`: Long

15. **expenses** (المصروفات)
    - `id`: String PRIMARY KEY
    - `expenseNumber`: String UNIQUE (EXP-0001)
    - `projectId`: String?
    - `stageId`: String?
    - `category`: String (مواد، أسلاك ومواسير، لوحات وقواطع، نقل وشحن، عدد وأدوات، إكراميات، ضيافة، أخرى)
    - `amount`: Long
    - `date`: Long
    - `recipient`: String
    - `notes`: String
    - `attachmentUri`: String?
    - `createdAt`: Long

16. **defects** (العيوب والملاحظات)
    - `id`: String PRIMARY KEY
    - `projectId`: String (Foreign Key -> projects.id)
    - `stageId`: String?
    - `title`: String
    - `description`: String
    - `date`: Long
    - `priority`: String (LOW, MEDIUM, HIGH, CRITICAL)
    - `assignedPersonId`: String?
    - `dueDate`: Long?
    - `status`: String (OPEN, IN_PROGRESS, FIXED, CLOSED)
    - `photoBeforeUri`: String?
    - `photoAfterUri`: String?
    - `createdAt`: Long

17. **handovers** (محاضر التسليم)
    - `id`: String PRIMARY KEY
    - `handoverNumber`: String UNIQUE (HO-0001)
    - `projectId`: String (Foreign Key -> projects.id)
    - `date`: Long
    - `type`: String (PRELIMINARY, FINAL, CUSTOM)
    - `recipientName`: String
    - `recipientRole`: String
    - `completedWorkSummary`: String
    - `pendingWorkSummary`: String
    - `status`: String (DRAFT, ACCEPTED, REJECTED, ACCEPTED_WITH_REMARKS)
    - `contractorSignature`: String? (Base64 SVG/PNG)
    - `clientSignature`: String? (Base64 SVG/PNG)
    - `notes`: String
    - `createdAt`: Long

18. **handover_checklists** (قوائم تدقيق التسليم)
    - `id`: String PRIMARY KEY
    - `handoverId`: String (Foreign Key -> handovers.id CASCADE)
    - `itemTitle`: String (لوحة التوزيع، التأريض، اختبار القواطع، سلامة الإنارة...)
    - `isChecked`: Boolean
    - `notes`: String

19. **project_files** (ملفات ووسائط المشاريع)
    - `id`: String PRIMARY KEY
    - `projectId`: String
    - `stageId`: String?
    - `name`: String
    - `type`: String (PHOTO, VIDEO, BLUEPRINT, DOCUMENT)
    - `category`: String (LIGHTING_PLAN, POWER_PLAN, ARCHITECTURAL, SITE_EXECUTION, DEFECT, HANDOVER)
    - `uri`: String
    - `thumbnailUri`: String?
    - `fileSizeBytes`: Long
    - `durationSeconds`: Int?
    - `isFavorite`: Boolean
    - `isBeforeExecution`: Boolean?
    - `createdAt`: Long

20. **tombstones** (سجل المحذوفات للمزامنة اللاتزامنية)
    - `entityType`: String
    - `entityId`: String
    - `deletedAt`: Long
    - `synced`: Boolean
    - PRIMARY KEY (entityType, entityId)

21. **sync_queue** (طابور المزامنة)
    - `id`: String PRIMARY KEY
    - `entityType`: String
    - `entityId`: String
    - `operation`: String (CREATE, UPDATE, DELETE)
    - `payloadJson`: String
    - `timestamp`: Long
    - `retryCount`: Int
    - `status`: String (PENDING, SYNCED, FAILED)
