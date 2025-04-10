import { ComponentFixture } from '@angular/core/testing';
import { PageObjectModel } from 'ngx-page-object-model';

export abstract class PageObject<ComponentType> extends PageObjectModel<ComponentType> {
  readonly DT_SELECTOR = 'ngx-datatable';

  constructor(
    public override readonly fixture: ComponentFixture<ComponentType>,
    config: { clearStorage: boolean } = { clearStorage: true },
  ) {
    super(fixture);
    if (config.clearStorage) {
      localStorage.clear();
    }
  }

  whenStable(): Promise<any> {
    return this.fixture.whenStable();
  }

  async whenReady(): Promise<void> {
    await this.fixture.whenStable();
    await this.fixture.whenRenderingDone();
  }

  queryInsideElement<T extends HTMLElement>(element: HTMLElement, selector: string, assert = true): HTMLElement {
    const child: T = element.querySelector<T>(selector) as T;

    if (assert) {
      expect(child).toBeTruthy(`Element with selector "${selector}" inside "${element.tagName}" was not found.`);
    }

    return child;
  }

  public setInputValue(inputElement: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, value: string | number): void {
    inputElement.value = `${value}`;
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('change'));
    inputElement.dispatchEvent(new Event('blur'));
    this.fixture.detectChanges();
  }

  getLabel(fieldName: string): HTMLLabelElement {
    return this.query<HTMLLabelElement>(`.control-label[for="${fieldName}"]`);
  }
  getInput(fieldName: string): HTMLInputElement {
    return this.query<HTMLInputElement>(`input.form-control[id="${fieldName}"]`);
  }
  expectInputVisible(fieldName: string): void {
    expect(this.getLabel(fieldName)).toBeDefined();
    expect(this.getInput(fieldName)).toBeDefined();
  }

  clickElement(element: HTMLElement): void {
    element.click();
    this.fixture.detectChanges();
  }

  getInputById(inputId: string): HTMLInputElement {
    return this.query<HTMLInputElement>(`#${inputId}`);
  }

  setInputValueById(inputId: string, value: string | number): void {
    this.setInputValue(this.getInputById(inputId), value);
  }

  clickElements(elements: HTMLElement[]): void {
    for (const element of elements) {
      element.click();
    }
    this.fixture.detectChanges();
  }

  isHidden(element: HTMLElement): boolean {
    return element.hasAttribute('hidden');
  }

  queryOutsideComponent<T extends HTMLElement>(selector: string, assert = true): T {
    const element: T = document.querySelector<T>(selector) as T;

    if (assert) {
      expect(element).toBeTruthy(`Global element with selector "${selector}" was not found.`);
    }

    return element;
  }

  get queryWrapper(): HTMLElement {
    return this.query<HTMLElement>('#no-highlight-query-wrapper');
  }

  /*** ngx-datatable utilities ***/

  /* selector string generators */
  private getDatatableHeaderByTitleSelector(datatableSelector: string, text: string): string {
    return `${datatableSelector} .datatable-header-cell[title="${text}"]`;
  }
  private getDatatableRowSelector(datatableSelector: string, rowIndex: number): string {
    return `${datatableSelector} .datatable-row-wrapper:nth-child(${rowIndex + 1})`;
  }
  private getDatatableCellSelector(datatableSelector: string, rowIndex: number, colIndex: number): string {
    return `${datatableSelector} .datatable-row-wrapper:nth-child(${rowIndex + 1}) .datatable-body-cell:nth-child(${colIndex + 1})`;
  }
  private getDefaultSelectorIfNull(datatableSelector: string | undefined): string {
    return datatableSelector ? datatableSelector : this.DT_SELECTOR;
  }

  /* internal selectors (querying the component) */

  getDatatableHeaderByTitle(text: string, assert = true, datatableSelector?: string): HTMLElement {
    datatableSelector = this.getDefaultSelectorIfNull(datatableSelector);
    return this.query(this.getDatatableHeaderByTitleSelector(datatableSelector, text), assert);
  }

  getDatatableRow(rowIndex: number, assert = true, datatableSelector?: string): HTMLElement {
    datatableSelector = this.getDefaultSelectorIfNull(datatableSelector);
    return this.query(this.getDatatableRowSelector(datatableSelector, rowIndex), assert);
  }

  getDatatableCell(rowIndex: number, colIndex: number, assert = true, datatableSelector?: string): HTMLElement {
    datatableSelector = this.getDefaultSelectorIfNull(datatableSelector);
    return this.query(this.getDatatableCellSelector(datatableSelector, rowIndex, colIndex), assert);
  }

  clickRowOfDatatable(rowIndex: number): void {
    this.clickElement(this.getDatatableCell(rowIndex, 0));
  }

  /* external selectors (querying the document) */
  getDatatableHeaderByTitleExternal(text: string, assert = true, datatableSelector?: string): HTMLElement {
    datatableSelector = this.getDefaultSelectorIfNull(datatableSelector);
    const element: HTMLElement = document.querySelector(this.getDatatableHeaderByTitleSelector(datatableSelector, text)) as HTMLElement;
    if (assert) {
      expect(element).toBeTruthy(`Unable to find text ${text} of ${datatableSelector}`);
    }
    return element;
  }

  getDatatableRowExternal(rowIndex: number, assert = true, datatableSelector?: string): HTMLElement {
    datatableSelector = this.getDefaultSelectorIfNull(datatableSelector);
    const element: HTMLElement = document.querySelector(this.getDatatableRowSelector(datatableSelector, rowIndex)) as HTMLElement;
    if (assert) {
      expect(element).toBeTruthy(`Unable to find row ${rowIndex} of ${datatableSelector}`);
    }
    return element;
  }

  getDatatableCellExternal(rowIndex: number, colIndex: number, assert = true, datatableSelector?: string): HTMLElement {
    datatableSelector = this.getDefaultSelectorIfNull(datatableSelector);
    const element: HTMLElement = document.querySelector(
      this.getDatatableCellSelector(datatableSelector, rowIndex, colIndex),
    ) as HTMLElement;
    if (assert) {
      expect(element).toBeTruthy(`Unable to find column ${colIndex} of row ${rowIndex} of ${datatableSelector}`);
    }
    return element;
  }

  getCellOfDatatableInModal(rowIndex: number, colIndex: number): HTMLElement {
    const datatableSelector = `.modal-content ${this.DT_SELECTOR}`;
    return this.getDatatableCellExternal(rowIndex, colIndex, true, datatableSelector);
  }

  clickRowOfDatatableInModal(rowIndex: number): void {
    this.clickElement(this.getCellOfDatatableInModal(rowIndex, 0));
  }

  /*** ngx-bootstrap Tabs utilities ***/

  getTab(tabsetId: string, tabId: string): HTMLElement {
    return this.query(`tabset#${tabsetId} a#${tabId}-link`);
  }

  expectTabActive(tab: HTMLElement): void {
    expect(tab).toHaveClass('active');
  }

  expectTabInactive(tab: HTMLElement): void {
    expect(tab).not.toHaveClass('active');
  }

  expectTabHeadToContain(tab: HTMLElement, text: string): void {
    expect(tab.innerText).toContain(text);
  }
}
