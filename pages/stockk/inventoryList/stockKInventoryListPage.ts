const { I, stockkSpinner, stockkToastMessage } = inject();
class stockKInventoryListPage {
  #container: string;
  #btnImport: string;
  ImportFileDialog: ImportFileDialog;
  stockkToastMessage: stockkToastMessage;
  

  constructor() {
    this.#container = '//stockk-inventory-list';
    this.#btnImport = `${this.#container}//button[.//span[normalize-space(.)='Import']]`;
    this.ImportFileDialog = new ImportFileDialog();
    this.stockkToastMessage = stockkToastMessage;
  }

  async ClickImportButton(): Promise<void> {
    await I.waitForVisible(this.#btnImport, 15);
    await I.click(this.#btnImport);
    await I.log('Clicked Import button');
    await stockkSpinner.waitForAllSpinnerToDisappear();
  }
}

class ImportFileDialog {
  #container: string;
  #btnImport: string;
  #btnCancel: string
  #linkBrowse: string;
  
  constructor() {
    this.#container = '//stockk-inventory-import-file//div[@role="dialog"]';
    this.#btnImport = `${this.#container}//button[.//span[normalize-space(.)='Import']]`;
    this.#btnCancel = `${this.#container}//button[.//span[normalize-space(.)='Cancel']]`;
    this.#linkBrowse = `${this.#container}//a[normalize-space(.)='browse']`;
  }
  async ClickImportButton(): Promise<void> {
    await I.waitForVisible(this.#btnImport, 15);
    await I.click(this.#btnImport);
    await I.log('Clicked Import button in dialog');
    await stockkSpinner.waitForAllSpinnerToDisappear();
  }
  async ClickCancelButton(): Promise<void> {
    await I.waitForVisible(this.#btnCancel, 15);
    await I.click(this.#btnCancel);
    await I.log('Clicked Cancel button in dialog');
    await stockkSpinner.waitForAllSpinnerToDisappear();
  }

  async SelectFile(filePath: string): Promise<void> {
    // Check if file exists before attempting to select it
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }
    
    await I.usePlaywrightTo('handle file chooser', async ({ page }) => {
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.click(this.#linkBrowse);  // Click the element that triggers the dialog
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(filePath);
    });
    await I.log(`Selected file: ${filePath}`);
  }
}

// Export both the class and an instance
export default stockKInventoryListPage;

// For CodeceptJS compatibility
module.exports = new stockKInventoryListPage();
module.exports.default = stockKInventoryListPage;
