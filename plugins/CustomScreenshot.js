// plugins/CustomScreenshot.js
const event = require('codeceptjs').event;
const path = require('path');

module.exports = async function (config) {
  event.dispatcher.on(event.test.finished, async function (test) {

    const folderHelper = codeceptjs.container.helpers('FolderHelper');
      if (!folderHelper) return;
      
      const folderPath = folderHelper.getTestFolder(test.id);
      console.log('Test id:', test.id);
      if (!folderPath) return;

      const helperName = config.helper || Object.keys(codeceptjs.container.helpers())[0];
      console.log('Using helper:', helperName);
      const helper = codeceptjs.container.helpers(helperName);
      
      
      // 4. Create filename with timestamp
      const fileName = `FAILED_${test.title.replace(/\s+/g, '_')}.png`;
      const fullPath = path.join(folderPath, fileName);
      console.log('Full path for screenshot:', fullPath);

      // 5. Use helper to take screenshot
      try {
        await helper.saveScreenshot(fullPath);
        console.log(`Saved failure screenshot to: ${fullPath}`);
      } catch (e) {
        console.error('Failed to save screenshot:', e);
      }

  });
};
