// plugins/MoveScreenshot.js
const event = require('codeceptjs').event;
const path = require('path');
const fs = require('fs').promises;

module.exports = async function () {
  event.dispatcher.on(event.test.after, async function (test) {
    // Only proceed for failed tests
    if (test.state !== 'failed') return;

    const folderHelper = codeceptjs.container.helpers('FolderHelper');
    if (!folderHelper) return;
      
    const folderPath = folderHelper.getTestFolder(test.id);
    if (!folderPath) return;

    try {
      // Construct screenshot filename pattern
      const screenshotName = `${test.title.replace(/\s+/g, '_')}.failed.png`;
      const outputPath = path.join(process.cwd(), 'output', screenshotName);
      const destPath = path.join(folderPath, screenshotName);

      // Check if screenshot exists in output folder
      try {
        await fs.access(outputPath);
        // Move the screenshot
        await fs.rename(outputPath, destPath);
        console.log(`Moved failed screenshot to: ${destPath} successfully.`);
      } catch (err) {
        console.log(`No matching screenshot found for test: ${test.title}`);
      }
    } catch (err) {
      console.error(`Error moving screenshot for test ${test.title}:`, err);
    }
  });
};
