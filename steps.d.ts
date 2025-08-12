/// <reference types='codeceptjs' />

type steps_file = typeof import('./steps_file');
// Import the class types
type LoginPageClass = typeof import('./pages/login').default;
type RightToolbarPageClass = typeof import('./pages/rightToolbar').default;
type StockkLoginPageClass = typeof import('./pages/stockk/stockkLogin').default;

// Export instance types
type loginPage = InstanceType<LoginPageClass>;
type rightToolbarPage = InstanceType<RightToolbarPageClass>;
type stockkLoginPage = InstanceType<StockkLoginPageClass>;
type FolderHelper = import('./helpers/folderHelper');
type Log = import('./helpers/logHelper');
type ExcelHelper = import('./helpers/excelHelper');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any, loginPage: loginPage, rightToolbarPage: rightToolbarPage, stockkLoginPage: stockkLoginPage }
  interface Methods extends PlaywrightTs, FileSystemTs, FolderHelper, Log, ExcelHelper {}
  interface I extends ReturnType<steps_file>, WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
