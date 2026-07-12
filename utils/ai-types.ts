export interface AiAnalysisRequest {
  testName: string;
  status: string;
  duration: number;

  error: string;

  html: string;

  screenshotPath?: string;
  videoPath?: string;
  tracePath?: string;
  consoleLogs: string;
}
