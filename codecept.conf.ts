import {
  setHeadlessWhen,
  setCommonPlugins
} from '@codeceptjs/configure';
import {
  appSettings
} from './appSettings';

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './tests/**/*_test.ts',
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
    rightToolbarPage: "./pages/rightToolbar.ts",
  },
  name: 'codeceptjs',
  fullPromiseBased: true,
  plugins: {
    // Disable default screenshot plugin
    screenshotOnFail: {
      enabled: true,
      uniqueScreenshotNames: false,
      fullPageScreenshots: true,
    },
    // Enable our custom plugin
    moveScreenshoot: {
      enabled: true,
      require: './plugins/MoveScreenshot.js',
    }
  },
  async bootstrap() {
    console.log('Bootstrapping CodeceptJS...');
  }
}