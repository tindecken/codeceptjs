Feature('logout');

Scenario('Logout Popular Movies app',  async ({ I, rightToolbar  }) => {
    await I.amOnPage('')
    await rightToolbar.clickUserProfile();
    await rightToolbar.clickLogout();
    await I.wait(5)
    await I.seeElement({xpath: '//span[contains(text(),"The username or password you entered is incorrect.")]'})
});
