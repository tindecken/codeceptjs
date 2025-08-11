// plugins/LogAfterTest.ts
const codeceptE = require('codeceptjs').event;
import path from 'path';

module.exports = async function () {
  codeceptE.dispatcher.on(codeceptE.test.after, async function (test) {
    try{
      if (test.state === 'failed') {
        console.log('test error:', test.err);
        const folderHelper = codeceptjs.container.helpers('FolderHelper');
        if (!folderHelper) return;
          
        const folderPath = folderHelper.getTestFolder(test.id);
        if (!folderPath) return;
  
        const logHelper = codeceptjs.container.helpers('Log');
        const logPath = path.join(folderPath, 'log.txt');
        
        // Get full error details including stack trace
        const errorDetails = test.err.stack || test.err.toString();
        logHelper.logResult(logPath, errorDetails);
      }
    } catch (error) {
      console.error('Error in LogAfterTest plugin:', error);
    }
    
  });
};
