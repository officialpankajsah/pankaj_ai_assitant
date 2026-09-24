export interface AndroidFile {
  path: string;
  name: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'json';
  category: 'Configuration' | 'Core' | 'Domain' | 'Data' | 'Feature' | 'Widget';
  content: string;
}

export const ANDROID_CODEBASE: AndroidFile[] = [
  {
    path: 'build.gradle.kts',
    name: 'Project build.gradle.kts',
    language: 'kotlin',
    category: 'Configuration',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.hilt.android) apply false
    alias(libs.plugins.ksp) apply false
}
`
  },
  {
    path: 'app/build.gradle.kts',
    name: 'App build.gradle.kts',
    language: 'kotlin',
    category: 'Configuration',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.pankajji.assistant"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.pankajji.assistant"
        minSdk = 29 // Android 10+
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
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
        buildConfig = true
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.navigation.compose)

    // Hilt Dependency Injection
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.androidx.hilt.navigation.compose)

    // Room Database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // DataStore Preferences
    implementation(libs.androidx.datastore.preferences)

    // Coroutines & WorkManager
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.androidx.work.runtime.ktx)

    // Gemini API & Networking
    implementation("com.google.ai.client.generativeai:generativeai:0.9.0")
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
}
`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    category: 'Configuration',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Voice & Microphone -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <!-- Phone & Communication -->
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.WRITE_CONTACTS" />
    <uses-permission android:name="android.permission.SEND_SMS" />
    <uses-permission android:name="android.permission.READ_SMS" />

    <!-- Calendar & Alarms -->
    <uses-permission android:name="android.permission.READ_CALENDAR" />
    <uses-permission android:name="android.permission.WRITE_CALENDAR" />
    <uses-permission android:name="com.android.alarm.permission.SET_ALARM" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />

    <!-- Location for Navigation & Weather -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <!-- Hardware, Camera & Network -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

    <!-- Notifications & Background Services -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />

    <!-- Package Visibility for Intent Launcher -->
    <queries>
        <intent>
            <action android:name="android.intent.action.MAIN" />
        </intent>
        <package android:name="com.google.android.youtube" />
        <package android:name="com.whatsapp" />
        <package android:name="com.instagram.android" />
        <package android:name="com.android.chrome" />
    </queries>

    <application
        android:name=".PankajApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.PankajJi">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.PankajJi">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Voice Assistant Intent Filter -->
            <intent-filter>
                <action android:name="android.intent.action.VOICE_COMMAND" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </activity>

        <!-- Foreground Service for Background Assistant -->
        <service
            android:name=".core.services.PankajForegroundService"
            android:foregroundServiceType="microphone"
            android:exported="false" />

        <!-- Accessibility Service for authorized automation -->
        <service
            android:name=".core.automation.PankajAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="false">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

        <!-- Notification Listener Service -->
        <service
            android:name=".core.automation.PankajNotificationListenerService"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
            android:exported="false">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
        </service>

        <!-- Home Screen App Widget -->
        <receiver
            android:name=".widget.PankajJiWidgetReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/pankaj_widget_info" />
        </receiver>

    </application>
</manifest>
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/MainActivity.kt',
    name: 'MainActivity.kt',
    language: 'kotlin',
    category: 'Feature',
    content: `package com.pankajji.assistant

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.pankajji.assistant.feature.home.HomeScreen
import com.pankajji.assistant.feature.home.HomeViewModel
import com.pankajji.assistant.ui.theme.PankajJiTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private val homeViewModel: HomeViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PankajJiTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    HomeScreen(viewModel = homeViewModel)
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/core/ai/AIProvider.kt',
    name: 'AIProvider.kt',
    language: 'kotlin',
    category: 'Core',
    content: `package com.pankajji.assistant.core.ai

import com.pankajji.assistant.domain.models.AssistantResponse
import com.pankajji.assistant.domain.models.ChatMessage

/**
 * Clean architecture abstraction for AI Assistant Provider.
 * Allows swapping between Gemini, offline ONNX models, or custom backends.
 */
