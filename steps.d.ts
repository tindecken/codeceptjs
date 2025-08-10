/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file');
// Import the class types
type LoginPageClass = typeof import('./pages/login').default;
type RightToolbarPageClass = typeof import('./pages/rightToolbar').default;

// Export instance types
type loginPage = InstanceType<LoginPageClass>;
type rightToolbarPage = InstanceType<RightToolbarPageClass>;
type FolderHelper = import('./helpers/folderHelper');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any, loginPage: loginPage, rightToolbarPage: rightToolbarPage }
  interface Methods extends Playwright, FolderHelper {}
  interface I extends ReturnType<steps_file>, WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
