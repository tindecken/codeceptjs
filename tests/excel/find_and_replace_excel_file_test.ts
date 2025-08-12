Feature('Excel Helper');

Scenario('Find and replace test in excel file',  async ({ I }) => {
    await I.findAndReplaceTextInExcelFile('testData\\inventories\\importFiles\\4RowsFullData_Template.xlsx', 'testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', '${ItemReference}', 'Item Reference');
    await I.findAndReplaceTextInExcelFile('testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', 'testData\\inventories\\importFiles\\4RowsFullData_Template_Updated.xlsx', '${ArticleDescription}', 'Article Description');
});
