# Playwright AI-Powered Automation Framework

> _A modular Playwright automation framework built with TypeScript, designed for extensibility and enhanced with AI-powered capabilities._

A reusable end-to-end automation testing framework built with **Playwright** and **TypeScript**, designed using the **Page Object Model (POM)** architecture and enhanced with **AI-assisted failure analysis** powered by Google Gemini.

The framework currently includes an AI extension that analyzes failed Playwright tests using **Google Gemini**, helping QA Engineers understand possible root causes faster through contextual failure analysis.

---

# Why This Project?

Playwright already provides excellent debugging artifacts such as screenshots, videos, and traces.

However, engineers still need to manually inspect those artifacts to determine why a test failed.

This project explores how AI can assist the debugging process by automatically collecting execution artifacts and generating an initial failure analysis.

The goal is **not to replace engineering judgment**, but to reduce investigation time and provide a faster starting point for debugging.

---

## Design Principles

This framework is built around several core principles:

- Modular
- Reusable
- Extensible
- Maintainable
- AI-Enhanced

The architecture is intentionally designed so new capabilities (AI or non-AI) can be added without significantly changing the existing framework.

---

## Current Scope

This repository focuses primarily on **framework architecture and design** rather than providing a large collection of automated test cases.

Only a small number of sample tests are included to demonstrate how the framework is intended to be used.

The emphasis is on building a reusable foundation that can be extended for real-world automation projects.

---

## Features

### Automation Framework

- Playwright + TypeScript
- Page Object Model (POM)
- Reusable Base Page
- Custom Playwright Fixture
- Custom Playwright Reporter
- Automatic HTML Snapshot Collection
- Browser Console Error Collection
- Screenshot on Failure
- Video Recording on Failure
- Playwright Trace Support

### AI Extension

Current AI capability includes:

- AI-assisted failure analysis
- HTML-aware analysis
- Screenshot-aware analysis
- Console error analysis
- Root cause suggestions
- Confidence estimation
- Playwright best practice recommendations

---

## Project Structure

```text
playwright-ai/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
│
├── fixtures/
│   └── base-test.ts
│
├── pages/
│   ├── base.page.ts
│   ├── login.page.ts
│   └── dashboard.page.ts
│
├── reporters/
│   └── ai-reporter.ts
│
├── tests/
│   └── *.spec.ts
│
├── utils/
│   ├── ai-helper.ts
│   ├── ai-types.ts
│   └── step-logger.ts
│
└── README.md
```

---

## Framework Architecture

```text
Playwright Test
        │
        ▼
 Execute Test
        │
        ▼
 Test Passed?
      │
 ┌────┴────┐
 │         │
Yes       No
 │         │
 │         ▼
 │   Collect Execution Artifacts
 │
 │   • Playwright Error
 │   • HTML Snapshot
 │   • Screenshot
 │   • Console Errors
 │   • Video
 │   • Trace
 │
 │         ▼
 │   Build AI Prompt
 │
 │         ▼
 │   Google Gemini
 │
 │         ▼
 │ Root Cause Analysis
 │
 ▼
 Test Finished
```

---

## AI Failure Analysis

When a test fails, the framework automatically gathers contextual information before sending it to Google Gemini.

The collected information includes:

- Playwright error message
- HTML snapshot
- Screenshot (image input)
- Browser console errors
- Video metadata
- Trace metadata

Gemini analyzes the available information and generates:

- Failure summary
- Possible root causes
- Supporting evidence
- Confidence level
- Severity assessment
- Suggested solution
- Playwright best practices

> **Note**
>
> The current AI prompt and analysis output are written in **Bahasa Indonesia**. They can be easily customized by modifying the prompt inside `utils/ai-helper.ts`.

---

## Example AI Analysis

```text
================ PLAYWRIGHT AI REPORT ================

Test
User should add product into cart

Status
FAILED

Playwright Error

locator('#cart') not visible

======================================================

Ringkasan

Element belum dapat diakses karena masih tertutup loading overlay.

Penyebab Kemungkinan

• Loading spinner belum selesai.
• Timing issue.
• Overlay masih aktif.

Confidence

93%

Severity

Medium

Solusi

Lakukan explicit wait terhadap loading spinner sebelum melakukan click.

Best Practice

Pastikan halaman berada pada state yang stabil sebelum melakukan interaksi.
```

---

## AI Configuration

The framework uses the official **Google Gen AI SDK**.

The AI model can be changed inside:

```text
utils/ai-helper.ts
```

Example:

```ts
model: 'gemini-3.5-flash';
```

You may replace it with any model available in your own Gemini account.

For example:

- gemini-3.5-flash
- gemini-3.1-pro
- gemini-3-flash-preview
- or any future supported Gemini model

---

## Technology Stack

| Technology    | Purpose               |
| ------------- | --------------------- |
| Playwright    | UI Automation         |
| TypeScript    | Test Development      |
| Google Gemini | AI Failure Analysis   |
| Node.js       | Runtime               |
| dotenv        | Environment Variables |

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/your-username/playwright-ai.git

cd playwright-ai
```

### Install Dependencies

```bash
npm install
```

### Install Playwright Browsers

```bash
npx playwright install
```

### Configure Environment Variables

Create a `.env` file.

```env
GEMINI_API_KEY=your_api_key
```

---

## Run Tests

Run all tests

```bash
npx playwright test
```

Run a specific file

```bash
npx playwright test tests/login.spec.ts
```

Run headed mode

```bash
npx playwright test --headed
```

Run UI mode

```bash
npx playwright test --ui
```

---

## Generated Test Artifacts

When a test fails, Playwright generates:

- Screenshot
- Video
- Trace

Additionally, this framework collects:

- HTML snapshot
- Browser console errors
- AI-generated failure analysis

---

## Future Enhancements

| Feature                   | Purpose                                                     |
| ------------------------- | ----------------------------------------------------------- |
| Network Request Analysis  | Allow AI to detect failed API/resource requests             |
| Step History Analysis     | Help AI understand the sequence of events before failure    |
| API Testing Module        | Support API automation within the same framework            |
| Visual Regression Testing | Detect unexpected UI changes                                |
| GitHub Actions CI/CD      | Run automated tests on every push                           |
| Allure Report             | Generate rich HTML reports                                  |
| Cross-Browser Execution   | Validate Chromium, Firefox, and WebKit in a single pipeline |

---

## License

This project is intended for learning, experimentation, and portfolio purposes.

Feel free to use it! ❤️
