const Helper = require('@codeceptjs/helper');
import fs from 'fs';
import path from 'path';

class LogHelper extends Helper {
  /**
   * Static method to log messages
   * @param message The message to log
   */
  async log(message: string): Promise<void> {
    const folderHelper = codeceptjs.container.helpers('FolderHelper');
    console.log('folderHelper', folderHelper)
    if (!folderHelper) return;
    const testInfo = await this.getTestInfo();
    console.log('folderPath', folderPath)
    if (!folderPath) return;
    
    const logFilePath = path.join(folderPath, 'log.txt');
    console.log('logFilePath', logFilePath)
    fs.appendFileSync(logFilePath, message + '\n');
  }
  async getTestInfo() {
    return {
      title: this.scenario.test.title,
      file: this.scenario.test.file,
      tags: this.scenario.test.tags,
      id: this.scenario.test.id,
      // Other available properties
    };
  }
}

export = LogHelper;
