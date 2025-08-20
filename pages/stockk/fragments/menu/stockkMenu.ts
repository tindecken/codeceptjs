const { I, stockkSpinner } = inject();

class stockkMenu {
  #container: string;
  constructor() {
    this.#container = '//app-menu';
  }
  async ClickLogout(): Promise<void> {
    var logoutLocator = `//span[normalize-space(text())='Log Out']`;
    await I.click(logoutLocator);
    await stockkSpinner.waitForAllSpinnerInvisible();
  }
  async GoToMenu(menuItemLevel1: string, menuItemLevel2?: string): Promise<void> {
    var menuLevel1Locator = `${this.#container}//a//span[normalize-space(text())='${menuItemLevel1}']`;
    await I.click(menuLevel1Locator);
    await stockkSpinner.waitForAllSpinnerInvisible();
    if (menuItemLevel2) {
      var menuLevel2Locator = `${this.#container}//a//span[normalize-space(text())='${menuItemLevel2}']`;
      await I.click(menuLevel2Locator);
      await stockkSpinner.waitForAllSpinnerInvisible();
    }
  }
}

// Export both the class and an instance
export default stockkMenu;

// For CodeceptJS compatibility
module.exports = new stockkMenu();
module.exports.default = stockkMenu;