const { I, stockkSpinner } = inject();
const Helper = require("@codeceptjs/helper");
import { Locator } from "playwright";
import { setValueAutocomplete } from "../../../../helpers/customs/stockKAutocomplete.helper";

class startReconcilliationDialog extends Helper {
  private container: string
  constructor(rootSelector: string = '//stockk-inventory-reciliation-session') {
    super();
    this.container = rootSelector;
  }
  async ClickStartButton(): Promise<void> {
    var logoutXpath = `//span[normalize-space(text())='Start']`;
    await I.click(logoutXpath);
    await stockkSpinner.waitForAllSpinnerInvisible();
  }
  async SetPartyWarehouse(partyWarehouse: string): Promise<void> {
    const partyWarehouseXpath = `${this.container}//p-autocomplete[@formcontrolname= 'partyWarehouseObj']`;
    await setValueAutocomplete(partyWarehouseXpath, partyWarehouse);
  }
}

// Export both the class and an instance
export default startReconcilliationDialog;

// For CodeceptJS compatibility
module.exports = new startReconcilliationDialog();
module.exports.default = startReconcilliationDialog;