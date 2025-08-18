// TableComponent.ts (CodeceptJS + Playwright)
// Requires CodeceptJS with Playwright helper enabled.
const { I, stockkSpinner } = inject();

type Int = number;
class stockkTable {
  private root: string;

  constructor(rootSelector: string = '//p-table') {
    this.root = rootSelector;
  }

  // ========= Utils =========
  private normalize(text?: string | null): string {
    return (text ?? '').replace(/\s+/g, ' ').replace(/\u2019/g, "'").trim();
  }

  private async waitForTableLoading(): Promise<void> {
    await I.wait(1);
    await stockkSpinner.waitForAllSpinnerToDisappear();
  }

  // Escape a JS string safely for XPath literal
  private xLiteral(s: string): string {
    if (!s.includes("'")) return `'${s}'`;
    if (!s.includes('"')) return `"${s}"`;
    const parts = s.split("'").map(p => `'${p}'`);
    return `concat(${parts.join(", \"'\", ")})`;
  }

  // ========= XPath builders (scoped to this.root) =========
  private headerCells(): string {
    return `${this.root}//thead//tr[last()]//th`;
  }

  private rowElems(): string {
    return `${this.root}//tbody//tr`;
  }

  private cellAt(rowIndex0: number, colIndex0: number): string {
    return `${this.rowElems()}[${rowIndex0 + 1}]//td[${colIndex0 + 1}]`;
  }

  private headerCheckbox(): string {
    return `${this.root}//p-tableheadercheckbox//div[@role='checkbox']`;
  }

  private firstColumnCheckboxAtRow(rowIndex1: number): string {
    return `${this.rowElems()}[${rowIndex1}]//td[1]//*[@role='checkbox']`;
  }

  private linkInCellByText(cellXPath: string, linkText: string): string {
    const t = this.xLiteral(this.normalize(linkText));
    return `${cellXPath}//a[normalize-space(.)=${t} or contains(normalize-space(.), ${t})] | ${cellXPath}//*[@role='link' and (normalize-space(.)=${t} or contains(normalize-space(.), ${t}))]`;
  }

  private firstLinkInCell(cellXPath: string): string {
    return `${cellXPath}//a | ${cellXPath}//*[@role='link']`;
  }

  private buttonInCellByText(cellXPath: string, buttonText: string): string {
    const t = this.xLiteral(this.normalize(buttonText));
    return `${cellXPath}//button[normalize-space(.)=${t} or contains(normalize-space(.), ${t})] | ${cellXPath}//*[@role='button' and (normalize-space(.)=${t} or contains(normalize-space(.), ${t}))]`;
  }

  private inputInCell(cellXPath: string): string {
    return `${cellXPath}//input | ${cellXPath}//textarea`;
  }

  private headerCopyButtonAtColumn(colIndex0: number): string {
    // PrimeNG header cell likely contains <p-button>; click its button root
    return `${this.headerCells()}[${colIndex0 + 1}]//p-button`;
  }

  // ========= Low-level grabs =========
  private async grabHeaderTexts(): Promise<string[]> {
    const count = await I.grabNumberOfVisibleElements(`xpath=${this.headerCells()}`);
    const names: string[] = [];
    for (let i = 1; i <= count; i++) {
      const txt = await I.grabTextFrom(`xpath=${this.headerCells()}[${i}]`);
      names.push(this.normalize(txt));
    }
    return names;
  }

  private async grabCellText(rowIndex0: number, colIndex0: number): Promise<string> {
    const cellXPath = this.cellAt(rowIndex0, colIndex0);
    return await I.usePlaywrightTo('grab cell text or input value (XPath)', async ({ page }) => {
      const cell = await page.$(`xpath=${cellXPath}`);
      if (!cell) return '';
      // Prefer actual input value if an input/textarea exists
      const input = await page.$(`xpath=${this.inputInCell(cellXPath)}`);
      if (input && (input as any).inputValue) {
        const v = await (input as any).inputValue().catch(() => '') as string;
        if (v) return v.trim();
      }
      const raw = await cell.innerText().catch(() => '');
      return raw.replace(/\s+/g, ' ').trim();
    });
  }

