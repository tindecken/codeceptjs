const { I, stockkSpinner } = inject();
import { appSettings } from "../../../appSettings";
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

  async clickLoginButton(): Promise<void> {
    await I.click(this.#btnLogin);
    await I.log('Clicked login button then wait 1s');
    await I.wait(1);
    await stockkSpinner.waitForAllSpinnerToDisappear();
  }
  async LoginWithHNU(): Promise<void> {
    await I.log('Login with HNU');
    await I.fillField(this.#inputUserName, appSettings.users.hnu.userName);
    await I.fillField(this.#inputPassword, appSettings.users.hnu.password);
    await this.clickLoginButton();
  }
  async LoginWithValidUserInvalidPassword(): Promise<void> {
    await I.log('Login with Invalid User');
    await I.fillField(this.#inputUserName, appSettings.users.hnu.userName);
    await I.fillField(this.#inputPassword, 'invalid password');
    await this.clickLoginButton();
  }
}

// Export both the class and an instance
export default stockkLoginPage;

// For CodeceptJS compatibility
module.exports = new stockkLoginPage();
module.exports.default = stockkLoginPage;
