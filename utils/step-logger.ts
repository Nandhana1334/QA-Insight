export class StepLogger {
  public static readonly steps: string[] = [];

  static log(step: string) {
    this.steps.push(step);
  }

  static clear() {
    this.steps.length = 0;
  }

  static getAll() {
    return [...this.steps];
  }
}
