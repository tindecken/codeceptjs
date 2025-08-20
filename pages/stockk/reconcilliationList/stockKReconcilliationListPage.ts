
const { I, stockkToastMessage, stockkTable, stockkSpinner, startReconcilliationDialog } = inject();
class stockKReconcilliationListPage {
  #container: string;
  stockkToastMessage: stockkToastMessage;
  stockkTable: stockkTable;
  startReconcilliationDialog: startReconcilliationDialog;
  
  constructor() {
    this.#container = '//stockk-reconciliation-history-list';
    this.stockkToastMessage = stockkToastMessage;
    this.stockkTable = stockkTable;
    this.startReconcilliationDialog = startReconcilliationDialog;
  }
  async ClickButtonReconcilliationSession(): Promise<void> {
    await I.click(`${this.#container}//button[.//span[normalize-space(.)='Reconciliation Session']]`);
    await stockkSpinner.waitForAllSpinnerInvisible();
  }
}

// Export both the class and an instance
export default stockKReconcilliationListPage;

// For CodeceptJS compatibility
module.exports = new stockKReconcilliationListPage();
module.exports.default = stockKReconcilliationListPage;