  // ========= Parity API with C# =========

  /** async GetNumberOfRows(): Promise<number> */
  public async GetNumberOfRows(): Promise<number> {
    await this.waitForTableLoading();
    const noDataXPath = `${this.root}//tbody//*[contains(normalize-space(.), 'No records available.')]`;
    const noDataCount = await I.grabNumberOfVisibleElements(`xpath=${noDataXPath}`);
    if (noDataCount > 0) return 0;
    const rows = await I.grabNumberOfVisibleElements(`xpath=${this.rowElems()}`);
    return rows;
  }

  /** async GetColumnIndexOfTable(columnName: string): Promise<int> (0-based; -1 if not found) */
  public async GetColumnIndexOfTable(columnName: string): Promise<Int> {
    const names = await this.grabHeaderTexts();
    console.log('names', names);
    const target = this.normalize(columnName);
    for (let i = 0; i < names.length; i++) {
      if (names[i] === target) return i;
    }
    console.log('Column "' + columnName + '" not found');
    return -1;
  }

  /** async GetRowIndexOfTableByColumnNameAndValue(columnName: string, value: string): Promise<int>
   *  Returns 1-based row index; -1 if not found
   */
  public async GetRowIndexOfTableByColumnNameAndValue(columnName: string, value: string): Promise<Int> {
    await this.waitForTableLoading();
    const colIdx = await this.GetColumnIndexOfTable(columnName);
    if (colIdx < 0) return -1;

    const rows = await this.GetNumberOfRows();
    const target = this.normalize(value);
    for (let r0 = 0; r0 < rows; r0++) {
      const cellText = this.normalize(await this.grabCellText(r0, colIdx));
      if (cellText === target || cellText.includes(target)) return r0 + 1;
    }
    return -1;
  }

  /** async IsColumnExistsAsync(columnName: string): Promise<bool> */
  public async IsColumnExistsAsync(columnName: string): Promise<boolean> {
    return (await this.GetColumnIndexOfTable(columnName)) !== -1;
  }

  // ----- Links -----
  /** async ClickLinkInCell(columnName: string, cellValue: string): Promise<void> */
  public async ClickLinkInCell(columnName: string, cellValue: string): Promise<void> {
    const row = await this.GetRowIndexOfTableByColumnNameAndValue(columnName, cellValue);
    if (row < 1) throw new Error(`Row not found for ${columnName} = "${cellValue}"`);
    const col = await this.GetColumnIndexOfTable(columnName);
    const cellXPath = this.cellAt(row - 1, col);

    await I.usePlaywrightTo('click link in cell (XPath)', async ({ page }) => {
      const byText = await page.$(`xpath=${this.linkInCellByText(cellXPath, cellValue)}`);
      if (byText) return void (await byText.click());
      const first = await page.$(`xpath=${this.firstLinkInCell(cellXPath)}`);
      if (!first) throw new Error('No link found in cell');
      await first.click();
    });

    await this.waitForTableLoading();
  }

  /** async ClickLink(rowNumber: number, columnName: string, linkName: string): Promise<void> */
  public async ClickLink(rowNumber: number, columnName: string, linkName: string): Promise<void> {
    const rows = await this.GetNumberOfRows();
    if (rowNumber < 1 || rowNumber > rows) throw new Error(`Row ${rowNumber} out of range (1..${rows})`);
    const col = await this.GetColumnIndexOfTable(columnName);
    if (col < 0) throw new Error(`Column "${columnName}" not found`);
    const cellXPath = this.cellAt(rowNumber - 1, col);

    await I.usePlaywrightTo('click named link in cell (XPath)', async ({ page }) => {
      const link = await page.$(`xpath=${this.linkInCellByText(cellXPath, linkName)}`);
      if (!link) throw new Error(`Link "${linkName}" not found in ${columnName} of row ${rowNumber}`);
      await link.click();
    });

    await this.waitForTableLoading();
  }

