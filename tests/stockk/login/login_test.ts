Feature('Stockk - Login');

Scenario('Login to stockk with valid credentials',  async ({ I, stockkLoginPage, stockkTopBar  }) => {
    await I.amOnPage('')
    await stockkLoginPage.setUserName("hnu");
    await stockkLoginPage.setPassword("Dev@1234");
    await stockkLoginPage.clickLoginButton();
    await stockkTopBar.seeAvatarBlock();
});

Scenario('Login to stockk with invalid credentials',  async ({ I, stockkLoginPage }) => {
    await I.amOnPage('')
    await stockkLoginPage.setUserName("hnu");
    await stockkLoginPage.setPassword("invalid password");
    await stockkLoginPage.clickLoginButton();
    await I.seeElement(stockkLoginPage.txtInvalidUserPassword);
});
