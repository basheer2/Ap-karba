/**
 * حزمة كود مشروع Android Native الكامل لتطبيق كهرباني
 * 100% Kotlin + Jetpack Compose + Room + Hilt + Clean Architecture
 */

export interface AndroidFile {
  path: string;
  name: string;
  category: 'GRADLE' | 'MANIFEST' | 'ENTITY' | 'DAO' | 'DATABASE' | 'REPOSITORY' | 'USECASE' | 'COMPOSE_UI' | 'VIEWMODEL' | 'TEST' | 'WORKFLOW';
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  // 0. GitHub Actions Automated APK Builder Workflow
  {
    path: '.github/workflows/build-apk.yml',
    name: 'build-apk.yml (Workflow لإخراج Kahrabani-Debug-APK)',
    category: 'WORKFLOW',
    content: `name: Build Kahrabani Android APK (Kahrabani-Debug-APK)

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
  },

  // 1. Root build.gradle.kts
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts',
    category: 'GRADLE',
    content: `// Root build.gradle.kts — كهرباني Kahrabani
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.hilt.android) apply false
    alias(libs.plugins.ksp) apply false
}
`
  },

  // 2. app/build.gradle.kts
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'GRADLE',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.kahrabani.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.kahrabani.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        ksp {
            arg("room.schemaLocation", "$projectDir/schemas")
            arg("room.incremental", "true")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // AndroidX & Lifecycle
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Room Database (Local Offline-First)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // Dependency Injection: Hilt
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.androidx.hilt.navigation.compose)

    // WorkManager (Background Sync & Reminders)
    implementation(libs.androidx.work.runtime.ktx)

    // Biometric & Security
    implementation(libs.androidx.biometric)
    implementation(libs.androidx.security.crypto)

    // Testing
    testImplementation(libs.junit)
    testImplementation(libs.mockk)
    testImplementation(libs.kotlinx.coroutines.test)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
}
`
  },

  // 3. AndroidManifest.xml
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'MANIFEST',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".KahrabaniApp"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Kahrabani"
        tools:targetApi="35">

        <activity
            android:name=".presentation.MainActivity"
            android:exported="true"
            android:theme="@style/Theme.Kahrabani"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`
  },

  // 4. KahrabaniApp.kt (Application class with Hilt)
  {
    path: 'app/src/main/java/com/kahrabani/app/KahrabaniApp.kt',
    name: 'KahrabaniApp.kt',
    category: 'DATABASE',
    content: `package com.kahrabani.app

import android.app.Application
import androidx.hilt.work.HiltWorkerFactory
import androidx.work.Configuration
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class KahrabaniApp : Application(), Configuration.Provider {

    @Inject
    lateinit var workerFactory: HiltWorkerFactory

    override val workManagerConfiguration: Configuration
        get() = Configuration.Builder()
            .setWorkerFactory(workerFactory)
            .build()
}
`
  },

  // 5. Room Entities: ProjectEntity.kt
  {
    path: 'app/src/main/java/com/kahrabani/app/data/local/entity/ProjectEntity.kt',
    name: 'ProjectEntity.kt',
    category: 'ENTITY',
    content: `package com.kahrabani.app.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "projects",
    indices = [
        Index(value = ["projectNumber"], unique = true),
        Index(value = ["clientId"]),
        Index(value = ["status"])
    ]
)
data class ProjectEntity(
    @PrimaryKey
    val id: String,
    val projectNumber: String,
    val name: String,
    val clientId: String,
    val clientName: String,
    val phone: String,
    val location: String,
    val description: String,
    val notes: String,
    val startDate: Long,
    val endDate: Long,
    val status: String, // NEW, ACTIVE, PAUSED, COMPLETED, CANCELLED
    val contractType: String, // UNIT_ITEMS, LUMP_SUM
    val totalValue: Long, // Minor units (YER)
    val isArchived: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
`
  },

  // 6. Room Entities: AttendanceEntity.kt
  {
    path: 'app/src/main/java/com/kahrabani/app/data/local/entity/AttendanceEntity.kt',
    name: 'AttendanceEntity.kt',
    category: 'ENTITY',
    content: `package com.kahrabani.app.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "attendance",
    indices = [
        Index(value = ["personId"]),
        Index(value = ["projectId"]),
        Index(value = ["date"])
    ]
)
data class AttendanceEntity(
    @PrimaryKey
    val id: String,
    val personId: String,
    val personName: String,
    val projectId: String?,
    val projectName: String?,
    val date: Long,
    val status: String, // PRESENT, ABSENT, LEAVE, EMERGENCY, HALF_DAY, CUSTOM_RATIO
    val ratio: Double, // 1.0, 0.5, 0.0
    val earnedWage: Long, // dailyWage * ratio
    val notes: String,
    val createdAt: Long = System.currentTimeMillis()
)
`
  },

  // 7. Room Entities: InvoiceEntity.kt
  {
    path: 'app/src/main/java/com/kahrabani/app/data/local/entity/InvoiceEntity.kt',
    name: 'InvoiceEntity.kt',
    category: 'ENTITY',
    content: `package com.kahrabani.app.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "invoices",
    indices = [
        Index(value = ["invoiceNumber"], unique = true),
        Index(value = ["clientId"]),
        Index(value = ["projectId"])
    ]
)
data class InvoiceEntity(
    @PrimaryKey
    val id: String,
    val invoiceNumber: String,
    val clientId: String,
    val clientName: String,
    val projectId: String,
    val projectName: String,
    val contractId: String?,
    val issueDate: Long,
    val dueDate: Long,
    val subtotal: Long,
    val discountAmount: Long,
    val taxAmount: Long,
    val totalAmount: Long,
    val paidAmount: Long,
    val remainingAmount: Long,
    val status: String, // DRAFT, ISSUED, PARTIALLY_PAID, PAID, OVERDUE
    val notes: String,
    val createdAt: Long = System.currentTimeMillis()
)
`
  },

  // 8. Room DAO: ProjectDao.kt
  {
    path: 'app/src/main/java/com/kahrabani/app/data/local/dao/ProjectDao.kt',
    name: 'ProjectDao.kt',
    category: 'DAO',
    content: `package com.kahrabani.app.data.local.dao

