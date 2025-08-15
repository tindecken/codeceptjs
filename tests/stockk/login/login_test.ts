Feature('Stockk - Login');

Scenario('Login to stockk with valid credentials',  async ({ I, stockkLoginPage, stockkTopBar, stockkMenu  }) => {
    await I.amOnPage('')
    await stockkLoginPage.LoginWithHNU();
    await stockkTopBar.seeAvatarBlock();
    await stockkTopBar.switchCompany("SUCSA");
    await stockkMenu.GoToMenu("Inventory", "Import History");
    // const result = await I.askAIFromPageSource("Verify in the table, there's a row with Item Reference column have value: Test_29_07_003, Goods Owner column have value: SUCSA, Warehouse column have value: ANXUS, Title Holder column has empty value, Agent column has empty value, Commodity column has value GREEN COFFEE ARABICA, Origin column has value: VN, Article Description column has value: Test_23_07_003, Certification column has empty value, Purchase Reference column has value: NPBR-20156, Package Quantity column has value: 234, Package Type Size column has value: 60, Package Type column has value: JT, Shipped Gross Weight column has value: 15'000, Shipped Net Weight column has value: 15'000, Landed Gross Weight column has value: 0, Landed Net Weight column has value: 0, Unit Of Measure column has value: KG, Transport Document Number column has value: 123458, Transport Document Date column has value: 24.06.2025, Storage Date column has value: 24.07.2025, Warehouse Code column has value: RPM29, File Number column has value: 1236, Ceel Number column has value: CA810245, Warrant Number column has value: ABC125, Container Number has value: TCKU-396279-7, Ico Mark Number has value: 111/1111/1113, State column has value: SOUND, Customs Status has value: FREE GOODS, Remarks column has empty value, Availability Status has value: Goods in Inventory. Answer format: the answer is yes or no, explain why. Example: the answer is yes, explain: {your explain}");
    // I.expectContain(result, "the answer is yes");
    pause()
});

Scenario('Login to stockk with valid user invalid password',  async ({ I, stockkLoginPage, stockkTopBar }) => {
    await I.amOnPage('')
    await stockkLoginPage.LoginWithValidUserInvalidPassword();
    await I.seeElement(stockkLoginPage.txtInvalidUserPassword);
});

Scenario('Import inventory with invalid file',  async ({ I, stockkLoginPage, stockkTopBar, stockkMenu, stockKInventoryListPage  }) => {
    await I.amOnPage('')
    await stockkLoginPage.LoginWithHNU();
    await stockkTopBar.seeAvatarBlock();
    await stockkTopBar.switchCompany("SUCSA");
    await stockkMenu.GoToMenu("Inventory");
    await stockKInventoryListPage.ClickImportButton();
    await stockKInventoryListPage.ImportFileDialog.SelectFile("testData\\inventories\\importFiles\\4RowsFullData_Template.xlsx");
    await stockKInventoryListPage.ImportFileDialog.ClickImportButton();
    await stockKInventoryListPage.stockkToastMessage.seeErrorToastMessageWithText('- Input string was not in a correct format.')
});

Scenario('Import inventory with valid file',  async ({ I, stockkLoginPage, stockkTopBar, stockkMenu, stockKInventoryListPage }) => {
    await I.amOnPage('')
    await I.findAndReplaceTextInExcelFile('testData\\inventories\\importFiles\\4RowsFullData_Template.xlsx', 'testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', '${ItemReference}', 'Item Reference');
    await I.findAndReplaceTextInExcelFile('testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', 'testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', '${ArticleDescription}', 'Article Description');
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
    pause()
});