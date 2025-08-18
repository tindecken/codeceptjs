Feature('Stockk - AI');

Scenario('AI Asking',  async ({ I, stockkLoginPage, stockkTopBar  }) => {
    await I.amOnPage('')
    await stockkLoginPage.LoginWithHNU();
    await stockkTopBar.seeAvatarBlock();
    const result = await I.askAIFromPageSource("Verify that there's the welcome message for Lu Tuan Dat, answer format: the answer is yes or no, explain why. Example: the answer is yes, explain: {your explain}");
    I.expectContain(result, "the answer is no");
});

Scenario('AI debugging',  async ({ I, stockkLoginPage, stockkTopBar  }) => {
    await I.amOnPage('')
});

