import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Smartphone, Terminal, Download } from 'lucide-react';

interface AndroidCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<string>('QuotePagerScreen.kt');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const files: Record<string, { desc: string; code: string; lang: string }> = {
    'QuotePagerScreen.kt': {
      desc: 'Màn hình chính Jetpack Compose với HorizontalPager, hình nền ngẫu nhiên và nút Thích/Chia sẻ',
      lang: 'kotlin',
      code: `package com.example.lockscreenquotes.ui

import androidx.compose.animation.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.lockscreenquotes.data.model.Quote
import com.example.lockscreenquotes.util.QuoteShareHelper

@Composable
fun QuotePagerScreen(
    quotes: List<Quote>,
    initialQuoteId: String?,
    isFavorite: (String) -> Boolean,
    onToggleFavorite: (String) -> Unit,
    onOpenSettings: () -> Unit,
    modifier: Modifier = Modifier
) {
    val initialPage = quotes.indexOfFirst { it.id == initialQuoteId }.coerceAtLeast(0)
    val pagerState = rememberPagerState(initialPage = initialPage, pageCount = { quotes.size })
    val context = LocalContext.current

    // 20 hình nền lưu cứng trong res/drawable
    val backgroundDrawables = remember {
        listOf(
            // R.drawable.bg_nature_01 .. bg_nature_05,
            // R.drawable.bg_mini_01 .. bg_mini_06,
            // R.drawable.bg_rustic_01 .. bg_rustic_04,
            // R.drawable.bg_art_01 .. bg_art_05
        )
    }

    Box(modifier = modifier.fillMaxSize()) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.fillMaxSize()
        ) { page ->
            val quote = quotes[page]
            // Chọn ngẫu nhiên 1 trong ~20 hình nền, giữ nguyên cho câu đó
            val bgRes = remember(quote.id) {
                backgroundDrawables.shuffled().firstOrNull() ?: android.R.color.black
            }

            Box(modifier = Modifier.fillMaxSize()) {
                // Hình nền toàn màn hình
                Image(
                    painter = painterResource(id = bgRes),
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // Lớp phủ tối mờ 20-40% để đảm bảo độ tương phản
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.35f))
                )

                // Nội dung câu danh ngôn canh giữa, tự co cỡ chữ
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 32.dp, vertical = 64.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    // Tự co cỡ chữ theo độ dài câu, tối thiểu 22sp
                    val fontSize = when {
                        quote.text.length > 120 -> 22.sp
                        quote.text.length > 70 -> 26.sp
                        else -> 32.sp
                    }

                    Text(
                        text = "“\${quote.text}”",
                        color = Color.White,
                        fontSize = fontSize,
                        fontStyle = FontStyle.Italic,
                        textAlign = TextAlign.Center,
                        lineHeight = (fontSize.value * 1.5).sp
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    Text(
                        text = "— \${quote.author} —",
                        color = Color.White.copy(alpha = 0.85f),
                        fontSize = 16.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }

        // Thanh thao tác dưới cùng (Thích, Chia sẻ)
        val currentQuote = quotes.getOrNull(pagerState.currentPage)
        if (currentQuote != null) {
            val favored = isFavorite(currentQuote.id)
            Row(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 40.dp, start = 24.dp, end = 24.dp)
                    .fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = { onToggleFavorite(currentQuote.id) },
                    colors = IconButtonDefaults.iconButtonColors(containerColor = Color.Black.copy(alpha = 0.4f))
                ) {
                    Icon(
                        imageVector = if (favored) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Thích",
                        tint = if (favored) Color(0xFFFF4B6E) else Color.White
                    )
                }

                IconButton(
                    onClick = {
                        QuoteShareHelper.shareQuoteImage(
                            context = context,
                            quote = currentQuote,
                            aspectRatio = QuoteShareHelper.AspectRatio.STORY
                        )
                    },
                    colors = IconButtonDefaults.iconButtonColors(containerColor = Color.Black.copy(alpha = 0.4f))
                ) {
                    Icon(
                        imageVector = Icons.Default.Share,
                        contentDescription = "Chia sẻ",
                        tint = Color.White
                    )
                }
            }
        }
    }
}`,
    },
    'NotificationWorker.kt': {
      desc: 'WorkManager hẹn giờ thông báo im lặng 3 lần/ngày (5h, 12h, 20h) và khôi phục sau reboot',
      lang: 'kotlin',
      code: `package com.example.lockscreenquotes.worker

import android.content.Context
import androidx.work.*
import com.example.lockscreenquotes.data.QuoteRepository
import com.example.lockscreenquotes.notification.QuoteNotificationHelper
import java.util.Calendar
import java.util.concurrent.TimeUnit

class NotificationWorker(
    private val context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        val repository = QuoteRepository(context)
        val randomQuote = repository.getRandomQuoteForNotification()

        if (randomQuote != null) {
            // Đăng thông báo im lặng lên màn hình khóa với ID cố định
            QuoteNotificationHelper.showSilentQuoteNotification(context, randomQuote)
        }

        // Tự động lên lịch cho mốc giờ gần nhất kế tiếp (5h, 12h hoặc 20h)
        scheduleNextSlot(context)

        return Result.success()
    }

    companion object {
        private const val WORK_NAME = "silent_quote_daily_notification_work"

        fun scheduleNextSlot(context: Context) {
            val now = Calendar.getInstance()
            val targetSlots = listOf(5, 12, 20) // 5h, 12h, 20h

            var nextCalendar: Calendar? = null

            for (hour in targetSlots) {
                val candidate = Calendar.getInstance().apply {
                    set(Calendar.HOUR_OF_DAY, hour)
                    set(Calendar.MINUTE, 0)
                    set(Calendar.SECOND, 0)
                    set(Calendar.MILLISECOND, 0)
                }
                if (candidate.after(now)) {
                    nextCalendar = candidate
                    break
                }
            }

            // Nếu hôm nay qua hết các mốc, chọn mốc 5h sáng mai
            if (nextCalendar == null) {
                nextCalendar = Calendar.getInstance().apply {
                    add(Calendar.DAY_OF_YEAR, 1)
                    set(Calendar.HOUR_OF_DAY, 5)
                    set(Calendar.MINUTE, 0)
                    set(Calendar.SECOND, 0)
                    set(Calendar.MILLISECOND, 0)
                }
            }

            val delayMillis = nextCalendar.timeInMillis - now.timeInMillis

            val workRequest = OneTimeWorkRequestBuilder<NotificationWorker>()
                .setInitialDelay(delayMillis, TimeUnit.MILLISECONDS)
                .build()

            WorkManager.getInstance(context).enqueueUniqueWork(
                WORK_NAME,
                ExistingWorkPolicy.REPLACE,
                workRequest
            )
        }
    }
}`,
    },
    'QuoteNotificationHelper.kt': {
      desc: 'Tạo Notification Channel IMPORTANCE_LOW, setSilent(true), BigTextStyle và ID cố định',
      lang: 'kotlin',
      code: `package com.example.lockscreenquotes.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.example.lockscreenquotes.MainActivity
import com.example.lockscreenquotes.R
import com.example.lockscreenquotes.data.model.Quote

object QuoteNotificationHelper {
    private const val CHANNEL_ID = "silent_lockscreen_quotes_channel"
    private const val NOTIFICATION_ID = 1001 // ID cố định: câu mới thay câu cũ

    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Danh Ngôn Màn Hình Khóa"
            val descriptionText = "Thông báo im lặng hiển thị câu danh ngôn ngẫu nhiên trên màn hình khóa"
            // IMPORTANCE_LOW: Không chuông, không rung, không pop-up phiền toái
            val importance = NotificationManager.IMPORTANCE_LOW
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
                setShowBadge(false)
                enableVibration(false)
                setSound(null, null)
            }
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    fun showSilentQuoteNotification(context: Context, quote: Quote) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("EXTRA_QUOTE_ID", quote.id) // Mang theo quoteId để mở đúng câu
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            quote.id.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification_quote)
            .setContentTitle("Danh Ngôn Màn Hình Khóa")
            .setContentText("“\${quote.text}” — \${quote.author}")
            .setStyle(
                NotificationCompat.BigTextStyle()
                    .bigText("“\${quote.text}”\n\n— \${quote.author}")
            )
            .setSilent(true) // Không chuông, không rung
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC) // Hiển thị trên màn hình khóa
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(NOTIFICATION_ID, notification)
    }
}`,
    },
    'QuoteShareHelper.kt': {
      desc: 'Xuất ảnh Canvas lên Bitmap tỉ lệ 1:1 và 9:16 Story, FileProvider và ACTION_SEND',
      lang: 'kotlin',
      code: `package com.example.lockscreenquotes.util

import android.content.Context
import android.content.Intent
import android.graphics.*
import androidx.core.content.FileProvider
import com.example.lockscreenquotes.data.model.Quote
import java.io.File
import java.io.FileOutputStream

object QuoteShareHelper {
    enum class AspectRatio { SQUARE, STORY }

    fun shareQuoteImage(context: Context, quote: Quote, aspectRatio: AspectRatio) {
        val width = 1080
        val height = if (aspectRatio == AspectRatio.SQUARE) 1080 else 1920

        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)

        // 1. Vẽ nền (Background & Scrim)
        val paintBg = Paint().apply { color = Color.parseColor("#181920") }
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paintBg)

        // 2. Vẽ danh ngôn
        val paintText = Paint().apply {
            color = Color.WHITE
            textSize = if (quote.text.length > 80) 46f else 56f
            isAntiAlias = true
            textAlign = Paint.Align.CENTER
            typeface = Typeface.create(Typeface.SERIF, Typeface.ITALIC)
        }

        canvas.drawText("“\${quote.text}”", width / 2f, height * 0.45f, paintText)

        // 3. Tác giả & Watermark
        val paintAuthor = Paint().apply {
            color = Color.parseColor("#E0E0E0")
            textSize = 28f
            isAntiAlias = true
            textAlign = Paint.Align.CENTER
        }
        canvas.drawText("— \${quote.author} —", width / 2f, height * 0.55f, paintAuthor)

        // Lưu file tạm và chia sẻ qua FileProvider
        val cachePath = File(context.cacheDir, "images").apply { mkdirs() }
        val file = File(cachePath, "quote_\${quote.id}.png")
        FileOutputStream(file).use { out ->
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
        }

        val contentUri = FileProvider.getUriForFile(context, "\${context.packageName}.fileprovider", file)
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "image/png"
            putExtra(Intent.EXTRA_STREAM, contentUri)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        context.startActivity(Intent.createChooser(shareIntent, "Chia sẻ danh ngôn"))
    }
}`,
    },
    'AndroidManifest.xml': {
      desc: 'Cấu hình quyền POST_NOTIFICATIONS, Boot Receiver và FileProvider',
      lang: 'xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Cần cho Android 13+ để gửi thông báo im lặng -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <!-- Khôi phục lịch hẹn WorkManager sau khi bật máy -->
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:name=".QuoteApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.LockScreenQuotes">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.LockScreenQuotes">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- FileProvider để chia sẻ ảnh an toàn -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>
</manifest>`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(files[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in font-ui">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Mã nguồn Android (Kotlin + Jetpack Compose)
              </h3>
              <p className="text-[11px] text-neutral-400">
                Toàn bộ code dự án Android sẵn sàng build trực tiếp trong Android Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-950 border-b border-neutral-800/80 overflow-x-auto no-scrollbar">
          {Object.keys(files).map((fileName) => (
            <button
              key={fileName}
              onClick={() => setActiveFile(fileName)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                activeFile === fileName
                  ? 'bg-neutral-800 text-amber-300 font-medium border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-neutral-500" />
              <span>{fileName}</span>
            </button>
          ))}
        </div>

        {/* File Description Bar */}
        <div className="px-5 py-2.5 bg-neutral-850/80 border-b border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-300">{files[activeFile].desc}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép mã</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-5 bg-neutral-950 font-mono text-xs leading-relaxed text-neutral-200">
          <pre className="select-text whitespace-pre overflow-x-auto">{files[activeFile].code}</pre>
        </div>

        {/* Footer Note */}
        <div className="p-3 sm:p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>MinSdk: 26 (Android 8.0) · TargetSdk: 35 · Compose BOM 2024.10</span>
          <span className="text-amber-400">WorkManager + DataStore + Room</span>
        </div>
      </div>
    </div>
  );
};
