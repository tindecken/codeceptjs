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
type StockkMenuClass = typeof import('./pages/stockk/fragments/menu/stockkMenu').default;
type stockkMenu = InstanceType<StockkMenuClass>;
type StockKInventoryListPageClass = typeof import('./pages/stockk/inventoryList/stockKInventoryListPage').default;
type stockKInventoryListPage = InstanceType<StockKInventoryListPageClass>;
type StockkToastMessageClass = typeof import('./pages/stockk/fragments/toastMessage/stockkToastMessage').default;
type stockkToastMessage = InstanceType<StockkToastMessageClass>;
type StockkTableClass = typeof import('./pages/stockk/fragments/table/stockkTable').default;
type stockkTable = InstanceType<StockkTableClass>;
type StockkConfirmPopupClass = typeof import('./pages/stockk/fragments/confirmPopup/stockkConfirmPopup').default;
type stockkConfirmPopup = InstanceType<StockkConfirmPopupClass>;

declare namespace CodeceptJS {
  interface SupportObject { I: I, loginPage: loginPage, rightToolbarPage: rightToolbarPage, stockkLoginPage: stockkLoginPage, stockkTopBar: stockkTopBar, stockkSpinner: stockkSpinner, stockkMenu: stockkMenu, stockKInventoryListPage: stockKInventoryListPage, stockkToastMessage: stockkToastMessage, stockkTable: stockkTable, stockkConfirmPopup: stockkConfirmPopup }
  interface Methods extends PlaywrightTs, FileSystemTs, FolderHelper, Log, ExcelHelper, AIHelper, ExpectHelper {}
  interface I extends ReturnType<steps_file>, WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
