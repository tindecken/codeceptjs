const { I } = inject();

class stockkLoginPage {
  #container: string;
  #inputUserName: string;
  #inputPassword: string;
  #btnLogin: string;

  constructor() {
    this.#container = '//stockk-login';
    this.#inputUserName = `${this.#container}//input[@formcontrolname='userName']`;
    this.#inputPassword = `${this.#container}//input[@formcontrolname='password']`;
    this.#btnLogin = `${this.#container}//button/span[normalize-space(.)="Log in"]`;
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
    await I.log('click login button');
    await I.click(this.#btnLogin);
  }
}

// Export both the class and an instance
export default stockkLoginPage;

// For CodeceptJS compatibility
module.exports = new stockkLoginPage();
module.exports.default = stockkLoginPage;
