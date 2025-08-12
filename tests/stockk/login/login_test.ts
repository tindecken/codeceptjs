Feature('Stockk - Login');

Scenario('Login to stockk',  async ({ I, stockkLoginPage  }) => {
    await I.amOnPage('')
    await stockkLoginPage.setUserName("hnu@sucafina.com");
    await stockkLoginPage.setPassword("Dev@1234");
    await stockkLoginPage.clickLoginButton();
    
});
