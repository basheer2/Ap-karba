import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectBundle';

/**
 * دالة توليد وتنزيل مشروع Android Studio Native الأصلي بصيغة ZIP
 */
export async function downloadAndroidProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Add all Android files
  ANDROID_PROJECT_FILES.forEach((f) => {
    zip.file(f.path, f.content);
  });

  // Settings Gradle
  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Kahrabani"
include(":app")
`
  );

  // Gradle Wrapper properties
  zip.file(
    'gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.10.2-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  // GitHub Actions Workflow for 100% automated APK generation on GitHub
  zip.file(
    '.github/workflows/build-apk.yml',
    `name: Build Kahrabani Android APK (Kahrabani-Debug-APK)

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:
    inputs:
      build_type:
        description: 'نوع البناء (Build Type)'
        required: true
        default: 'debug'
        type: choice
        options:
          - debug

permissions:
  contents: write

jobs:
  build-apk:
    name: Build & Package Kahrabani-Debug-APK
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: 📥 استنساخ الكود (Checkout Code)
        uses: actions/checkout@v4

      - name: ☕ إعداد بيئة جافا (Set up JDK 17)
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: 🤖 إعداد Android SDK
        uses: android-actions/setup-android@v3

      - name: 🔐 منح صلاحيات التشغيل لـ Gradle Wrapper
        run: |
          chmod +x ./gradlew || true

      - name: ⚙️ بناء حزمة APK التجريبية (Assemble Debug APK)
        run: |
          ./gradlew assembleDebug --stacktrace --no-daemon

      - name: 📦 تجهيز وإعادة تسمية ملف APK إلى Kahrabani-Debug-APK.apk
        run: |
          mkdir -p release-output
          if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
            cp "app/build/outputs/apk/debug/app-debug.apk" "release-output/Kahrabani-Debug-APK.apk"
          else
            find app/build/outputs/apk -name "*.apk" -exec cp {} "release-output/Kahrabani-Debug-APK.apk" \;
          fi
          
          cd release-output
          sha256sum Kahrabani-Debug-APK.apk > Kahrabani-Debug-APK.apk.sha256
          echo "تم إنشاء الملف بنجاح:"
          ls -lh Kahrabani-Debug-APK.apk

      - name: 🚀 رفع ملف Kahrabani-Debug-APK كحزمة قابلة للتحميل (Upload Artifact)
        uses: actions/upload-artifact@v4
        with:
          name: Kahrabani-Debug-APK
          path: release-output/Kahrabani-Debug-APK.apk
          if-no-files-found: error
          retention-days: 30

      - name: 📝 ملخص البناء في صفحة GitHub Actions
        run: |
          echo "### ⚡ تم بناء تطبيق كهرباني بنجاح! 🚀" >> $GITHUB_STEP_SUMMARY
          echo "- **اسم الملف المخرج:** \`Kahrabani-Debug-APK.apk\`" >> $GITHUB_STEP_SUMMARY
          echo "- **الحجم:** $(ls -lh release-output/Kahrabani-Debug-APK.apk | awk '{print $5}')" >> $GITHUB_STEP_SUMMARY
          echo "- **بصمة SHA-256:**" >> $GITHUB_STEP_SUMMARY
          echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
          cat release-output/Kahrabani-Debug-APK.apk.sha256 >> $GITHUB_STEP_SUMMARY
          echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
          echo "يمكنك تحميل الملف فوراً من قسم **Artifacts** في أعلى صفحة الـ Action." >> $GITHUB_STEP_SUMMARY
`
  );

  // Shell gradlew script
  zip.file(
    'gradlew',
    `#!/bin/sh
exec gradle "$@"
`
  );

  // Windows gradlew.bat
  zip.file(
    'gradlew.bat',
    `@echo off
gradle %*
`
  );

  // Detailed guide for generating APK
  zip.file(
    'BUILD_APK_GUIDE.md',
    `# دليل استخراج وتثبيت ملف الـ APK لتطبيق «كهرباني»

هناك 3 طرق سهلة وسريعة للحصول على ملف الـ APK جاهزاً للتثبيت على هاتفك الأندرويد:

