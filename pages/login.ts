const { I } = inject();
import { appSettings } from "../appSettings";

export = {

  // setting locators
  userName: {xpath: '//input[@formcontrolname="userName"]'},
  password: {xpath: '//input[@formcontrolname="password"]'},
  loginButton: {xpath: '//button/span[text()="Log in"]'},

  // setting methods
  loginWithUserHNU() {
    I.fillField(this.userName, appSettings.users.hnu.userName);
    I.fillField(this.password, appSettings.users.hnu.password);
    I.click(this.loginButton);
  }
}
