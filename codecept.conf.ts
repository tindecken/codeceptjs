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
      trace: true,
      video: true,
    },
    Expect: {
      require: '@codeceptjs/expect-helper'
    },
    FolderHelper: {
      require: './helpers/folderHelper.ts',
    },
    FileSystem: {},
    Log: {
      require: './helpers/logHelper.ts',
    },
    ExcelHelper: {
      require: './helpers/excelHelper.ts',
    },
    AIHelper: {
      require: './helpers/aiHelper.ts',
    }
  },
  include: {
    I: './steps_file',
    loginPage: "./pages/login.ts",
    rightToolbarPage: "./pages/rightToolbar.ts",
    stockkLoginPage: "./pages/stockk/login/stockLoginPage.ts",
    stockkTopBar: "./pages/stockk/fragments/topBar/stockkTopBar.ts",
    stockkSpinner: "./pages/stockk/fragments/spinner/stockkSpinner.ts",
    stockkMenu: "./pages/stockk/fragments/menu/stockkMenu.ts",
    stockKInventoryListPage: "./pages/stockk/inventoryList/stockKInventoryListPage.ts",
    stockkToastMessage: "./pages/stockk/fragments/toastMessage/stockkToastMessage.ts",
    stockkTable: "./pages/stockk/fragments/table/stockkTable.ts",
    stockkConfirmPopup: "./pages/stockk/fragments/confirmPopup/stockkConfirmPopup.ts",
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
    moveScreenshootTraceVideo: {
      enabled: true,
      require: './plugins/MoveScreenshotTraceVideo.ts',
    },
    logAfterTest: {
      enabled: true,
      require: './plugins/LogAfterTest.ts',
    },
    AI: {}
  },
  ai: {
    request: async (messages:string) => {
      const OpenAI = require('openai')
      const openai = new OpenAI({ apiKey: appSettings.ai.openAI.apiKey })
  
      const completion = await openai.chat.completions.create({
        model: appSettings.ai.openAI.model,
        messages,
      })
  
      return completion?.choices[0]?.message?.content
    }
  }
}