interface AIProvider {
    suspend fun processQuery(
        query: string,
        conversationHistory: List<ChatMessage>,
        preferredLanguage: String,
        deviceContext: Map<String, Any>
    ): Result<AssistantResponse>
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/core/ai/GeminiProvider.kt',
    name: 'GeminiProvider.kt',
    language: 'kotlin',
    category: 'Core',
    content: `package com.pankajji.assistant.core.ai

import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import com.pankajji.assistant.domain.models.AssistantResponse
import com.pankajji.assistant.domain.models.ChatMessage
import com.pankajji.assistant.domain.tools.ToolRegistry
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GeminiProvider @Inject constructor(
    private val toolRegistry: ToolRegistry
) : AIProvider {

    private val systemInstruction = """
        You are "Pankaj Ji", an intelligent, respectful, calm, voice-first Indian AI personal assistant for Android.
        Greeting: "Namaste Ji, main Pankaj Ji hoon. Bataiye, main aapki kya madad kar sakta hoon?"
        Tone: Indian conversational style, natural Hinglish by default, use "Ji" naturally and respectfully.
        Understand Indian accents, idioms, local cities (Varanasi, Mumbai, Delhi), and mixed sentences.
        Return structured JSON with voiceResponse, displayText, and toolCalls.
    """.trimIndent()

    private val generativeModel by lazy {
        GenerativeModel(
            modelName = "gemini-3.8-flash",
            apiKey = BuildConfig.GEMINI_API_KEY,
            systemInstruction = content { text(systemInstruction) }
        )
    }

    override suspend fun processQuery(
        query: String,
        conversationHistory: List<ChatMessage>,
        preferredLanguage: String,
        deviceContext: Map<String, Any>
    ): Result<AssistantResponse> = withContext(Dispatchers.IO) {
        try {
            val prompt = """
                [Language: $preferredLanguage]
                [Context: $deviceContext]
                User Query: "$query"
            """.trimIndent()

            val response = generativeModel.generateContent(prompt)
            val jsonText = response.text ?: ""
            val json = JSONObject(jsonText)

            Result.success(
                AssistantResponse(
                    voiceResponse = json.optString("voiceResponse", "Bilkul Ji."),
                    displayText = json.optString("displayText", "Action executed."),
                    toolCalls = emptyList()
                )
            )
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/core/voice/VoiceEngine.kt',
    name: 'VoiceEngine.kt',
    language: 'kotlin',
    category: 'Core',
    content: `package com.pankajji.assistant.core.voice

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class VoiceEngine @Inject constructor(
    @ApplicationContext private val context: Context
) : RecognitionListener, TextToSpeech.OnInitListener {

    private var speechRecognizer: SpeechRecognizer? = null
    private var tts: TextToSpeech? = null

    private val _isListening = MutableStateFlow(false)
    val isListening = _isListening.asStateFlow()

    private val _audioAmplitude = MutableStateFlow(0f)
    val audioAmplitude = _audioAmplitude.asStateFlow()

    init {
        tts = TextToSpeech(context, this)
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context).apply {
            setRecognitionListener(this@VoiceEngine)
        }
    }

