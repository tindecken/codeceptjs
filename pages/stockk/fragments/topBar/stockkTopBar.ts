const { I, stockkSpinner } = inject();

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
  async switchCompany(company: string): Promise<void> {
    await I.click(this.#avatarBlock);
    const listCompanies = await this.getListCompanies();
    if (!listCompanies.includes(company)) {
      throw new Error(`Company ${company} not found`);
    }
    const activeCompany = await this.getActiveCompany();
    if (activeCompany === company) {
      // Click on Your Account to close the dialog
      I.log(`Company ${company} was already active, don't need to switch company`);
      await I.click(`${this.#container}//span[normalize-space(text())='Your accounts']`);
      return
    }
    // Click to swith company
    var companyLocator = `${this.#container}//p[contains(@class,'company') and normalize-space(text())='${company}']`;
    await I.click(companyLocator);
    await I.log(`Switched company to: ${company}`);
    await stockkSpinner.waitForAllSpinnerToDisappear();
  }
  async getListCompanies(): Promise<string[]> {
    let listCompanies: string[] = [];
    const companyLocators = `${this.#container}//p[contains(@class,'company')]`;
    const companies = await I.grabTextFromAll(companyLocators);
    await I.log("List of companies: ");
    for (const company of companies) {
      listCompanies.push(company);
      await I.log(company);
    }
    return listCompanies;
  }
  async getActiveCompany(): Promise<string> {
    const activeCompanyLocator = `${this.#container}//div/span[normalize-space(text())='Active']/following-sibling::p[contains(@class,'company')]`;
    const activeCompany = await I.grabTextFrom(activeCompanyLocator);
    await I.log("Active company: " + activeCompany);
    return activeCompany;
  }
}


// Export both the class and an instance
export default stockkTopBar;

// For CodeceptJS compatibility
module.exports = new stockkTopBar();
module.exports.default = stockkTopBar;