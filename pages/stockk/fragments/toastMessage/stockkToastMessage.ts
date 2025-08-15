const { I } = inject();

class stockkToastMessage {
  async seeErrorToastMessageWithText(errorText: string, timeout: number = 15): Promise<void> {
    const errorToastLocator = '//p-toast//div[contains(@class,"p-toast-message-error")]'
    await I.waitForVisible(errorToastLocator, timeout);
    await I.seeElement(errorToastLocator);
    const toastMessageLocator = '//p-toast//div[contains(@class,"p-toast-detail")]';
    await I.waitForVisible(toastMessageLocator, timeout);
    const toastMessage = await I.grabTextFrom(toastMessageLocator).then((x) => x.trim());
    await I.log("Toast message: [" + toastMessage + "]");
    await I.expectEqual(toastMessage, errorText);
  }
  async seeErrorToastMessageWithoutText(timeout: number = 15): Promise<void> {
    const errorToastLocator = '//p-toast//div[contains(@class,"p-toast-message-error")]'
    await I.waitForVisible(errorToastLocator, timeout).then((x) => x.trim());
    await I.seeElement(errorToastLocator);
    await I.log('See error toast message without text');
  }
  async seeSuccessToastMessageWithText(successText: string, timeout: number = 15): Promise<void> {
    const successToastLocator = '//p-toast//div[contains(@class,"p-toast-message-success")]'
    await I.waitForVisible(successToastLocator, timeout);
    await I.seeElement(successToastLocator);
    const toastMessageLocator = '//p-toast//div[contains(@class,"p-toast-detail")]';
    await I.waitForVisible(toastMessageLocator, timeout);
    const toastMessage = await I.grabTextFrom(toastMessageLocator).then((x) => x.trim());
    await I.log("Toast message: [" + toastMessage + "]");
    await I.expectEqual(toastMessage, successText);
  }
  async seeSuccessToastMessageWithoutText(timeout: number = 15): Promise<void> {
    const successToastLocator = '//p-toast//div[contains(@class,"p-toast-message-success")]'
    await I.waitForVisible(successToastLocator, timeout).then((x) => x.trim());
    await I.seeElement(successToastLocator);
    await I.log('See success toast message without text');
  }
}


// Export both the class and an instance
export default stockkToastMessage;

// For CodeceptJS compatibility
module.exports = new stockkToastMessage();
module.exports.default = stockkToastMessage;