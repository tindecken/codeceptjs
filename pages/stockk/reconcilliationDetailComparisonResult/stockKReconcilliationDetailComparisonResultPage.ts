const { I, stockkToastMessage, stockkTable } = inject();
class stockKReconcilliationComparisonResultPage {
  #container: string;
  stockkToastMessage: stockkToastMessage;
  stockkTable: stockkTable;
  
  constructor() {
    this.#container = '//stockk-reconciliation-comparison-result';
    this.stockkToastMessage = stockkToastMessage;
    this.stockkTable = stockkTable;
  }
}

// Export both the class and an instance
export default stockKReconcilliationComparisonResultPage;

// For CodeceptJS compatibility
module.exports = new stockKReconcilliationComparisonResultPage();
module.exports.default = stockKReconcilliationComparisonResultPage;
