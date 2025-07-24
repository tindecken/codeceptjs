const { I } = inject();

export = {

  // setting locators
  userName: {xpath: '//input[@formcontrolname="userName"]'},
  password: {xpath: '//input[@formcontrolname="password"]'},
  loginButton: {xpath: '//button/span[text()="Log in"]'},

  // setting methods
  login() {
    I.fillField(this.userName, 'admin');
    I.fillField(this.password, 'admin');
    I.click(this.loginButton);
  }
}
