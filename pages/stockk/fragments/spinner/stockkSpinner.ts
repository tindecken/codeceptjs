const { I } = inject();

class stockkSpinner {
  #container: string;
  #spinnerIconInTable: string;
  #txtLoading: string;
  #spinnerIconInLoginPage: string
  constructor() {
    this.#container = '//ngx-spinner';
    this.#spinnerIconInTable = '//p-table//spinnericon';
    this.#txtLoading = '//ngx-spinner//h3[text()="Loading..."]';
    this.#spinnerIconInLoginPage = '//stockk-login//p-progressspinner';
  }
  async waitForAllSpinnerToDisappear(timeout: number = 30): Promise<void> {
    await I.waitForInvisible(this.#spinnerIconInTable, timeout);
    await I.waitForInvisible(this.#txtLoading, timeout);
    await I.waitForInvisible(this.#spinnerIconInLoginPage, timeout);
  }

}

// Export both the class and an instance
export default stockkSpinner;

// For CodeceptJS compatibility
module.exports = new stockkSpinner();
module.exports.default = stockkSpinner;