Feature('Stockk - Inventory');

Scenario('Import inventory with valid file',  async ({ I, stockkLoginPage, stockkTopBar, stockkMenu, stockKInventoryListPage }) => {
    await I.amOnPage('')
    const dateTime = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 13).replace(/(\d{8})(\d{4})/, '$1_$2');
    const _articleDescription = `Import_AUTO_${dateTime}`;
    const _itemReference = `Import_${dateTime}`;
    await I.findAndReplaceTextInExcelFile('testData\\inventories\\importFiles\\4RowsFullData_Template.xlsx', 'testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', '${ItemReference}', _itemReference);
    await I.findAndReplaceTextInExcelFile('testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', 'testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', '${ArticleDescription}', _articleDescription);
    await stockkLoginPage.LoginWithHNU();
    await stockkTopBar.seeAvatarBlock();
    await stockkTopBar.switchCompany("SUCSA");
    await stockkMenu.GoToMenu("Inventory");
    await stockKInventoryListPage.ClickImportButton();
    await stockKInventoryListPage.ImportFileDialog.SelectFile("testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx");
    await stockKInventoryListPage.ImportFileDialog.ClickImportButton();
    await stockKInventoryListPage.stockkToastMessage.seeSuccessToastMessageWithoutText();
    await stockKInventoryListPage.ConfirmPopup.SeeMessage('Review all imported items and edit if needed')
    await stockKInventoryListPage.ConfirmPopup.ClickApproveButton();
    const rowNumber = await stockKInventoryListPage.stockkTable.GetNumberOfRows();
    await I.expectEqual(rowNumber, 10);
    await I.expectEqual('SUCSA', await stockKInventoryListPage.stockkTable.GetCellValueByConditional("Item Reference", `${_itemReference} 1`, 'Goods Owner'));
    await I.expectEqual('RPMNJ', await stockKInventoryListPage.stockkTable.GetCellValueByConditional("Item Reference", `${_itemReference} 1`, 'Warehouse'));
    await I.expectEqual(true, await stockKInventoryListPage.stockkTable.IsCellEditable(1, 'Container Number'));
});

Scenario('Import inventory - check editable cell',  async ({ I, stockkLoginPage, stockkTopBar, stockkMenu, stockKInventoryListPage }) => {
    await I.amOnPage('')
    const dateTime = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 13).replace(/(\d{8})(\d{4})/, '$1_$2');
    const _articleDescription = `Import_AUTO_${dateTime}`;
    const _itemReference = `Import_${dateTime}`;
    await I.findAndReplaceTextInExcelFile('testData\\inventories\\importFiles\\4RowsFullData_Template.xlsx', 'testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', '${ItemReference}', _itemReference);
    await I.findAndReplaceTextInExcelFile('testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', 'testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', '${ArticleDescription}', _articleDescription);
    await stockkLoginPage.LoginWithHNU();
    await stockkTopBar.seeAvatarBlock();
    await stockkTopBar.switchCompany("SUCSA");
    await stockkMenu.GoToMenu("Inventory");
    await stockKInventoryListPage.ClickImportButton();
    await stockKInventoryListPage.ImportFileDialog.SelectFile("testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx");
    await stockKInventoryListPage.ImportFileDialog.ClickImportButton();
    await stockKInventoryListPage.stockkToastMessage.seeSuccessToastMessageWithoutText();
    await I.expectEqual(false, await stockKInventoryListPage.stockkTable.IsCellEditable(1, 'Warehouse'));
    await I.expectEqual(true, await stockKInventoryListPage.stockkTable.IsCellEditable(1, 'Package Quantity'));
    await stockKInventoryListPage.stockkTable.SetCellValue(1, 'Package Quantity', '123');
    await stockKInventoryListPage.stockkTable.SetCellValueByConditional('Purchase Reference', 'AUTO-1', 'Landed Net Weight', '456');
    await stockKInventoryListPage.stockkTable.SetCellValueByConditional('Purchase Reference', 'AUTO-1', 'Ceel Number', '11111');
    await stockKInventoryListPage.stockkTable.SetCellValueByConditional('Purchase Reference', 'AUTO-1', 'Landed Gross Weight', '22222')
    await stockKInventoryListPage.stockkTable.SetHeaderCheckbox(false);
    const state = await stockKInventoryListPage.stockkTable.GetCellValueByConditional('Purchase Reference', 'AUTO-1', 'State')
    await I.expectEqual(state, 'OVER LANDED')
    pause()
});