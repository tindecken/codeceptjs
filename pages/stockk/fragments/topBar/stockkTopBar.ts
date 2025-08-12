const { I } = inject();

class stockkTopBar {
  #container: string;
  #avatarBlock: string;
  constructor() {
    this.#container = '//app-topbar';
    this.#avatarBlock = `${this.#container}//a[.//div[contains(@class,'avatar')]]`;
  }
  async seeAvatarBlock(): Promise<void> {
    await I.seeElement(this.#avatarBlock);
  }
}

// Export both the class and an instance
export default stockkTopBar;

// For CodeceptJS compatibility
module.exports = new stockkTopBar();
module.exports.default = stockkTopBar;