  // ----- Buttons -----
  /** async ClickButton(rowNumber: number, columnName: string, buttonName: string): Promise<void> */
  public async ClickButton(rowNumber: number, columnName: string, buttonName: string): Promise<void> {
    const rows = await this.GetNumberOfRows();
    if (rowNumber < 1 || rowNumber > rows) throw new Error(`Row ${rowNumber} out of range (1..${rows})`);
    const col = await this.GetColumnIndexOfTable(columnName);
    if (col < 0) throw new Error(`Column "${columnName}" not found`);
    const cellXPath = this.cellAt(rowNumber - 1, col);

    await I.usePlaywrightTo('click button in cell (XPath)', async ({ page }) => {
      const btn = await page.$(`xpath=${this.buttonInCellByText(cellXPath, buttonName)}`);
      if (!btn) throw new Error(`Button "${buttonName}" not found in ${columnName} of row ${rowNumber}`);
      await btn.click();
    });

    await this.waitForTableLoading();
  }

  /** async ClickButtonByConditional(...) */
  public async ClickButtonByConditional(
    columnNameCondition: string,
    columnValueCondition: string,
    columnName: string,
    buttonName: string,
  ): Promise<void> {
    const rowNumber = await this.GetRowIndexOfTableByColumnNameAndValue(columnNameCondition, columnValueCondition);
    if (rowNumber < 1) throw new Error(`Can't find any row with: ${columnNameCondition} = ${columnValueCondition}`);
    await this.ClickButton(rowNumber, columnName, buttonName);
  }

  // ----- Header copy icon (column-level) -----
  /** async ClickCopyIconByConditional(columnNameConditional, columnValueConditional, columnName): Promise<void> */
  public async ClickCopyIconByConditional(
    columnNameConditional: string,
    columnValueConditional: string,
    columnName: string,
  ): Promise<void> {
    // (parity with C# flow: resolve row, then click the header icon at column)
    const rowNumber = await this.GetRowIndexOfTableByColumnNameAndValue(columnNameConditional, columnValueConditional);
    if (rowNumber < 1) throw new Error(`Can't find any row with: ${columnNameConditional} = ${columnValueConditional}`);

    const colIdx = await this.GetColumnIndexOfTable(columnName);
    if (colIdx === -1) throw new Error(`Column: ${columnName} not found`);

    await I.usePlaywrightTo('click header copy icon (XPath)', async ({ page }) => {
      const btn = await page.$(`xpath=${this.headerCopyButtonAtColumn(colIdx)}`);
      if (!btn) throw new Error(`No copy icon found for column: ${columnName}`);
      await btn.click();
    });

    await this.waitForTableLoading();
  }

  // ----- Cells: get/set & editability -----
  /** Get all column names (as displayed) */
  public async GetColumnNames(): Promise<string[]> {
    return this.grabHeaderTexts();
  }

  /** async GetCellValueByRowNumber(rowNumber, columnName): Promise<string> */
  public async GetCellValueByRowNumber(rowNumber: number, columnName: string): Promise<string> {
    const rows = await this.GetNumberOfRows();
    if (rowNumber < 1 || rowNumber > rows) throw new Error(`Row ${rowNumber} out of range (1..${rows})`);
    const col = await this.GetColumnIndexOfTable(columnName);
    if (col < 0) throw new Error(`Column "${columnName}" not found`);
    return this.grabCellText(rowNumber - 1, col);
  }

  /** async GetCellValueByConditional(columnNameConditional, columnValueConditional, columnName): Promise<string> */
  public async GetCellValueByConditional(
    columnNameConditional: string,
    columnValueConditional: string,
    columnName: string,
  ): Promise<string> {
    const row = await this.GetRowIndexOfTableByColumnNameAndValue(columnNameConditional, columnValueConditional);
    if (row < 1) throw new Error(`Can't find any row with: ${columnNameConditional} = ${columnValueConditional}`);
    const value = await this.GetCellValueByRowNumber(row, columnName);
    I.log(`Value of [${columnName}] in row [${row}] is: [${value}]`);
    return value;
  }

