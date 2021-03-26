import { PageWithNavbarPage } from '../PageWithNavbar.page';
import inventoryItemsPage from './Items.page';
import { generateRandmString } from '../../Helpers/helper-functions';

class InventoryItemGroupsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#tableBodyInventoryItemGroups > tr').length;
  }

  public goToInventoryItemGroups() {
    inventoryItemsPage.inventoryPn.click();
    this.inventoryPnItemGroups.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 60000, reverse: true });
    this.itemGroupCreateBtn.waitForClickable({ timeout: 20000 });
  }

  public get inventoryPnItemGroups() {
    const ele = $('#inventory-pn-item-groups');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get itemGroupCreateBtn() {
    const ele = $('#itemGroupCreateBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get nameFilterInput() {
    const ele = $('#nameFilterInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get idTableHeader() {
    const ele = $('#idTableHeader');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get nameTableHeader() {
    const ele = $('#nameTableHeader');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get descriptionTableHeader() {
    const ele = $('#descriptionTableHeader');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get parentGroupTableHeader() {
    const ele = $('#parentGroupTableHeader');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get codeTableHeader() {
    const ele = $('#codeTableHeader');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupsCreateListParentSelector() {
    const ele = $('#itemGroupsCreateListParentSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupCreateNameInput() {
    const ele = $('#itemGroupCreateNameInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupCreateDescriptionInput() {
    const ele = $('#itemGroupCreateDescriptionInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupCreateCodeInput() {
    const ele = $('#itemGroupCreateCodeInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupCreateConfirmBtn() {
    const ele = $('#itemGroupCreateConfirmBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupCreateCancelBtn() {
    const ele = $('#itemGroupCreateCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get selectedItemGroupId() {
    const ele = $('#selectedItemGroupId');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get selectedItemGroupName() {
    const ele = $('#selectedItemGroupName');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get selectedItemGroupDescription() {
    const ele = $('#selectedItemGroupDescription');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupDeleteConfirmBtn() {
    const ele = $('#itemGroupDeleteConfirmBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupDeleteCancelBtn() {
    const ele = $('#itemGroupDeleteCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get itemGroupsEditListParentSelector() {
    const ele = $('#itemGroupsEditListParentSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupEditNameInput() {
    const ele = $('#itemGroupEditNameInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupEditDescriptionInput() {
    const ele = $('#itemGroupEditDescriptionInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupEditCodeInput() {
    const ele = $('#itemGroupEditCodeInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemGroupUpdateCancelBtn() {
    const ele = $('#itemGroupUpdateCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get itemGroupUpdateConfirmBtn() {
    const ele = $('#itemGroupUpdateConfirmBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public createOpenModal(itemGroup: ItemGroup) {
    this.itemGroupCreateBtn.click();
    this.itemGroupCreateCancelBtn.waitForDisplayed({ timeout: 20000 });
    if (itemGroup.parentGroup) {
      this.itemGroupsCreateListParentSelector
        .$('input')
        .setValue(itemGroup.parentGroup);
      const value = this.itemGroupsCreateListParentSelector.$(
        `.ng-option=${itemGroup.parentGroup}`
      );
      value.waitForDisplayed({ timeout: 20000 });
      value.click();
    }
    if (itemGroup.name) {
      this.itemGroupCreateNameInput.setValue(itemGroup.name);
    }
    if (itemGroup.description) {
      this.itemGroupCreateDescriptionInput.setValue(itemGroup.description);
    }
    if (itemGroup.code) {
      this.itemGroupCreateCodeInput.setValue(itemGroup.code);
    }
  }

  public createCloseModal(clickCancel = false) {
    if (clickCancel) {
      this.itemGroupCreateCancelBtn.click();
    } else {
      this.itemGroupCreateConfirmBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 60000,
        reverse: true,
      });
    }
    this.itemGroupCreateBtn.waitForClickable({
      timeout: 20000,
    });
  }

  public createInventoryItemGroup(itemGroup: ItemGroup, clickCancel = false) {
    this.createOpenModal(itemGroup);
    this.createCloseModal(clickCancel);
  }

  public getInventoryItemGroupByNumber(index: number): InventoryItemGroup {
    return new InventoryItemGroup(index);
  }

  public getFirstInventoryItemGroupByNumber(): InventoryItemGroup {
    return this.getInventoryItemGroupByNumber(1);
  }

  public getInventoryItemGroupByName(
    nameItemGroup: string
  ): InventoryItemGroup {
    browser.pause(500);
    for (let i = 1; i < this.rowNum + 1; i++) {
      const itemGroup = this.getInventoryItemGroupByNumber(i);
      if (itemGroup.name === nameItemGroup) {
        return itemGroup;
      }
    }
    return null;
  }

  public clearTable() {
    browser.pause(500);
    const rowCount = this.rowNum;
    for (let i = 1; i <= rowCount; i++) {
      const itemGroup = this.getFirstInventoryItemGroupByNumber();
      itemGroup.delete();
    }
  }

  public createDummyInventoryItemGroups(
    createCount = 3,
    parentGroup?: string
  ): ItemGroup[] {
    const masResult = new Array<ItemGroup>();
    for (let i = 0; i < createCount; i++) {
      const itemGroup: ItemGroup = {
        name: generateRandmString(),
        description: generateRandmString(),
        code: generateRandmString(),
        parentGroup: parentGroup,
      };
      masResult.push(itemGroup);
      this.createInventoryItemGroup(itemGroup);
    }
    return masResult;
  }

  public getAllItemGroups(): InventoryItemGroup[] {
    browser.pause(500);
    const rowCount = this.rowNum;
    const result = new Array<InventoryItemGroup>();
    for (let i = 1; i <= rowCount; i++) {
      result.push(this.getFirstInventoryItemGroupByNumber());
    }
    return result;
  }
}

const inventoryItemGroupsPage = new InventoryItemGroupsPage();
export default inventoryItemGroupsPage;

export class InventoryItemGroup {
  constructor(rowNumber: number) {
    this.element = $$('#tableBodyInventoryItemGroups > tr')[rowNumber - 1];
    if (this.element) {
      this.id = +this.element.$('#itemGroupId').getText();
      this.name = this.element.$('#itemGroupName').getText();
      this.description = this.element.$('#itemGroupDescription').getText();
      this.parentGroup = this.element.$('#itemGroupParent').getText();
      this.code = this.element.$('#itemGroupCode').getText();
      this.updateBtn = this.element.$('#editItemGroupBtn');
      this.deleteBtn = this.element.$('#deleteItemGroupBtn');
    }
  }

  public element;
  public id: number;
  public code: string;
  public name: string;
  public description: string;
  public parentGroup: string;
  public updateBtn;
  public deleteBtn;

  public deleteOpenModal() {
    this.deleteBtn.click();
    inventoryItemGroupsPage.itemGroupDeleteCancelBtn.waitForClickable({
      timeout: 20000,
    });
  }

  public deleteCloseModal(clickCancel = false) {
    if (clickCancel) {
      inventoryItemGroupsPage.itemGroupDeleteCancelBtn.click();
    } else {
      inventoryItemGroupsPage.itemGroupDeleteConfirmBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 60000,
        reverse: true,
      });
    }
    inventoryItemGroupsPage.itemGroupCreateBtn.waitForClickable({
      timeout: 20000,
    });
  }

  public delete(clickCancel = false) {
    this.deleteOpenModal();
    this.deleteCloseModal(clickCancel);
  }

  public updateOpenModal(itemGroup: ItemGroup) {
    this.updateBtn.click();
    inventoryItemGroupsPage.itemGroupUpdateCancelBtn.waitForClickable({
      timeout: 20000,
    });
    const itemGroupsEditListParentSelectorInput = inventoryItemGroupsPage.itemGroupsEditListParentSelector.$(
      'input'
    );
    if (
      itemGroup.parentGroup &&
      itemGroupsEditListParentSelectorInput.getValue() !== itemGroup.parentGroup
    ) {
      itemGroupsEditListParentSelectorInput.setValue(itemGroup.parentGroup);
      const value = inventoryItemGroupsPage.itemGroupsEditListParentSelector.$(
        `.ng-option=${itemGroup.parentGroup}`
      );
      value.waitForDisplayed({ timeout: 20000 });
      value.click();
    } else if (itemGroup.parentGroup === '') {
      inventoryItemGroupsPage.itemGroupsEditListParentSelector
        .$('span.ng-clear-wrapper')
        .click();
    }
    if (
      itemGroup.name &&
      inventoryItemGroupsPage.itemGroupEditNameInput.getValue() !==
        itemGroup.name
    ) {
      inventoryItemGroupsPage.itemGroupEditNameInput.setValue(itemGroup.name);
    } else if (itemGroup.name === '') {
      inventoryItemGroupsPage.itemGroupEditNameInput.click();
      browser.keys(['Control', 'a', 'Control', 'Delete']);
    }
    if (
      itemGroup.description &&
      inventoryItemGroupsPage.itemGroupEditDescriptionInput.getValue() !==
        itemGroup.description
    ) {
      inventoryItemGroupsPage.itemGroupEditDescriptionInput.setValue(
        itemGroup.description
      );
    } else if (itemGroup.description === '') {
      inventoryItemGroupsPage.itemGroupEditDescriptionInput.click();
      browser.keys(['Control', 'a', 'Control', 'Delete']);
    }
    if (
      itemGroup.code === '' ||
      (itemGroup.code &&
        inventoryItemGroupsPage.itemGroupEditCodeInput.getValue() !==
          itemGroup.code)
    ) {
      inventoryItemGroupsPage.itemGroupEditCodeInput.setValue(itemGroup.code);
    } else if (itemGroup.code === '') {
      inventoryItemGroupsPage.itemGroupEditCodeInput.click();
      browser.keys(['Control', 'a', 'Control', 'Delete']);
    }
  }

  public updateCloseModal(clickCancel = false) {
    if (clickCancel) {
      inventoryItemGroupsPage.itemGroupUpdateCancelBtn.click();
    } else {
      inventoryItemGroupsPage.itemGroupUpdateConfirmBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 60000,
        reverse: true,
      });
    }
    inventoryItemGroupsPage.itemGroupCreateBtn.waitForClickable({
      timeout: 20000,
    });
  }

  public update(itemGroup: ItemGroup, clickCancel = false) {
    this.updateOpenModal(itemGroup);
    this.updateCloseModal(clickCancel);
  }
}

export class ItemGroup {
  public code: string;
  public name: string;
  public description: string;
  public parentGroup?: string;
}
