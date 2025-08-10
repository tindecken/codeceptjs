Feature('logout');

Scenario('Logout Popular Movies app',  async ({ I, rightToolbarPage  }) => {
    await I.amOnPage('')
    await rightToolbarPage.clickUserProfile();
    await rightToolbarPage.clickLogout();
    await I.wait(5)
    await I.seeElement({xpath: '//span[contains(text(),"The username or password you entered is incorrect.")]'})
});