  /** async IsCellEditable(rowNumber, columnName): Promise<boolean>
   */
  public async IsCellEditable(rowNumber: number, columnName: string): Promise<boolean> {
    const rows = await this.GetNumberOfRows();
    if (rowNumber < 1 || rowNumber > rows) throw new Error(`Row ${rowNumber} out of range (1..${rows})`);
    const colIdx = await this.GetColumnIndexOfTable(columnName);
    if (colIdx < 0) throw new Error(`Column "${columnName}" not found`);

    const cellXPath = this.cellAt(rowNumber - 1, colIdx);
    const isEditable = await I.usePlaywrightTo('cell editability (XPath)', async ({ page }) => {
      const input = await page.$(`xpath=${this.inputInCell(cellXPath)}`);
      if (!input) return false;
      const disabled = await input.isDisabled?.();
      const editable = await (input as any).isEditable?.();
      return !disabled && !!editable;
    });

    I.log(`Column: [${columnName}] in Row [${rowNumber}] is ${isEditable ? 'editable' : 'not editable'}`);
    return isEditable;
  }

  /** async SetCellValue(rowNumber, columnName, value): Promise<void> */
  public async SetCellValue(rowNumber: number, columnName: string, value: string): Promise<void> {
    const rows = await this.GetNumberOfRows();
    if (rowNumber < 1 || rowNumber > rows) throw new Error(`Row ${rowNumber} out of range (1..${rows})`);
    const colIdx = await this.GetColumnIndexOfTable(columnName);
    console.log(`Column index of "${columnName}": ${colIdx}`);
    if (colIdx < 0) throw new Error(`Column "${columnName}" not found`);

    const cellXPath = this.cellAt(rowNumber - 1, colIdx);
    await I.usePlaywrightTo('fill input cell (XPath)', async ({ page }) => {
      // Prefer direct inputs
      const input = await page.$(`xpath=${this.inputInCell(cellXPath)}`);
      if (input && (input as any).fill) {
        await (input as any).fill('');
        await (input as any).type?.(value);
        await input.evaluate((el: any) => el.blur?.());
        return;
      }
      // Fallback to click-to-edit cell editor patterns
      const cell = await page.$(`xpath=${cellXPath}`);
      if (!cell) throw new Error('Cell not found');
      await cell.click();
      // try again to find an input
      const editorInput = await page.$(`xpath=${this.inputInCell(cellXPath)}`);
      if (!editorInput) throw new Error('No editable input found in cell');
      await (editorInput as any).fill?.('');
      await (editorInput as any).type?.(value);
      await editorInput.evaluate((el: any) => el.blur?.());
    });

    await this.waitForTableLoading();
  }

  /** async SetCellValueByConditional(columnNameConditional, columnValueConditional, columnName, value): Promise<void> */
  public async SetCellValueByConditional(
    columnNameConditional: string,
    columnValueConditional: string,
    columnName: string,
    value: string,
  ): Promise<void> {
    const row = await this.GetRowIndexOfTableByColumnNameAndValue(columnNameConditional, columnValueConditional);
    if (row < 1) throw new Error(`Can't find any row with: ${columnNameConditional} = ${columnValueConditional}`);
    await this.SetCellValue(row, columnName, value);
  }

