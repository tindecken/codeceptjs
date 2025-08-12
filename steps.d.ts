/// <reference types='codeceptjs' />

type steps_file = typeof import('./steps_file');
// Import the class types
type LoginPageClass = typeof import('./pages/login').default;
type RightToolbarPageClass = typeof import('./pages/rightToolbar').default;
type StockkLoginPageClass = typeof import('./pages/stockk/login/stockLoginPage').default;
type StockkTopBarClass = typeof import('./pages/stockk/fragments/topBar/stockkTopBar').default;
type StockkSpinnerClass = typeof import('./pages/stockk/fragments/spinner/stockkSpinner').default;

// Export instance types
type loginPage = InstanceType<LoginPageClass>;
type rightToolbarPage = InstanceType<RightToolbarPageClass>;
type stockkLoginPage = InstanceType<StockkLoginPageClass>;
type stockkTopBar = InstanceType<StockkTopBarClass>;
type stockkSpinner = InstanceType<StockkSpinnerClass>;
type FolderHelper = import('./helpers/folderHelper');
type Log = import('./helpers/logHelper');
type ExcelHelper = import('./helpers/excelHelper');
type AIHelper = import('./helpers/aiHelper');


declare namespace CodeceptJS {
  interface SupportObject { I: I, loginPage: loginPage, rightToolbarPage: rightToolbarPage, stockkLoginPage: stockkLoginPage, stockkTopBar: stockkTopBar, stockkSpinner: stockkSpinner }
  interface Methods extends PlaywrightTs, FileSystemTs, FolderHelper, Log, ExcelHelper, AIHelper, ExpectHelper {}
  interface I extends ReturnType<steps_file>, WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
