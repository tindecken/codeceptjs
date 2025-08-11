const Helper = require('@codeceptjs/helper');
import fs from 'fs';
import path from 'path';

class FolderHelper extends Helper {
  // Store folder paths by test ID
  testFolders = {};

  _before(test) {
    // Create folder and store path
    const testName = test.title.replace(/\s+/g, '_').replace(/[^a-z0-9_-]/gi, '');
    const dateTime = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const folderName = `${testName}_${dateTime}`;
    const folderPath = path.join('output', folderName);
    
    fs.mkdirSync(folderPath, { recursive: true });
    
    // Store in global object
    this.testFolders[test.id] = folderPath;
    test.ctx.testFolder = folderPath; // Still set for test access
  }

  // Public method to get folder path
  getTestFolder(testId) {
    return this.testFolders[testId];
  }
}

export = FolderHelper;