    fun startListening(languageLocale: String = "hi-IN") {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, languageLocale)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
        }
        speechRecognizer?.startListening(intent)
        _isListening.value = true
    }

    fun stopListening() {
        speechRecognizer?.stopListening()
        _isListening.value = false
    }

    fun speak(text: String, onFinished: () -> Unit = {}) {
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "PANKAJ_JI_UTTERANCE")
    }

    fun stopSpeaking() {
        tts?.stop()
    }

    override fun onRmsChanged(rmsdB: Float) {
        // Map dB (-2 to 10) to 0.0 .. 1.0 amplitude
        _audioAmplitude.value = ((rmsdB + 2f) / 12f).coerceIn(0f, 1f)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale("hi", "IN")
            tts?.setPitch(0.95f)
            tts?.setSpeechRate(1.0f)
        }
    }

    override fun onReadyForSpeech(params: Bundle?) {}
    override fun onBeginningOfSpeech() {}
    override fun onBufferReceived(buffer: ByteArray?) {}
    override fun onEndOfSpeech() { _isListening.value = false }
    override fun onError(error: Int) { _isListening.value = false }
    override fun onResults(results: Bundle?) {}
    override fun onPartialResults(partialResults: Bundle?) {}
    override fun onEvent(eventType: Int, params: Bundle?) {}
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/core/voice/WakeWordEngine.kt',
    name: 'WakeWordEngine.kt',
    language: 'kotlin',
    category: 'Core',
    content: `package com.pankajji.assistant.core.voice

import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Modular Wake Word Engine for detecting "Hey Pankaj Ji".
 * Designed to support Porcupine / TensorFlow Lite offline keyword spotter.
 */
@Singleton
class WakeWordEngine @Inject constructor() {

    private val _wakeWordDetected = MutableSharedFlow<Unit>()
    val wakeWordDetected = _wakeWordDetected.asSharedFlow()

    private var isEnabled = false

    fun startListening() {
        isEnabled = true
        // Hook to local offline keyword detector
    }

    fun stopListening() {
        isEnabled = false
    }
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/domain/tools/Tool.kt',
    name: 'Tool.kt',
    language: 'kotlin',
    category: 'Domain',
    content: `package com.pankajji.assistant.domain.tools

enum class RiskLevel { LOW, MEDIUM, HIGH }

interface Tool {
    val name: String
    val description: String
    val parameters: Map<String, String>
    val requiredPermissions: List<String>
    val riskLevel: RiskLevel

    suspend fun execute(params: Map<String, Any>): ToolResult
    suspend fun verify(result: ToolResult): Boolean
}

