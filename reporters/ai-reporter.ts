
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

import fs from 'node:fs';
import path from 'node:path';

import { AiHelper } from '../utils/ai-helper';

export default class AiReporter implements Reporter {
  private pendingAnalyses: Promise<void>[] = [];

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== 'failed') return;

    this.pendingAnalyses.push(this.generateAnalysis(test, result));
  }

  private async generateAnalysis(
    test: TestCase,
    result: TestResult,
  ): Promise<void> {
    console.log('\n================ PLAYWRIGHT AI REPORT =================');

    const errorMessage = result.error?.message ?? 'Unknown Error';

    console.log(`Test     : ${test.title}`);
    console.log(`Status   : ${result.status}`);
    console.log(`Duration : ${result.duration} ms`);

    let html = '';
    let consoleLogs = '';

    const htmlAttachment = result.attachments.find(
      (a) => a.name === 'page-html',
    );

    if (htmlAttachment?.path && fs.existsSync(htmlAttachment.path)) {
      html = fs.readFileSync(htmlAttachment.path, 'utf8');
    }

    const consoleAttachment = result.attachments.find(
      (a) => a.name === 'console-errors',
    );

    if (consoleAttachment?.path) {
      consoleLogs = fs.readFileSync(consoleAttachment.path, 'utf8');
    }

    const screenshot = result.attachments.find((a) =>
      a.contentType?.startsWith('image/'),
    );

    const video = result.attachments.find((a) =>
      a.contentType?.startsWith('video/'),
    );

    const trace = result.attachments.find((a) => a.name === 'trace');

    console.log('\n🤖 Gemini is analyzing the test failure...');

    const analysis = await AiHelper.analyze({
      testName: test.title,
      status: result.status,
      duration: result.duration,
      error: errorMessage,
      html,
      consoleLogs,
      screenshotPath: screenshot?.path
        ? path.resolve(screenshot.path)
        : undefined,
      videoPath: video?.path ? path.resolve(video.path) : undefined,
      tracePath: trace?.path ? path.resolve(trace.path) : undefined,
    });

    console.log('\n================ GEMINI ANALYSIS =================\n');
    console.log(analysis);
    console.log('\n==================================================\n');
  }

  async onEnd(): Promise<void> {
    await Promise.all(this.pendingAnalyses);
  }
}
