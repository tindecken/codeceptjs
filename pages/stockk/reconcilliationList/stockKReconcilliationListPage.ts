const { I, stockkToastMessage, stockkTable } = inject();
class stockKReconcilliationListPage {
  #container: string;
  stockkToastMessage: stockkToastMessage;
  stockkTable: stockkTable;
  
  constructor() {
    this.#container = '//stockk-reconciliation-history-list';
    this.stockkToastMessage = stockkToastMessage;
    this.stockkTable = stockkTable;
  }
}

// Export both the class and an instance
export default stockKReconcilliationListPage;

// For CodeceptJS compatibility
module.exports = new stockKReconcilliationListPage();
module.exports.default = stockKReconcilliationListPage;