  // ----- Tooltips -----
  /** async GetCellTooltipOfTableAsync(rowNumber, columnName): Promise<string | null> */
  public async GetCellTooltipOfTableAsync(rowNumber: number, columnName: string): Promise<string | null> {
    const rows = await this.GetNumberOfRows();
    if (rowNumber < 1 || rowNumber > rows) throw new Error(`Row ${rowNumber} out of range (1..${rows})`);
    const colIdx = await this.GetColumnIndexOfTable(columnName);
    if (colIdx < 0) throw new Error(`Column "${columnName}" not found`);

    const cellXPath = this.cellAt(rowNumber - 1, colIdx);
    return I.usePlaywrightTo('tooltip text (XPath)', async ({ page }) => {
      const cell = await page.$(`xpath=${cellXPath}`);
      if (!cell) throw new Error('Cell not found');

      await cell.scrollIntoViewIfNeeded();
      await cell.hover();
      await new Promise(r => setTimeout(r, 500));

      const tooltip = await page.$(`xpath=//div[@class='p-tooltip-text']`);
      const txt = tooltip ? (await tooltip.textContent()) : null;
      await cell.click(); // dismiss
      return txt ? txt.trim() : null;
    });
  }

  /** async GetCellTooltipByConditionalAsync(columnNameConditional, columnValueConditional, columnName): Promise<string | null> */
  public async GetCellTooltipByConditionalAsync(
    columnNameConditional: string,
    columnValueConditional: string,
    columnName: string,
  ): Promise<string | null> {
    const row = await this.GetRowIndexOfTableByColumnNameAndValue(columnNameConditional, columnValueConditional);
    if (row < 1) throw new Error(`Can't find any row with: ${columnNameConditional} = ${columnValueConditional}`);

    const colIdx = await this.GetColumnIndexOfTable(columnName);
    if (colIdx < 0) throw new Error(`Column "${columnName}" not found`);

    const cellXPath = this.cellAt(row - 1, colIdx);
    return I.usePlaywrightTo('tooltip text by conditional (XPath)', async ({ page }) => {
      const cell = await page.$(`xpath=${cellXPath}`);
      if (!cell) throw new Error('Cell not found');

      const span = await page.$(`xpath=${cellXPath}//span`);
      await (span || cell).hover();
      await new Promise(r => setTimeout(r, 500));

      const tooltip = await page.$(`xpath=//div[@class='p-tooltip-text']`);
      const txt = tooltip ? (await tooltip.textContent()) : null;
      await cell.click(); // dismiss
      return txt ? txt.trim() : null;
    });
  }

  // ----- Row existence -----
  /** async IsRowExistedByConditionalAsync(columnNameConditional, columnValueConditional): Promise<boolean> */
  public async IsRowExistedByConditionalAsync(
    columnNameConditional: string,
    columnValueConditional: string,
  ): Promise<boolean> {
    const rowNumber = await this.GetRowIndexOfTableByColumnNameAndValue(columnNameConditional, columnValueConditional);
    return rowNumber > 0;
  }

  // ----- Checkboxes (row & header) -----
  /** async SetCheckboxByRowIndex(rowNumber, isChecked): Promise<void> */
  public async SetCheckboxByRowIndex(rowNumber: number, isChecked: boolean): Promise<void> {
    const rows = await this.GetNumberOfRows();
    if (rowNumber < 1 || rowNumber > rows) throw new Error(`Row ${rowNumber} out of range (1..${rows})`);
    const cbXPath = this.firstColumnCheckboxAtRow(rowNumber);
    await I.usePlaywrightTo('toggle row checkbox (XPath)', async ({ page }) => {
      const cb = await page.$(`xpath=${cbXPath}`);
      if (!cb) throw new Error('Checkbox not found');
      const aria = (await cb.getAttribute('aria-checked')) ?? 'false';
      const currently = aria === 'true';
      if (currently !== isChecked) await cb.click();
    });
    await this.waitForTableLoading();
  }

  /** async SetCheckBoxByColumnValue(columnName, value, isChecked): Promise<void> */
  public async SetCheckBoxByColumnValue(columnName: string, value: string, isChecked: boolean): Promise<void> {
    const rowIndex = await this.GetRowIndexOfTableByColumnNameAndValue(columnName, value);
    if (rowIndex === -1) throw new Error(`Column: ${columnName} with value: ${value} not found`);
    await this.SetCheckboxByRowIndex(rowIndex, isChecked);
  }

