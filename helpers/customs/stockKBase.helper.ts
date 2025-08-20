// stockKAutocomplete.helper.ts
// Usage example (inside a test or Page Object):
// await setValueAutocomplete('p-autocomplete#pwId', 'value1,value2');
// await setValueAutocomplete('//p-autocomplete[@id="pwId"]', 'single value');

const { I, stockkSpinner } = inject();

/**
 * Set value(s) for a PrimeNG <p-autocomplete> component.
 * - Supports single or multiple selections (comma-separated).
 * - Finds the inner <input> under the provided root <p-autocomplete>.
 *
 * @param rootSelector CSS or XPath selector to the <p-autocomplete> root
 * @param rawValue single value OR comma-separated values (e.g. "v1,v2,v3")
 */
async function setValueAutocomplete(rootSelector: string, rawValue: string): Promise<void> {
  const values = rawValue
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0);

  if (values.length === 0) {
    throw new Error('[Autocomplete] No value provided');
  }

  for (const value of values) {
    // Open the autocomplete and type
    await I.click(rootSelector);
    await I.usePlaywrightTo('clear autocomplete input', async ({ page }) => {
      const root = page.locator(rootSelector);
      const input = root.locator('xpath=.//input');
      await input.clear();
      await input.pressSequentially(value);
    });

    // Small debounce similar to Task.Delay(500)
    await I.wait(0.5);

    // Wait for the dropdown listbox
    const listbox = 'xpath=//ul[@role="listbox"]';
    try {
      await I.waitForElement(listbox, 7);
    } catch (e) {
      throw new Error(`No option found with value: ${value}`);
    }

    // Read list items and validate content
    const liSelector = 'xpath=//ul[@role="listbox"]//li';
    const matched = await I.usePlaywrightTo('pick autocomplete option', async ({ page }) => {
      const lis = page.locator(liSelector);
      const count = await lis.count();

      if (count === 0) return false;

      if (count === 1) {
        const onlyText = (await lis.nth(0).innerText()).trim();
        if (/no results found/i.test(onlyText)) return false;
      }

      // Collect texts for debugging / search
      const texts: string[] = [];
      for (let i = 0; i < count; i++) {
        texts.push((await lis.nth(i).innerText()).trim());
      }
      if (texts.length === 0) return false;

      // Find first item that contains the typed value (case-insensitive)
      const idx = texts.findIndex(t => t.toLowerCase().includes(value.toLowerCase()));
      if (idx === -1) return false;

      await lis.nth(idx).click();
      I.log("Selected option: " + value);
      await stockkSpinner.waitForAllSpinnerInvisible();
      return true;
    });

    if (!matched) {
      throw new Error(`No option found with value: ${value}`);
    }
  }
}

export {
  setValueAutocomplete
}
