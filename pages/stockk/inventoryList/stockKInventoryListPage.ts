const { I, stockkSpinner } = inject();
import { appSettings } from "../../../appSettings";
class stockKInventoryListPage {
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

  
}

// Export both the class and an instance
export default stockKInventoryListPage;

// For CodeceptJS compatibility
module.exports = new stockKInventoryListPage();
module.exports.default = stockKInventoryListPage;