  /** async IsCheckboxReadonlyByConditional(columnName, value): Promise<boolean> */
  public async IsCheckboxReadonlyByConditional(columnName: string, value: string): Promise<boolean> {
    const row = await this.GetRowIndexOfTableByColumnNameAndValue(columnName, value);
    if (row < 1) return false;
    const cbXPath = this.firstColumnCheckboxAtRow(row);
    return I.usePlaywrightTo('readonly checkbox class (XPath)', async ({ page }) => {
      const cb = await page.$(`xpath=${cbXPath}`);
      if (!cb) return false;
      const cls = (await cb.getAttribute('class')) ?? '';
      const ariaDisabled = (await cb.getAttribute('aria-disabled')) ?? 'false';
      return /\bp-disabled\b/.test(cls) || ariaDisabled === 'true';
    });
  }

  /** async IsCheckboxCheckedByConditional(columnName, value): Promise<boolean> */
  public async IsCheckboxCheckedByConditional(columnName: string, value: string): Promise<boolean> {
    const row = await this.GetRowIndexOfTableByColumnNameAndValue(columnName, value);
    if (row < 1) return false;
    const cbXPath = this.firstColumnCheckboxAtRow(row);
    return I.usePlaywrightTo('checked state (XPath)', async ({ page }) => {
      const cb = await page.$(`xpath=${cbXPath}`);
      const aria = (cb && (await cb.getAttribute('aria-checked'))) || 'false';
      return aria.includes('true');
    });
  }

  /** async UncheckAllCheckboxByClickOnHeader(): Promise<void> */
  public async UncheckAllCheckboxByClickOnHeader(): Promise<void> {
    await I.usePlaywrightTo('uncheck header checkbox if checked (XPath)', async ({ page }) => {
      const headerCb = await page.$(`xpath=${this.headerCheckbox()}`);
      if (!headerCb) return;
      const aria = (await headerCb.getAttribute('aria-checked')) ?? 'false';
      if (aria === 'true') {
        await headerCb.click();
      }
    });
    await this.waitForTableLoading();
    await I.wait(0.5);
  }

  /** async SetHeaderCheckboxAsync(isChecked): Promise<void> */
  public async SetHeaderCheckboxAsync(isChecked: boolean): Promise<void> {
    await I.usePlaywrightTo('set header checkbox state (XPath)', async ({ page }) => {
      const cb = await page.$(`xpath=${this.headerCheckbox()}`);
      if (!cb) throw new Error('Header checkbox not found');
      const aria = (await cb.getAttribute('aria-checked')) ?? 'false';
      const currently = aria === 'true';
      if (currently !== isChecked) await cb.click();
    });
    await I.wait(1);
  }

  /** async IsHeaderCheckboxDisabled(): Promise<boolean> */
  public async IsHeaderCheckboxDisabled(): Promise<boolean> {
    return I.usePlaywrightTo('header checkbox disabled? (XPath)', async ({ page }) => {
      const cb = await page.$(`xpath=${this.headerCheckbox()}`);
      if (!cb) return false;
      const cls = (await cb.getAttribute('class')) ?? '';
      const ariaDisabled = (await cb.getAttribute('aria-disabled')) ?? 'false';
      return /\bp-disabled\b/.test(cls) || ariaDisabled === 'true';
    });
  }

  /** async IsHeaderCheckboxCheckedAsync(): Promise<boolean> */
  public async IsHeaderCheckboxCheckedAsync(): Promise<boolean> {
    return I.usePlaywrightTo('header checkbox checked? (XPath)', async ({ page }) => {
      const cb = await page.$(`xpath=${this.headerCheckbox()}`);
      const aria = (cb && (await cb.getAttribute('aria-checked'))) || 'false';
      return aria === 'true';
    });
  }
}

// ===== exports =====
export default stockkTable;
module.exports = new stockkTable();
module.exports.default = stockkTable;
