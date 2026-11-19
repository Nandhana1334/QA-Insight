# QA Insight – Intelligent Test Automation Framework

## Overview

QA Insight is a TypeScript-based test automation framework built using Playwright. It is designed to automate web application workflows, capture execution evidence, and provide intelligent analysis of test failures.

The framework combines reusable automation components with centralized reporting and AI-assisted failure analysis to make debugging easier and improve test maintenance.

## Key Features

- **Browser Automation:** End-to-end testing using Playwright and TypeScript.
- **Page Object Model:** Reusable page classes for better test organization and maintainability.
- **Custom Fixtures:** Shared test setup and reusable browser context.
- **Execution Logging:** Step-level logging to track test execution.
- **Failure Evidence Collection:** Captures screenshots, videos, console errors, and error context.
- **Custom Test Reporter:** Collects failed test details and triggers failure analysis.
- **AI-Assisted Failure Analysis:** Integrates with the Gemini API to analyze test failures using available execution evidence.
- **HTML Reporting:** Generates Playwright HTML reports for reviewing test results.

## Technology Stack

| Technology | Purpose |
|---|---|
| TypeScript | Programming language |
| Playwright | Browser automation |
| Node.js | Runtime environment |
| Gemini API | AI-assisted failure analysis |
| Git | Version control |
| GitHub Actions | CI/CD workflow |

## Project Structure

```text
QA-Insight/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── fixtures/
│   └── base-test.ts
│
├── pages/
│   ├── base.page.ts
│   ├── dashboard.page.ts
│   └── login.page.ts
│
├── reporters/
│   └── ai-reporter.ts
│
├── tests/
│   └── e2e-shopping.spec.ts
│
├── utils/
│   ├── ai-helper.ts
│   ├── ai-types.ts
│   └── step-logger.ts
│
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Framework Workflow

1. Playwright starts the browser and executes the test cases.
2. Reusable page objects handle browser interactions.
3. Custom fixtures provide shared test setup.
4. Step logging records important test actions.
5. When a test fails, the framework collects available execution evidence.
6. The custom reporter sends the failure details and available evidence to the AI analysis component.
7. Gemini is used to generate a technical explanation and recommended solution when the API is available.
8. Playwright HTML reporting provides an overview of test execution.

## Setup and Installation

### Prerequisites

- Node.js
- npm
- Visual Studio Code (recommended)

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browser

```bash
npx playwright install chromium
```

### 3. Configure Gemini API

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key
```

Keep the `.env` file private. Do not commit API keys to version control.

### 4. Run the test suite

```bash
npx playwright test
```

### 5. Run tests in headed mode

```bash
npx playwright test --headed
```

### 6. View the HTML report

```bash
npx playwright show-report
```

## AI-Assisted Failure Analysis

The framework includes an AI analysis component that uses available test execution information to investigate failures.

The analysis considers:

- Playwright assertion errors
- Page HTML
- Browser console errors
- Screenshots

The intended output includes:

- Failure summary
- Possible root cause
- Supporting evidence
- Confidence assessment
- Severity
- Recommended solution
- Playwright best practices

Video and trace artifacts are also collected as execution evidence, although they are not currently uploaded to Gemini for direct analysis.

AI analysis depends on Gemini API availability and valid API access. If the service is unavailable, the framework reports the API error while retaining the original Playwright failure information.

## Future Improvements

- Rule-based failure classification
- Enhanced AI-powered root-cause analysis
- Structured failure reports
- Test execution dashboard
- API automation integration
- Cross-browser execution
- Improved CI/CD reporting
- Historical test failure tracking



