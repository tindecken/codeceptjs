const { I, stockkSpinner } = inject();

class stockkLoginPage {
  #container: string;
  #inputUserName: string;
  #inputPassword: string;
  #btnLogin: string;
  txtInvalidUserPassword: string

  constructor() {
    this.#container = '//stockk-login';
    this.#inputUserName = `${this.#container}//input[@formcontrolname='userName']`;
    this.#inputPassword = `${this.#container}//input[@formcontrolname='password']`;
    this.#btnLogin = `${this.#container}//button/span[normalize-space(.)="Log in"]`;
    this.txtInvalidUserPassword = `${this.#container}//span[normalize-space(.)="The username or password you entered is incorrect."]`;
  }

  async setUserName(userName: string): Promise<void> {
    await I.log(userName);
    await I.fillField(this.#inputUserName, userName);
  }
  async setPassword(password: string): Promise<void> {
    await I.log(password);
    await I.fillField(this.#inputPassword, password);
  }
  async clickLoginButton(): Promise<void> {
    await I.click(this.#btnLogin);
    await I.log('Clicked login button --> wait 1s');
    await I.wait(1);
    await stockkSpinner.waitForAllSpinnerToDisappear();
  }
}

// Export both the class and an instance
export default stockkLoginPage;

// For CodeceptJS compatibility
module.exports = new stockkLoginPage();
module.exports.default = stockkLoginPage;