---

## الطريقة 1: عبر Android Studio (بضغطة زر واحدة)
1. افتح مشروع التطبيق في **Android Studio**.
2. من القائمة العلوية اضغط على:
   \`Build\` ➔ \`Build Bundle(s) / APK(s)\` ➔ \`Build APK(s)\`.
3. انتظر بضع ثوانٍ حتى يكتمل البناء.
4. ستظهر رسالة بالأسفل تقول: \`APK(s) generated successfully\`، اضغط بجانبها على **locate**.
5. ستجد ملف التطبيق جاهزاً باسم:
   \`app-debug.apk\`
   داخل المسار: \`app/build/outputs/apk/debug/app-debug.apk\`.
6. قم بنسخ هذا الملف إلى هاتفك واضغط عليه لتثبيته فوراً.

---

## الطريقة 2: عبر GitHub Actions (بدون تثبيت أي برنامج على جهازك - سحابياً)
1. ارفع هذا المجلد إلى مستودع جديد على حسابك في **GitHub**.
2. يحتوي المشروع تلقائياً على ملف: \`.github/workflows/build-apk.yml\`.
3. بمجرد الرفع، توجه لتبويب **Actions** في GitHub.
4. ستجد عملية البناء تعمل تلقائياً، وبعد دقيقة ستجد ملف **Kahrabani-Debug-APK** جاهزاً للتحميل المباشر بصيغة APK!

---

## الطريقة 3: عبر سطر الأوامر (Terminal / CMD)
إذا كان لديك Gradle أو Android SDK مثبتين:
\`\`\`bash
./gradlew assembleDebug
\`\`\`
وسيتم توليد الملف في:
\`app/build/outputs/apk/debug/app-debug.apk\`
`
  );

  // Proguard rules
  zip.file(
    'app/proguard-rules.pro',
    `# Proguard rules for Kahrabani
-keep class com.kahrabani.app.data.local.entity.** { *; }
-dontwarn androidx.room.**
`
  );

  // Detailed README
  zip.file(
    'README.md',
    `# مشروع تطبيق «كهرباني» — Android Studio Native
نظام إدارة المقاول الكهربائي المتكامل المبني بأحدث تقنيات Android الحديثة:

## التقنيات المستخدمة:
- لغة البرمجة: Kotlin 2.1
- واجهات المستخدم: Jetpack Compose + Material 3 (دعم RTL واللغة العربية)
- قاعدة البيانات المحلية: Room 2.6 (Offline-First)
- حقن التبعيات: Hilt 2.52
- العمليات الخلفية: WorkManager
- الأمان: BiometricPrompt + Encrypted Storage

## خطوات التشغيل في Android Studio:
1. فك ضغط هذا الملف (Extract ZIP).
2. افتح برنامج Android Studio (إصدار Ladybug أو أحدث).
3. اختر File -> Open وحدد مجلد المشروع المفكوك.
4. انتظر حتى تكتمل عملية Gradle Sync.
5. اضغط على الزر الأخضر Run (Shift + F10) لتثبيت وتشغيل التطبيق على الهاتف أو المحاكي.
`
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Kahrabani-Android-Studio-Native.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * دالة تنزيل سورس كود نظام كهرباني الكامل (Web + Android Code + Docs)
 */
export async function downloadFullSystemZip(): Promise<void> {
  const zip = new JSZip();

  // Root files
  zip.file('package.json', JSON.stringify({
    name: 'kahrabani-contractor-system',
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    }
  }, null, 2));

  // Android folder inside full system
  const androidFolder = zip.folder('android-native-source');
  if (androidFolder) {
    ANDROID_PROJECT_FILES.forEach(f => {
      androidFolder.file(f.path, f.content);
    });
  }

  // README
  zip.file('README.md', `# نظام كهرباني (Kahrabani) — نظام إدارة المقاول الكهربائي
كافة ملفات الكود المصدري ومواصفات قاعدة البيانات والوثائق المعمارية.
`);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Kahrabani-Full-Source-Code.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
