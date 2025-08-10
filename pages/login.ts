const { I } = inject();

class loginPage {
  #formLogin: string;
  #inputEmailAddress: string;
  #inputPassword: string;
  #btnLogin: string;
  textLogin: string;

  constructor() {
    this.textLogin = '//h2[contains(text(), "Login to the Playwright Stage")]';
    this.#formLogin = '//form';
    this.#inputEmailAddress = `${this.#formLogin}//input[@name="email"]`;
    this.#inputPassword = `${this.#formLogin}//input[@name="password"]`;
    this.#btnLogin = `${this.#formLogin}//button[normalize-space(.)="Login"]`;
  }

  async setEmailAddress(email: string): Promise<void> {
    await I.fillField(this.#inputEmailAddress, email);
  }
  async setPassword(password: string): Promise<void> {
    await I.fillField(this.#inputPassword, password);
  }
  async clickLoginButton(): Promise<void> {
    await I.click(this.#btnLogin);
  }
}

// For inheritance
module.exports = new loginPage();
export = loginPage;