data class ToolResult(
    val success: Boolean,
    val message: String,
    val data: Any? = null
)
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/core/launcher/AppLauncher.kt',
    name: 'AppLauncher.kt',
    language: 'kotlin',
    category: 'Core',
    content: `package com.pankajji.assistant.core.launcher

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

data class InstalledApp(
    val displayName: String,
    val packageName: String,
    val activityName: String?,
    val aliases: List<String>,
    val category: String,
    val isInstalled: Boolean = true
)

sealed class AppLaunchResult {
    data class Success(val app: InstalledApp, val message: String) : AppLaunchResult()
    data class NotFound(val query: String, val message: String) : AppLaunchResult()
    data class NotInstalled(val appName: String, val message: String) : AppLaunchResult()
    data class DisambiguationRequired(val candidates: List<InstalledApp>, val prompt: String) : AppLaunchResult()
    data class Error(val reason: String) : AppLaunchResult()
}

@Singleton
class AppLauncher @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val packageManager: PackageManager = context.packageManager

    /**
     * Discovers all launchable applications on the user's Android phone
     */
    fun getInstalledApps(): List<InstalledApp> {
        val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }
        val resolveInfos: List<ResolveInfo> = packageManager.queryIntentActivities(mainIntent, 0)
        return resolveInfos.map { ri ->
            val label = ri.loadLabel(packageManager).toString()
            val pkg = ri.activityInfo.packageName
            InstalledApp(
                displayName = label,
                packageName = pkg,
                activityName = ri.activityInfo.name,
                aliases = generateAliases(label),
                category = categorizeApp(pkg)
            )
        }
    }

    fun isAppInstalled(packageName: String): Boolean {
        return try {
            packageManager.getPackageInfo(packageName, 0)
            true
        } catch (e: PackageManager.NameNotFoundException) {
            false
        }
    }

    fun findAppByName(name: String): InstalledApp? {
        val query = name.trim().lowercase()
        return getInstalledApps().find {
            it.displayName.lowercase() == query || it.aliases.any { al -> al == query }
        }
    }

    fun findAppByAlias(alias: String): InstalledApp? {
        val query = alias.trim().lowercase()
        return getInstalledApps().find {
            it.aliases.any { al -> al.contains(query) || query.contains(al) }
        }
    }

    fun getLaunchIntent(packageName: String): Intent? {
        return packageManager.getLaunchIntentForPackage(packageName)?.apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
        }
    }

    /**
     * Main Voice Launch Pipeline:
     * Resolves app -> checks install status -> attempts real Intent -> verifies
     */
    fun launchApp(commandOrAppName: String, isBhojpuri: Boolean = false): AppLaunchResult {
        val cleanQuery = extractAppQuery(commandOrAppName)

        // 1. Banking Category Disambiguation check
        if (cleanQuery.contains("bank") || cleanQuery.contains("बैंकिंग") || cleanQuery.contains("बैंक")) {
            val bankingApps = getInstalledApps().filter { it.category == "Banking" }
            if (bankingApps.size > 1) {
                val names = bankingApps.joinToString(", ") { it.displayName }
                return AppLaunchResult.DisambiguationRequired(
                    candidates = bankingApps,
                    prompt = if (isBhojpuri) "कवन बैंक के ऐप खोले के बा? ($names)" else "Aap kaun sa banking app open karna chahte hain? ($names)"
                )
            }
        }

        // 2. Resolve matching app
        val targetApp = findAppByName(cleanQuery) ?: findAppByAlias(cleanQuery)
        if (targetApp == null) {
            return AppLaunchResult.NotFound(
                query = cleanQuery,
                message = if (isBhojpuri) "पंकज जी, $cleanQuery आपके फोन में नइखे मिलल।" else "Pankaj Ji, $cleanQuery aapke phone mein installed nahi mila."
            )
        }

        // 3. Verify installation
        if (!isAppInstalled(targetApp.packageName)) {
            return AppLaunchResult.NotInstalled(
                appName = targetApp.displayName,
                message = if (isBhojpuri) "पंकज जी, \${targetApp.displayName} आपके फोन में इंस्टॉल नइखे।" else "Pankaj Ji, \${targetApp.displayName} aapke phone mein installed nahi hai."
            )
        }

        // 4. Launch Intent Execution
        val intent = getLaunchIntent(targetApp.packageName)
            ?: return AppLaunchResult.Error("Cannot build launch Intent for \${targetApp.displayName}")

        return try {
            context.startActivity(intent)
            AppLaunchResult.Success(
                app = targetApp,
                message = if (isBhojpuri) "जी पंकज, \${targetApp.displayName} खोल देतानी।" else "Ji Pankaj, \${targetApp.displayName} khol raha hoon."
            )
        } catch (e: Exception) {
            AppLaunchResult.Error("Launch failed: \${e.localizedMessage}")
        }
    }

    private fun extractAppQuery(raw: String): String {
        return raw.lowercase()
            .replace(Regex("^(pankaj ji|pankaj|hey pankaj ji|namaste ji)\\\\s*", RegexOption.IGNORE_CASE), "")
            .replace(Regex("\\\\b(open|launch|kholo|khol do|kholna|chalao|kholiye)\\\\b", RegexOption.IGNORE_CASE), "")
            .replace(Regex("\\\\b(app|application|वाला ऐप)\\\\b", RegexOption.IGNORE_CASE), "")
            .trim()
    }

    private fun generateAliases(name: String): List<String> {
        val lower = name.lowercase()
        val list = mutableListOf(lower)
        if (lower == "whatsapp") list.addAll(listOf("wa", "व्हाट्सएप", "वाट्सएप"))
        if (lower.contains("youtube")) list.addAll(listOf("yt", "यूट्यूब"))
        if (lower.contains("chrome")) list.addAll(listOf("browser", "क्रोम"))
        if (lower.contains("settings")) list.addAll(listOf("सेटिंग्स", "सेटिंग"))
        return list
    }

    private fun categorizeApp(pkg: String): String {
        return when {
            pkg.contains("bank") || pkg.contains("paisa") || pkg.contains("paytm") || pkg.contains("phonepe") -> "Banking"
            pkg.contains("whatsapp") || pkg.contains("telegram") || pkg.contains("messaging") -> "Communication"
            pkg.contains("youtube") || pkg.contains("spotify") || pkg.contains("music") -> "Media"
            else -> "Tools"
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/core/telecom/CallManager.kt',
    name: 'CallManager.kt',
    language: 'kotlin',
    category: 'Core',
    content: `package com.pankajji.assistant.core.telecom

