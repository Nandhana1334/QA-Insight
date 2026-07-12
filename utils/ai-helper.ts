import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs';
import mime from 'mime';
import type { AiAnalysisRequest } from './ai-types';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export class AiHelper {
  private static prepareImageArtifact(path?: string) {
    if (!path) {
      return {
        exists: false,
        status: '✗ Tidak tersedia',
        imagePart: undefined,
      };
    }

    if (!fs.existsSync(path)) {
      return {
        exists: false,
        status: `✗ Tidak ditemukan\nPath : ${path}`,
        imagePart: undefined,
      };
    }

    const mimeType = mime.getType(path);

    if (!mimeType?.startsWith('image/')) {
      return {
        exists: false,
        status: `✗ Bukan file gambar\nPath : ${path}`,
        imagePart: undefined,
      };
    }

    return {
      exists: true,
      status: `✓ Tersedia\nPath : ${path}`,
      imagePart: {
        inlineData: {
          mimeType,
          data: fs.readFileSync(path, 'base64'),
        },
      },
    };
  }

  private static getFileStatus(path?: string) {
    if (!path) {
      return {
        exists: false,
        text: '✗ Tidak tersedia',
      };
    }

    if (!fs.existsSync(path)) {
      return {
        exists: false,
        text: `✗ Tidak ditemukan\nPath : ${path}`,
      };
    }

    return {
      exists: true,
      text: `✓ Tersedia\nPath : ${path}`,
      path,
    };
  }

  static async analyze(data: AiAnalysisRequest): Promise<string> {
    const screenshot = this.prepareImageArtifact(data.screenshotPath);
    const video = this.getFileStatus(data.videoPath);
    const trace = this.getFileStatus(data.tracePath);

    const prompt = `
Kamu adalah seorang Senior QA Automation Engineer dan SDET Expert.

Tugasmu adalah menentukan root cause (akar penyebab) kegagalan automated test Playwright berdasarkan seluruh informasi yang diberikan.

Jangan langsung menyimpulkan bahwa locator salah.

Pertimbangkan seluruh kemungkinan seperti:

- Bug pada aplikasi
- Timing issue
- Locator tidak unik
- Locator berubah
- Element hidden
- JavaScript Error
- Network Error
- Race Condition
- Test script yang kurang stabil

Jika bukti tidak cukup untuk memastikan penyebabnya, katakan dengan jujur dan jelaskan informasi tambahan yang diperlukan.

==============================
INFORMASI TEST
==============================

Nama Test:
${data.testName}

Status:
${data.status}

Durasi:
${data.duration} ms

==============================
ERROR
==============================

${data.error}

==============================
HTML
==============================

${data.html.substring(0, 8000)}

...
(HTML dipotong agar tidak melebihi batas token AI)

==============================
CONSOLE ERRORS
==============================

${data.consoleLogs || 'Tidak ada console error'}

==============================
ARTEFAK
==============================

Screenshot:
${screenshot.status}

Dikirim ke AI:
${screenshot.imagePart ? '✓ Ya' : '✗ Tidak'}

Video:
${video.exists ? '✓ Ya' : '✗ Tidak'}
${video.text}

Trace:
${trace.exists ? '✓ Ya' : '✗ Tidak'}
${trace.text}


==============================
TUGAS
==============================

Gunakan SELURUH informasi yang tersedia.

Prioritas analisis:

1. Pesan error Playwright.
2. Screenshot (jika dikirim ke AI).
3. HTML halaman.
4. Informasi artefak.

Apabila screenshot tersedia:

- Analisis kondisi visual halaman.
- Periksa apakah terdapat modal.
- Periksa apakah terdapat popup.
- Periksa apakah terdapat loading spinner.
- Periksa apakah terdapat toast notification.
- Periksa apakah terdapat overlay.
- Periksa apakah halaman kosong.
- Periksa apakah halaman gagal dirender.
- Periksa apakah element target benar-benar terlihat.
- Bandingkan screenshot dengan Playwright Error.

Apabila HTML tersedia:

- Cari apakah locator memang ada.
- Cari apakah locator hidden.
- Cari apakah locator disabled.
- Cari apakah locator berada di dalam modal.
- Cari apakah locator berada di dalam element hidden.
- Cari indikasi perubahan DOM.
- Cari kemungkinan page belum selesai render.
- Cari kemungkinan timing issue.

Gunakan Console Error untuk:

- menemukan JavaScript Error
- mendeteksi uncaught exception
- mendeteksi fetch/XHR gagal
- mendeteksi CORS
- mendeteksi gagal memuat resource
- mendeteksi error React/Vue/Angular

Jangan membuat asumsi yang tidak didukung oleh bukti.

Berikan jawaban dengan format:

## Ringkasan

Jelaskan penyebab utama dalam 1–2 kalimat.

---

## Penyebab Kemungkinan

Jelaskan analisis teknis secara rinci.

---

## Bukti yang Mendukung

Sebutkan bukti yang ditemukan dari:

- Playwright Error
- Screenshot
- HTML
- Console Error

---

## Confidence

Nilai: xx%

Alasan pemberian confidence.

---

## Severity

Pilih salah satu:

- Low
- Medium
- High
- Critical

Jelaskan alasannya.

---

## Solusi

Berikan langkah perbaikan yang paling direkomendasikan.

---

## Best Practice Playwright

Berikan rekomendasi agar test menjadi lebih stabil dan tidak mudah flaky.

=================================================
ATURAN
=================================================

- Jangan mengarang informasi.
- Jangan menyimpulkan tanpa bukti.
- Jika terdapat beberapa kemungkinan penyebab, urutkan dari yang paling mungkin.
- Selalu jelaskan alasan setiap kesimpulan.
- Gunakan Bahasa Indonesia yang singkat, jelas, dan profesional.
`;

    try {
      const contents: Array<
        { text: string } | { inlineData: { mimeType: string; data: string } }
      > = [];

      if (screenshot.imagePart) {
        contents.push(screenshot.imagePart);
      }

      contents.push({
        text: prompt,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
      });

      return response.text ?? 'AI tidak memberikan respons.';
    } catch (error) {
      return `Gagal mendapatkan analisis dari Gemini AI:

${error instanceof Error ? error.message : String(error)}`;
    }
  }
}
