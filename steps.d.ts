/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file');
type loginPage = typeof import('./pages/login');
type rightToolbarPage = typeof import('./pages/rightToolbar');
type FolderHelper = import('./helpers/folderHelper');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any, loginPage: loginPage, rightToolbarPage: rightToolbarPage }
  interface Methods extends PlaywrightTs, FolderHelper {}
  interface I extends ReturnType<steps_file>, WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
