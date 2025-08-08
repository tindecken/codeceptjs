Feature('login');

Scenario('test something',  async ({ I, loginPage  }) => {
    await I.amOnPage('')
    await loginPage.loginWithUserHNU();
    await I.wait(5)
    await I.seeElement({xpath: '//span[contains(text(),"The username or password you entered is incorrect.")]'})
});
