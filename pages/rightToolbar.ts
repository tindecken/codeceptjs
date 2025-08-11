const { I, loginPage } = inject();
class rightToolbarPage {
  #container: string;
  #btnLogout: string;
  btnLogin: string;
  btnUserProfile: string;

  constructor() {
    this.#container = '//div[contains(@class, "widgets-container")]';
    this.btnUserProfile = `${this.#container}//button[@aria-label="User Profile"]`;
    this.#btnLogout = `${this.#container}//button[text()="Logout"]`;
    this.btnLogin = `${this.#container}//button[@aria-label="Log In"]`;
  }

  async clickUserProfile(): Promise<void> {
    await I.click(this.btnUserProfile);
  }
  async clickLogout(): Promise<void> {
    await I.click(this.#btnLogout);
  }
  async clickLoginButton(): Promise<void> {
    await I.log('aaaaaaaaaaaaaaaaaaaaaaa')
    await I.click(this.btnLogin);
    await I.waitForElement(loginPage.textLogin, 5);
  }
}

// Export both the class and an instance
export default rightToolbarPage;

// For CodeceptJS compatibility
module.exports = new rightToolbarPage();
module.exports.default = rightToolbarPage;