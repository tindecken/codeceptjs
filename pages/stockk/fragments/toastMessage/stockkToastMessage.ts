const { I } = inject();

class stockkToastMessage {
  /**
   * Verifies that an error toast message appears with the specified text content.
   * This function waits for an error toast to be visible, checks its presence, 
   * extracts the message text, and validates it matches the expected error text.
   * 
   * @param errorText - The expected error message text to validate against
   * @param timeout - Maximum time to wait for the toast message to appear (default: 15 seconds)
   * @throws Will throw an error if the toast message doesn't appear within the timeout
   * @throws Will throw an error if the actual message text doesn't match the expected errorText
   * @example
   * await stockkToastMessage.seeErrorToastMessageWithText('Input string was not in a correct format.');
   */
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
  
  /**
   * Verifies that an error toast message appears without validating specific text content.
   * This function waits for an error toast to be visible and confirms its presence,
   * but does not check the actual message text.
   * 
   * @param timeout - Maximum time to wait for the toast message to appear (default: 15 seconds)
   * @throws Will throw an error if the error toast message doesn't appear within the timeout
   * @example
   * await stockkToastMessage.seeErrorToastMessageWithoutText();
   */
  async seeErrorToastMessageWithoutText(timeout: number = 15): Promise<void> {
    const errorToastLocator = '//p-toast//div[contains(@class,"p-toast-message-error")]'
    await I.waitForVisible(errorToastLocator, timeout);
    await I.seeElement(errorToastLocator);
    await I.log('See error toast message without text');
  }
  
  /**
   * Verifies that a success toast message appears with the specified text content.
   * This function waits for a success toast to be visible, checks its presence,
   * extracts the message text, and validates it matches the expected success text.
   * 
   * @param successText - The expected success message text to validate against
   * @param timeout - Maximum time to wait for the toast message to appear (default: 15 seconds)
   * @throws Will throw an error if the toast message doesn't appear within the timeout
   * @throws Will throw an error if the actual message text doesn't match the expected successText
   * @example
   * await stockkToastMessage.seeSuccessToastMessageWithText('File uploaded successfully');
   */
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
  
  /**
   * Verifies that a success toast message appears without validating specific text content.
   * This function waits for a success toast to be visible and confirms its presence,
   * but does not check the actual message text.
   * 
   * @param timeout - Maximum time to wait for the toast message to appear (default: 15 seconds)
   * @throws Will throw an error if the success toast message doesn't appear within the timeout
   * @example
   * await stockkToastMessage.seeSuccessToastMessageWithoutText();
   */
  async seeSuccessToastMessageWithoutText(timeout: number = 15): Promise<void> {
    const successToastLocator = '//p-toast//div[contains(@class,"p-toast-message-success")]'
    await I.waitForVisible(successToastLocator, timeout)
    await I.seeElement(successToastLocator);
    await I.log('See success toast message without text');
  }
}


// Export both the class and an instance
export default stockkToastMessage;

// For CodeceptJS compatibility
module.exports = new stockkToastMessage();
module.exports.default = stockkToastMessage;