import androidx.room.*
import com.kahrabani.app.data.local.entity.ProjectEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ProjectDao {

    @Query("SELECT * FROM projects WHERE isArchived = 0 ORDER BY createdAt DESC")
    fun getAllActiveProjects(): Flow<List<ProjectEntity>>

    @Query("SELECT * FROM projects WHERE id = :id")
    suspend fun getProjectById(id: String): ProjectEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProject(project: ProjectEntity)

    @Update
    suspend fun updateProject(project: ProjectEntity)

    @Delete
    suspend fun deleteProject(project: ProjectEntity)

    @Query("SELECT COUNT(*) FROM projects WHERE status = 'ACTIVE'")
    fun getActiveProjectsCount(): Flow<Int>
}
`
  },

  // 9. Room Database: KahrabaniDatabase.kt
  {
    path: 'app/src/main/java/com/kahrabani/app/data/local/KahrabaniDatabase.kt',
    name: 'KahrabaniDatabase.kt',
    category: 'DATABASE',
    content: `package com.kahrabani.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.kahrabani.app.data.local.dao.*
import com.kahrabani.app.data.local.entity.*

@Database(
    entities = [
        ProjectEntity::class,
        AttendanceEntity::class,
        InvoiceEntity::class
    ],
    version = 1,
    exportSchema = true
)
abstract class KahrabaniDatabase : RoomDatabase() {
    abstract fun projectDao(): ProjectDao
}
`
  },

  // 10. Domain Use Case: CalculateProjectProfitUseCase.kt
  {
    path: 'app/src/main/java/com/kahrabani/app/domain/usecase/CalculateProjectProfitUseCase.kt',
    name: 'CalculateProjectProfitUseCase.kt',
    category: 'USECASE',
    content: `package com.kahrabani.app.domain.usecase

import javax.inject.Inject

data class ProfitResult(
    val revenue: Long,
    val laborCost: Long,
    val expensesCost: Long,
    val totalCost: Long,
    val netProfit: Long,
    val marginPercent: Int
)

class CalculateProjectProfitUseCase @Inject constructor() {

    operator fun invoke(
        revenue: Long,
        laborCost: Long,
        expensesCost: Long
    ): ProfitResult {
        val totalCost = laborCost + expensesCost
        val netProfit = revenue - totalCost
        val margin = if (revenue > 0) {
            ((netProfit.toDouble() / revenue.toDouble()) * 100).toInt()
        } else {
            0
        }

        return ProfitResult(
            revenue = revenue,
            laborCost = laborCost,
            expensesCost = expensesCost,
            totalCost = totalCost,
            netProfit = netProfit,
            marginPercent = margin
        )
    }
}
`
  },

  // 11. Compose UI: DashboardScreen.kt
  {
    path: 'app/src/main/java/com/kahrabani/app/presentation/dashboard/DashboardScreen.kt',
    name: 'DashboardScreen.kt',
    category: 'COMPOSE_UI',
    content: `package com.kahrabani.app.presentation.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel

@Composable
fun DashboardScreen(
    viewModel: DashboardViewModel = hiltViewModel(),
    onNavigateToProjects: () -> Unit,
    onNavigateToDailyWork: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("كهرباني — نظام المقاول") }
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text(
                    text = "لوحة القيادة والمؤشرات الحية",
                    style = MaterialTheme.typography.titleLarge
                )
            }
        }
    }
}
`
  },

  // 12. Unit Test: ProfitCalculationTest.kt
  {
    path: 'app/src/test/java/com/kahrabani/app/domain/usecase/ProfitCalculationTest.kt',
    name: 'ProfitCalculationTest.kt',
    category: 'TEST',
    content: `package com.kahrabani.app.domain.usecase

import org.junit.Assert.assertEquals
import org.junit.Test

class ProfitCalculationTest {

    private val calculateProfitUseCase = CalculateProjectProfitUseCase()

    @Test
    fun testProjectProfit_calculatesCorrectly() {
        val revenue = 2800000L
        val laborCost = 500000L
        val expenses = 400000L

        val result = calculateProfitUseCase(revenue, laborCost, expenses)

        assertEquals(900000L, result.totalCost)
        assertEquals(1900000L, result.netProfit)
        assertEquals(67, result.marginPercent)
    }
}
`
  }
];
