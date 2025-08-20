Feature('MovieApp - Login');

Scenario('Login Popular Movies app',  async ({ I, rightToolbarPage, loginPage  }) => {
    await I.amOnPage('')
    await rightToolbarPage.clickLoginButton();
    await loginPage.setEmailAddress("tindecken@gmail.com");
    await loginPage.setPassword("12345");
    await loginPage.clickLoginButton();
    await I.seeElement(rightToolbarPage.btnUserProfile);
});
