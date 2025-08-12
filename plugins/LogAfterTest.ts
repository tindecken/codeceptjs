// plugins/LogAfterTest.ts
const codeceptEvt = require("codeceptjs").event;
import path from "path";

module.exports = async function () {
  codeceptEvt.dispatcher.on(codeceptEvt.test.after, async function (test) {
    try {
      
      const folderHelper = codeceptjs.container.helpers("FolderHelper");
      if (!folderHelper) return;

      const folderPath = folderHelper.getTestFolder(test.id);
      if (!folderPath) return;

      const logHelper = codeceptjs.container.helpers("Log");
      const logPath = path.join(folderPath, "log.txt");
      if (test.state === "failed") {
        // Get full error details including stack trace
        const errorDetails = test.err.stack || test.err.toString();
        logHelper.logResult(logPath, errorDetails);
      } else if (test.state === "passed") {
        logHelper.logResult(logPath, "Test PASSED");
      }
    } catch (error) {
      console.error("Error in LogAfterTest plugin:", error);
    }
  });
};
