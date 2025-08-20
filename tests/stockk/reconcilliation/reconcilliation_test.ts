Feature('Stockk - Reconciliation');

Scenario('Click link in cell',  async ({ I, stockkLoginPage, stockkTopBar, stockkMenu, stockKReconcilliationListPage, stockKReconcilliationDetailComparisonResultPage }) => {
    await I.amOnPage('')
    await stockkLoginPage.LoginWithHNU();
    await stockkTopBar.seeAvatarBlock();
    await stockkTopBar.switchCompany("SUCSA");
    await stockkMenu.GoToMenu("Inventory", "Reconciliation");
    await stockKReconcilliationListPage.stockkTable.ClickLinkInCell("Reconciliation ID", "2ae2ed48-f50a-48c5-bbc5-868062e42b8d")
    const tooltip = await stockKReconcilliationDetailComparisonResultPage.stockkTable.GetCellTooltipByConditionalAsync("Goods Owners Purchase Reference", "NPBR-20156", "Whs Keeper Package Quantity")
    await I.expectEqual(tooltip, "Original: 240")
    await stockKReconcilliationDetailComparisonResultPage.stockkTable.SetCellValueByConditional("Goods Owners Purchase Reference", "NPBR-20156", "Goods Owner Comment", "Commentttttttttt test")
    pause()
});

Scenario('start new reconcilliation',  async ({ I, stockkLoginPage, stockkTopBar, stockkMenu, stockKReconcilliationListPage, stockKReconcilliationDetailComparisonResultPage }) => {
    await I.amOnPage('')
    await stockkLoginPage.LoginWithHNU();
    await stockkTopBar.seeAvatarBlock();
    await stockkTopBar.switchCompany("SUCSA");
    await stockkMenu.GoToMenu("Inventory", "Reconciliation");
    await stockKReconcilliationListPage.ClickButtonReconcilliationSession();
    await stockKReconcilliationListPage.startReconcilliationDialog.SetPartyWarehouse("Annex");
});