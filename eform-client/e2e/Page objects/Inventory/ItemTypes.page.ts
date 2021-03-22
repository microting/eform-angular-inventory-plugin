import { PageWithNavbarPage } from '../PageWithNavbar.page';
import inventoryItemsPage from './Items.page';
import { parse } from 'date-fns';
import { generateRandmString } from '../../Helpers/helper-functions';

class InventoryItemTypesPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#tableBodyInventoryItemType > tr').length;
  }

  public goToInventoryItemTypes() {
    inventoryItemsPage.inventoryPn.click();
    this.inventoryPnItemTypes.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 60000, reverse: true });
    this.itemTypeCreateBtn.waitForClickable({ timeout: 20000 });
  }

  public get inventoryPnItemTypes() {
    const ele = $('#inventory-pn-item-types');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get itemTypeCreateBtn() {
    const ele = $('#itemTypeCreateBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get selectedItemTypeId() {
    const ele = $('#selectedItemTypeId');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get selectedItemTypeName() {
    const ele = $('#selectedItemTypeName');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get selectedItemTypeDescription() {
    const ele = $('#selectedItemTypeDescription');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemTypeDeleteCancelBtn() {
    const ele = $('#itemTypeDeleteCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get itemTypeDeleteConfirmBtn() {
    const ele = $('#itemTypeDeleteConfirmBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemTypeEditCancelBtn() {
    const ele = $('#itemTypeEditCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get itemTypeEditSaveBtn() {
    const ele = $('#itemTypeEditSaveBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get idTableHeader() {
    const ele = $('#idTableHeader');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get dateTableHeader() {
    const ele = $('#dateTableHeader');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get nameTableHeader() {
    const ele = $('#nameTableHeader');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get usageTableHeader() {
    const ele = $('#usageTableHeader');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get descriptionTableHeader() {
    const ele = $('#descriptionTableHeader');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get riscDescriptionTableHeader() {
    const ele = $('#riscDescriptionTableHeader');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createItemGroupIdSelector() {
    const ele = $('#createItemGroupIdSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get createItemTypeTagsSelector() {
    const ele = $('#createItemTypeTagsSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get createNameSelector() {
    const ele = $('#createNameSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get createDescriptionSelector() {
    const ele = $('#createDescriptionSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get createUsage() {
    const ele = $('#createUsage');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get createRiskDescription() {
    const ele = $('#createRiskDescription');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemTypeCreateCancelBtn() {
    const ele = $('#itemTypeCreateCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get itemTypeCreateSaveBtn() {
    const ele = $('#itemTypeCreateSaveBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemTypesManageTagsBtn() {
    const ele = $('#itemTypesManageTagsBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get newTagBtn() {
    const ele = $('#newTagBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get newTagName() {
    const ele = $('#newTagName');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get newTagSaveBtn() {
    const ele = $('#newTagSaveBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get tagsModalCloseBtn() {
    const ele = $('#tagsModalCloseBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get tagDeleteSaveBtn() {
    const ele = $('#tagDeleteSaveBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get editItemGroupIdSelector() {
    const ele = $('#editItemGroupIdSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editItemTypeTagsSelector() {
    const ele = $('#editItemTypeTagsSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editNameSelector() {
    const ele = $('#editNameSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editDescriptionSelector() {
    const ele = $('#editDescriptionSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editUsage() {
    const ele = $('#editUsage');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editRiskDescription() {
    const ele = $('#editRiskDescription');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public addNewTags(tags: string[]) {
    this.itemTypesManageTagsBtn.click();
    for (let i = 0; i < tags.length; i++) {
      this.newTagBtn.click();
      this.newTagName.setValue(tags[i]);
      this.newTagSaveBtn.click();
      this.newTagBtn.waitForDisplayed({ timeout: 20000 });
    }
    this.tagsModalCloseBtn.click();
    this.itemTypesManageTagsBtn.waitForDisplayed({ timeout: 20000 });
  }

  public deleteTags(tags: string[]) {
    this.itemTypesManageTagsBtn.click();
    for (let i = 0; i < tags.length; i++) {
      const deleteBtn = $(`#tagName=${tags[i]}`).$('..').$('#deleteTagBtn');
      deleteBtn.waitForDisplayed({ timeout: 20000 });
      deleteBtn.click();
      this.tagDeleteSaveBtn.click();
      this.newTagBtn.waitForDisplayed({ timeout: 20000 });
    }
    this.tagsModalCloseBtn.click();
    this.itemTypesManageTagsBtn.waitForDisplayed({ timeout: 20000 });
  }

  public createInventoryItemTypeOpenModal(itemType?: InventoryItemType) {
    this.itemTypeCreateBtn.click();
    this.itemTypeCreateCancelBtn.waitForClickable({ timeout: 20000 });
    if (itemType) {
      if (itemType.itemGroup) {
        this.createItemGroupIdSelector.$('input').setValue(itemType.itemGroup);
        const value = this.createItemGroupIdSelector.$(
          `.ng-option=${itemType.itemGroup}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
      }
      if (itemType.tags) {
        for (let i = 0; i < itemType.tags.length; i++) {
          this.createItemTypeTagsSelector.$('input').setValue(itemType.tags[i]);
          const value = this.createItemTypeTagsSelector.$(
            `.ng-option=${itemType.tags[i]}`
          );
          value.waitForDisplayed({ timeout: 20000 });
          value.click();
        }
      }
      if (itemType.name) {
        this.createNameSelector.setValue(itemType.name);
      }
      if (itemType.description) {
        this.createDescriptionSelector.setValue(itemType.description);
      }
      if (itemType.usage) {
        this.createUsage.setValue(itemType.usage);
      }
      if (itemType.RiscDescription) {
        this.createRiskDescription.setValue(itemType.RiscDescription);
      }
    }
  }

  public createInventoryItemTypeCloseModal(clickCancel = false) {
    if (clickCancel) {
      this.itemTypeCreateCancelBtn.click();
    } else {
      this.itemTypeCreateSaveBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 60000,
        reverse: true,
      });
    }
    this.itemTypeCreateBtn.waitForDisplayed({ timeout: 20000 });
  }

  public createInventoryItemType(
    itemType?: InventoryItemType,
    clickCancel = false
  ) {
    this.createInventoryItemTypeOpenModal(itemType);
    this.createInventoryItemTypeCloseModal(clickCancel);
  }

  public getInventoryItemTypeByNumber(number: number): InventoryItemTypeObject {
    return new InventoryItemTypeObject(number);
  }

  public getInventoryItemTypeByName(
    nameItemType: string
  ): InventoryItemTypeObject {
    browser.pause(500);
    for (let i = 1; i < this.rowNum + 1; i++) {
      const itemType = this.getInventoryItemTypeByNumber(i);
      if (itemType.name === nameItemType) {
        return itemType;
      }
    }
    return null;
  }

  public getFirstInventoryItemType(): InventoryItemTypeObject {
    return this.getInventoryItemTypeByNumber(1);
  }

  public clearTable() {
    browser.pause(500);
    const rowCount = this.rowNum;
    for (let i = 1; i <= rowCount; i++) {
      const itemType = this.getFirstInventoryItemType();
      itemType.delete();
    }
  }

  public createDummyInventoryItemTypes(
    itemGroup: string,
    tags?: string[],
    createCount = 3
  ) {
    for (let i = 0; i < createCount; i++) {
      const itemType: InventoryItemType = {
        itemGroup: itemGroup,
        RiscDescription: generateRandmString(),
        description: generateRandmString(),
        name: generateRandmString(),
        tags: [...tags[createCount - i - 1]],
        usage: generateRandmString(),
      };
      this.createInventoryItemType(itemType);
    }
  }
}

const inventoryItemTypesPage = new InventoryItemTypesPage();
export default inventoryItemTypesPage;

export class InventoryItemTypeObject {
  constructor(rowNum) {
    this.element = $$('#tableBodyInventoryItemType > tr')[rowNum - 1];
    if (this.element) {
      this.id = +this.element.$('#itemTypeId').getText();
      this.itemTypeDate = parse(
        this.element.$('#itemTypeDate').getText(),
        'dd.MM.yyyy HH:mm:ss',
        new Date()
      );
      this.createdBy = this.element.$('#itemTypeCreatedBy').getText();
      this.parentGroup = this.element.$('#itemParentType').getText();
      this.name = this.element.$('#itemTypeName').getText();
      this.usage = this.element.$('#itemTypeUsage').getText();
      this.description = this.element.$('#itemTypeDescription').getText();
      this.pictogram = this.element.$('#itemTypePictogram');
      this.RiscDescription = this.element
        .$('#itemTypeRiscDescription')
        .getText();
      this.dangerLabel = this.element.$('#itemTypeDangerLabel');
      this.comment = this.element.$('#itemTypeComment').getText();
      this.tags = this.element
        .$$('#assignedTag')
        .map((element) => element.getText());
      this.updateBtn = this.element.$('#editItemTypeBtn');
      this.deleteBtn = this.element.$('#deleteItemTypeBtn');
    }
  }

  public element;
  public id: number;
  public itemTypeDate: Date;
  public createdBy: string;
  public parentGroup: string;
  public name: string;
  public usage: string;
  public description: string;
  public pictogram: string;
  public RiscDescription: string;
  public dangerLabel: string;
  public comment: string;
  public tags: string[];
  public updateBtn;
  public deleteBtn;

  public deleteOpenModal() {
    this.deleteBtn.waitForClickable({ timeout: 20000 });
    this.deleteBtn.scrollIntoView();
    this.deleteBtn.click();
    inventoryItemTypesPage.itemTypeDeleteCancelBtn.waitForDisplayed({
      timeout: 20000,
    });
  }

  public deleteCloseModal(clickCancel = false) {
    if (clickCancel) {
      inventoryItemTypesPage.itemTypeDeleteCancelBtn.click();
    } else {
      inventoryItemTypesPage.itemTypeDeleteConfirmBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    inventoryItemTypesPage.itemTypeCreateBtn.waitForClickable({
      timeout: 20000,
    });
  }

  public delete(clickCancel = false) {
    this.deleteOpenModal();
    this.deleteCloseModal(clickCancel);
  }

  public updateOpenModal(itemType?: InventoryItemType, clearTags = false) {
    this.updateBtn.waitForClickable({ timeout: 20000 });
    this.updateBtn.scrollIntoView();
    this.updateBtn.click();
    inventoryItemTypesPage.itemTypeEditCancelBtn.waitForDisplayed({
      timeout: 20000,
    });
    if (itemType) {
      if (itemType.itemGroup) {
        inventoryItemTypesPage.editItemGroupIdSelector
          .$('input')
          .setValue(itemType.itemGroup);
        const value = inventoryItemTypesPage.editItemGroupIdSelector.$(
          `.ng-option=${itemType.itemGroup}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
      }
      if (clearTags) {
        const clearButtons = inventoryItemTypesPage.editItemTypeTagsSelector.$$(
          'span.ng-value-icon'
        );
        for (let i = 0; i < clearButtons.length; i++) {
          clearButtons[i].click();
        }
      }
      if (itemType.tags && itemType.tags.length > 0) {
        for (let i = 0; i < itemType.tags.length; i++) {
          inventoryItemTypesPage.editItemTypeTagsSelector
            .$('input')
            .setValue(itemType.tags[i]);
          const value = inventoryItemTypesPage.editItemTypeTagsSelector.$(
            `.ng-option=${itemType.tags[i]}`
          );
          value.waitForDisplayed({ timeout: 20000 });
          value.click();
        }
      }
      if (itemType.name || itemType.name === '') {
        inventoryItemTypesPage.editNameSelector.setValue(itemType.name);
      }
      if (itemType.description || itemType.description === '') {
        inventoryItemTypesPage.editDescriptionSelector.setValue(
          itemType.description
        );
      }
      if (itemType.usage) {
        inventoryItemTypesPage.editUsage.setValue(itemType.usage);
      }
      if (itemType.RiscDescription) {
        inventoryItemTypesPage.editRiskDescription.setValue(
          itemType.RiscDescription
        );
      }
    }
  }

  public updateCloseModal(clickCancel = false) {
    if (clickCancel) {
      inventoryItemTypesPage.itemTypeEditCancelBtn.click();
    } else {
      inventoryItemTypesPage.itemTypeEditSaveBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    inventoryItemTypesPage.itemTypeCreateBtn.waitForClickable({
      timeout: 20000,
    });
  }

  public update(
    inventoryItemType: InventoryItemType,
    clearTags = false,
    clickCancel = false
  ) {
    this.updateOpenModal(inventoryItemType, clearTags);
    this.updateCloseModal(clickCancel);
  }
}

export class InventoryItemType {
  public itemGroup: string;
  public tags?: string[];
  public name: string;
  public usage?: string;
  public description: string;
  public RiscDescription?: string;
}
