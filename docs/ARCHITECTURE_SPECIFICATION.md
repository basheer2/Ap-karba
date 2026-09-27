# نظام كهرباني — مواصفات البنية المعمارية (Architecture Specification)
## نظام إدارة المقاول الكهربائي (Kahrabani Contractor System)

### 1. النمط المعماري (Architectural Pattern)
يعتمد التطبيق على معمارية **Clean Architecture** الصارمة مع نمط **MVVM (Model-View-ViewModel)** و **Offline-First Reactive Flow**:

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│   Jetpack Compose UI / Web Mobile Canvas + RTL Arab    │
│            StateFlow / SharedFlow Observers            │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    ViewModel Layer                     │
│    UI State Management, Intent Handling, Screen Flow   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                     Domain Layer                       │
│    Use Cases, Pure Business Rules, Financial Math      │
│   (No Android/UI dependencies, 100% Deterministic)     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                   Repository Layer                     │
│   Data Mediation, Sync Queue Orchestration, Caching   │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
┌─────────────▼─────────────┐┌─────────────▼─────────────┐
│     Local Data Source     ││    Remote / Cloud Source  │
│   Room Database (SQLite)  ││   Google Drive / Backup   │
│   DataStore Preferences   ││   Sync Queue & Conflicts  │
│   Local Encrypted Storage ││   Tombstones Protocol     │
└───────────────────────────┘└───────────────────────────┘
```

### 2. تقسيم الطبقات ومسؤولياتها
1. **Domain Layer**:
   - الكيانات الخالصة (Pure Domain Models).
   - حالات الاستخدام (Use Cases): مثل `CalculateProjectProfitUseCase`, `GenerateInvoiceUseCase`, `RecordWorkerAttendanceUseCase`, `ApproveChangeOrderUseCase`.
   - القواعد المالية الصارمة (Strict Financial Rules): ممنوع استخدام `Float` أو `Double` للمبالغ النقدية؛ الاعتماد على `Long` بأصغر وحدة نقدية (فلوس/سنت) أو تمثيل دقيق لحساب الريال اليمني.
   
2. **Data Layer**:
   - `Room Database` مع جداول مفهرسة (Indexed Tables) ومفاتيح خارجية (Foreign Keys) مع `CASCADE` أو `RESTRICT` المناسب.
   - `SyncQueue` و `Tombstones` لضمان عدم عودة السجلات المحذوفة ودعم المزامنة اللاتزامنية.
   - `TypeConverters` للتاريخ والقوائم والـ Enums.
   - `DataStore` لتفضيلات التطبيق والأمان وحالة الخصوصية المالية.

3. **Presentation Layer**:
   - واجهات Jetpack Compose باللغة العربية مع دعم RTL كامل.
   - استجابة فورية بدون توقف (Zero Blocking UI).
   - حالات الشاشات الأربعة: `Loading`, `Empty`, `Error`, `Success`.
   - إدارة الخصوصية المالية `Financial Privacy Mode` لحجب الأرقام بنقرة واحدة (••••••).
   - توقيع رقمي أصلي (Native Touch Signature Pad).

### 3. الاعتماديات والتقنيات (Tech Stack)
- **Language**: Kotlin 2.x & TypeScript/React for Dual-Target Delivery.
- **UI Toolkit**: Jetpack Compose + Material 3.
- **Local DB**: Room Database v1 with migrations support.
- **Dependency Injection**: Hilt.
- **Background Tasks**: WorkManager.
- **Security**: Keystore + BiometricPrompt + Financial Privacy Masking.
- **Currency**: الريال اليمني (YER) مع تفقيط باللغة العربية الفصحى.