import android.content.Context
import android.content.Intent
import android.net.Uri
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CallManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    fun initiateCall(phoneNumber: String, useDirectCall: Boolean = false): Boolean {
        val cleanNumber = phoneNumber.replace("\\\\s+".toRegex(), "")
        val intentAction = if (useDirectCall) Intent.ACTION_CALL else Intent.ACTION_DIAL
        val callIntent = Intent(intentAction, Uri.parse("tel:$cleanNumber")).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        return try {
            context.startActivity(callIntent)
            true
        } catch (e: Exception) {
            false
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/core/telecom/MessageSender.kt',
    name: 'MessageSender.kt',
    language: 'kotlin',
    category: 'Core',
    content: `package com.pankajji.assistant.core.telecom

import android.content.Context
import android.content.Intent
import android.net.Uri
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MessageSender @Inject constructor(
    @ApplicationContext private val context: Context
) {
    fun sendSms(phoneNumber: String, message: String): Boolean {
        val intent = Intent(Intent.ACTION_SENDTO).apply {
            data = Uri.parse("smsto:\${phoneNumber.trim()}")
            putExtra("sms_body", message)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        return try {
            context.startActivity(intent)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun sendWhatsApp(phoneNumber: String, message: String): Boolean {
        val cleanNumber = phoneNumber.replace("+", "").replace("\\\\s+".toRegex(), "")
        val uri = Uri.parse("https://api.whatsapp.com/send?phone=$cleanNumber&text=\${Uri.encode(message)}")
        val intent = Intent(Intent.ACTION_VIEW, uri).apply {
            setPackage("com.whatsapp")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        return try {
            context.startActivity(intent)
            true
        } catch (e: Exception) {
            false
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/domain/tools/OpenAppTool.kt',
    name: 'OpenAppTool.kt',
    language: 'kotlin',
    category: 'Domain',
    content: `package com.pankajji.assistant.domain.tools

import com.pankajji.assistant.core.launcher.AppLauncher
import com.pankajji.assistant.core.launcher.AppLaunchResult
import javax.inject.Inject

class OpenAppTool @Inject constructor(
    private val appLauncher: AppLauncher
) : Tool {

    override val name = "OpenAppTool"
    override val description = "Launches an installed Android app using Intent and PackageManager"
    override val parameters = mapOf("app" to "Application name", "packageName" to "Package identifier")
    override val requiredPermissions = emptyList<String>()
    override val riskLevel = RiskLevel.LOW

    override suspend fun execute(params: Map<String, Any>): ToolResult {
        val appName = params["app"] as? String ?: return ToolResult(false, "App name missing")
        return when (val result = appLauncher.launchApp(appName)) {
            is AppLaunchResult.Success -> ToolResult(true, result.message, result.app)
            is AppLaunchResult.NotInstalled -> ToolResult(false, result.message)
            is AppLaunchResult.NotFound -> ToolResult(false, result.message)
            is AppLaunchResult.DisambiguationRequired -> ToolResult(false, result.prompt, result.candidates)
            is AppLaunchResult.Error -> ToolResult(false, result.reason)
        }
    }

    override suspend fun verify(result: ToolResult): Boolean = result.success
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/domain/planner/TaskPlanner.kt',
    name: 'TaskPlanner.kt',
    language: 'kotlin',
    category: 'Domain',
    content: `package com.pankajji.assistant.domain.planner

import com.pankajji.assistant.domain.tools.Tool
import com.pankajji.assistant.domain.tools.ToolRegistry
import javax.inject.Inject
import javax.inject.Singleton

data class PlannedStep(
    val stepIndex: Int,
    val toolName: String,
    val description: String,
    val parameters: Map<String, Any>
)

data class ExecutionPlan(
    val steps: List<PlannedStep>,
    val requiresPreApproval: Boolean
)

@Singleton
class TaskPlanner @Inject constructor(
    private val toolRegistry: ToolRegistry
) {
    fun planTask(userIntent: String): ExecutionPlan {
        // Multi-step task planner logic converting natural language into sequential tools
        val steps = mutableListOf<PlannedStep>()
        if (userIntent.contains("weather") && userIntent.contains("umbrella")) {
            steps.add(PlannedStep(1, "WeatherTool", "Fetch tomorrow rain probability", mapOf("city" to "Varanasi")))
            steps.add(PlannedStep(2, "ReminderTool", "Create umbrella reminder if rain > 30%", mapOf("title" to "Umbrella Reminder")))
        }
        return ExecutionPlan(steps, requiresPreApproval = false)
    }
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/data/database/PankajDatabase.kt',
    name: 'PankajDatabase.kt',
    language: 'kotlin',
    category: 'Data',
    content: `package com.pankajji.assistant.data.database

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "memory_table")
data class MemoryEntity(
    @PrimaryKey val id: String,
    val type: String,
    val memoryKey: String,
    val memoryValue: String,
    val timestamp: Long
)

@Dao
interface MemoryDao {
    @Query("SELECT * FROM memory_table ORDER BY timestamp DESC")
    fun getAllMemories(): Flow<List<MemoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMemory(memory: MemoryEntity)

    @Delete
    suspend fun deleteMemory(memory: MemoryEntity)

    @Query("DELETE FROM memory_table")
    suspend fun clearAll()
}

@Database(entities = [MemoryEntity::class], version = 1, exportSchema = false)
abstract class PankajDatabase : RoomDatabase() {
    abstract fun memoryDao(): MemoryDao
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/feature/home/components/AiOrb.kt',
    name: 'AiOrb.kt',
    language: 'kotlin',
    category: 'Feature',
    content: `package com.pankajji.assistant.feature.home.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

enum class OrbState { IDLE, LISTENING, THINKING, SPEAKING, ERROR, SUCCESS }

@Composable
fun AiOrb(
    state: OrbState,
    amplitude: Float,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "orbPulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.95f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseScale"
    )

    val coreColor = when (state) {
        OrbState.LISTENING -> Color(0xFFFF9933) // Saffron gold
        OrbState.THINKING -> Color(0xFF00E5FF)  // Quantum cyan
        OrbState.SPEAKING -> Color(0xFF138808)  // Radiant Indian green
        OrbState.ERROR -> Color(0xFFFF1744)     // Crimson alert
        OrbState.SUCCESS -> Color(0xFF00E676)   // Success emerald
        OrbState.IDLE -> Color(0xFFFFAB40)      // Amber idle
    }

    Canvas(modifier = modifier.size(240.dp)) {
        val radius = (size.minDimension / 2f) * (pulseScale + (amplitude * 0.4f))
        val center = Offset(size.width / 2f, size.height / 2f)

        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(coreColor.copy(alpha = 0.8f), coreColor.copy(alpha = 0.15f), Color.Transparent),
                center = center,
                radius = radius * 1.3f
            ),
            radius = radius * 1.3f,
            center = center
        )

        drawCircle(
            color = coreColor,
            radius = radius * 0.7f,
            center = center
        )
    }
}
`
  },
  {
    path: 'app/src/main/java/com/pankajji/assistant/widget/PankajJiWidget.kt',
    name: 'PankajJiWidget.kt',
    language: 'kotlin',
    category: 'Widget',
    content: `package com.pankajji.assistant.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.pankajji.assistant.MainActivity
import com.pankajji.assistant.R

class PankajJiWidgetReceiver : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            val intent = Intent(context, MainActivity::class.java).apply {
                action = "ACTION_START_LISTENING"
            }
            val pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val views = RemoteViews(context.packageName, R.layout.widget_pankaj_ji).apply {
                setOnClickPendingIntent(R.id.btn_widget_talk, pendingIntent)
            }
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
`
  }
];
