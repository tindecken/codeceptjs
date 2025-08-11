const Helper = require('@codeceptjs/helper');

import fs from 'fs';
import path from 'path';

class LogHelper extends Helper {
  log(message: string): void {
    const currentTest = codeceptjs.store.currentTest;
    const currentStep = codeceptjs.store.currentStep;
    console.log('currentStep', currentStep);

    
    // Safely access test context and testFolder with fallback
    const ctx = (currentTest as any)?.ctx;
    if (!ctx) {
      console.error('Test context not found');
      throw new Error('Test context not found');
    }
    const logDir = ctx.testFolder;
    const logPath = path.join(logDir, 'log.txt');

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const timestamp = new Date().toISOString();
    const actor = currentStep.metaStep?.actor ? `${currentStep.metaStep.actor}.` : '';
    const stepName = currentStep.metaStep?.name || '';
    const logMessage = `[${timestamp}] ${actor}${stepName} - ${message}\n`;
    fs.appendFileSync(logPath, logMessage, 'utf8');
  }
  logResult(logPath: string, message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log('logMessage', logMessage);
    fs.appendFileSync(logPath, logMessage, 'utf8');
  }
}

export = LogHelper;
