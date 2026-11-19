
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
        status: 'Not available',
        imagePart: undefined,
      };
    }

    if (!fs.existsSync(path)) {
      return {
        exists: false,
        status: `File not found\nPath: ${path}`,
        imagePart: undefined,
      };
    }

    const mimeType = mime.getType(path);

    if (!mimeType?.startsWith('image/')) {
      return {
        exists: false,
        status: `Not an image file\nPath: ${path}`,
        imagePart: undefined,
      };
    }

    return {
      exists: true,
      status: `Available\nPath: ${path}`,
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
        text: 'Not available',
      };
    }

    if (!fs.existsSync(path)) {
      return {
        exists: false,
        text: `File not found\nPath: ${path}`,
      };
    }

    return {
      exists: true,
      text: `Available\nPath: ${path}`,
      path,
    };
  }

  static async analyze(data: AiAnalysisRequest): Promise<string> {
    const screenshot = this.prepareImageArtifact(data.screenshotPath);
    const video = this.getFileStatus(data.videoPath);
    const trace = this.getFileStatus(data.tracePath);

    const prompt = `
You are a Senior QA Automation Engineer and SDET Expert.

Your task is to identify the root cause of a Playwright automated test failure using all the available information.

Do not immediately assume that the locator is incorrect.

Consider all possible causes, including:

- Application bug
- Timing issue
- Non-unique locator
- Locator changes
- Hidden element
- JavaScript error
- Network error
- Race condition
- Unstable test script

If there is insufficient evidence to confirm the root cause, clearly state that and explain what additional information is required.

==============================
TEST INFORMATION
==============================

Test Name:
${data.testName}

Status:
${data.status}

Duration:
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
(HTML truncated to avoid exceeding the AI token limit)

==============================
CONSOLE ERRORS
==============================

${data.consoleLogs || 'No console errors found'}

==============================
ARTIFACTS
==============================

Screenshot:
${screenshot.status}

Sent to AI:
${screenshot.imagePart ? 'Yes' : 'No'}

Video:
${video.exists ? 'Available' : 'Not available'}
${video.text}

Trace:
${trace.exists ? 'Available' : 'Not available'}
${trace.text}

==============================
ANALYSIS INSTRUCTIONS
==============================

Use ALL available information.

Analysis priorities:

1. Playwright error message.
2. Screenshot, if provided.
3. Page HTML.
4. Artifact information.

If a screenshot is available:

- Analyze the visual state of the page.
- Check whether a modal is present.
- Check whether a popup is present.
- Check whether a loading spinner is visible.
- Check whether a toast notification is visible.
- Check whether an overlay is present.
- Check whether the page is blank.
- Check whether the page failed to render.
- Check whether the target element is actually visible.
- Compare the screenshot with the Playwright error.

If HTML is available:

- Check whether the locator exists.
- Check whether the locator is hidden.
- Check whether the locator is disabled.
- Check whether the locator is inside a modal.
- Check whether the locator is inside a hidden element.
- Look for possible DOM changes.
- Look for possible page rendering or timing issues.

Use console errors to identify:

- JavaScript errors
- Uncaught exceptions
- Failed fetch or XHR requests
- CORS errors
- Failed resource loading
- React, Vue, or Angular errors

Do not make assumptions that are not supported by evidence.

Provide your analysis using the following format:

## Summary

Explain the main cause in 1–2 sentences.

---

## Possible Root Cause

Explain the technical analysis in detail.

---

## Supporting Evidence

List the evidence found from:

- Playwright Error
- Screenshot
- HTML
- Console Error

Clearly distinguish between available evidence and missing evidence.

---

## Confidence

Score: XX%

Explain why you assigned this confidence score.

---

## Severity

Choose one:

- Low
- Medium
- High
- Critical

Explain the reason for the selected severity.

---

## Recommended Solution

Provide the most appropriate steps to fix the issue.

---

## Playwright Best Practices

Provide recommendations to make the test more stable and reduce flaky failures.

=================================================
RULES
=================================================

- Do not invent information.
- Do not make conclusions without supporting evidence.
- If multiple possible causes exist, rank them from most likely to least likely.
- Always explain the reasoning behind each conclusion.
- Use clear, concise, and professional English.
`;

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
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
          model: 'gemini-3.1-flash-lite',
          contents,
        });

        return response.text ?? 'AI did not provide a response.';
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        const isTemporaryError =
          errorMessage.includes('503') ||
          errorMessage.includes('429') ||
          errorMessage.includes('UNAVAILABLE') ||
          errorMessage.includes('RESOURCE_EXHAUSTED');

        if (!isTemporaryError || attempt === maxAttempts) {
          return `Failed to get analysis from Gemini AI:

${errorMessage}

Attempts: ${attempt}/${maxAttempts}`;
        }

        console.log(
          `Gemini temporarily unavailable. Retrying (${attempt}/${maxAttempts})...`,
        );

        await new Promise((resolve) =>
          setTimeout(resolve, attempt * 2000),
        );
      }
    }

    return 'Gemini analysis failed after all retry attempts.';
  }
}
