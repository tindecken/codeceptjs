import {
  setHeadlessWhen,
  setCommonPlugins
} from '@codeceptjs/configure';
import { appSettings } from './appSettings';
import { output } from 'codeceptjs';
const path = require('path');
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: appSettings.stockK.baseUrl,
      show: true,
    },
    FolderHelper: {
      require: './helpers/folderHelper.ts',
    },
  },
  include: {
    I: './steps_file',
    loginPage: "./pages/login.ts",
  },
  name: 'codeceptjs',
  fullPromiseBased: true,
  plugins: {
    // Disable default screenshot plugin
    screenshotOnFail: {
      enabled: true,
      output: () => {
        return path.join('./output', 'test_something_2025-08-08T10-54-28');
      }
    },
    // Enable our custom plugin
    customScreenshot: {
      enabled: false,
      require: './plugins/CustomScreenshot.js',
      helper: 'Playwright'
    }
  },
  async bootstrap() {
    console.log('Bootstrapping CodeceptJS...');
  }
}