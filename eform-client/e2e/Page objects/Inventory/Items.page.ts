import { PageWithNavbarPage } from '../PageWithNavbar.page';

class InventoryItemsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#tableBodyInventoryItems > tr').length;
  }

  public goToInventoryItems() {
    this.inventoryPn.click();
    this.inventoryPnItems.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 60000, reverse: true });
    this.itemCreateBtn.waitForClickable({ timeout: 20000 });
  }

  public get inventoryPnItems() {
    const ele = $('#inventory-pn-items');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get inventoryPn() {
    const ele = $('#inventory-pn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get itemCreateBtn() {
    const ele = $('#itemCreateBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get SNFilterInput() {
    const ele = $('#SNFilterInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemCreateExpiresInput() {
    const ele = $('#itemCreateExpiresInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemCreateLocationInput() {
    const ele = $('#itemCreateLocationInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemCreateSNInput() {
    const ele = $('#itemCreateSNInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemCreateAvailableSelector() {
    const ele = $('#itemCreateAvailableSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemCreateCancelBtn() {
    const ele = $('#itemCreateCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get itemCreateConfirmBtn() {
    const ele = $('#itemCreateConfirmBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemEditTypeSelector() {
    const ele = $('#itemEditTypeSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemEditExpiresInput() {
    const ele = $('#itemEditExpiresInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemEditLocationInput() {
    const ele = $('#itemEditLocationInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemEditSNInput() {
    const ele = $('#itemEditSNInput');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemEditAvailableSelector() {
    const ele = $('#itemEditAvailableSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemEditCancelBtn() {
    const ele = $('#itemEditCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get itemEditConfirmBtn() {
    const ele = $('#itemEditConfirmBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get selectedItemId() {
    const ele = $('#selectedItemId');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get selectedItemSN() {
    const ele = $('#selectedItemSN');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get selectedItemLocation() {
    const ele = $('#selectedItemLocation');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemDeleteConfirmBtn() {
    const ele = $('#itemDeleteConfirmBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get itemDeleteCancelBtn() {
    const ele = $('#itemDeleteCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get itemCreateTypeSelector() {
    const ele = $('#itemCreateTypeSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public createInventoryItemOpenModal(inventoryItem?: InventoryItem) {
    this.itemCreateBtn.click();
    this.itemCreateCancelBtn.waitForClickable({ timeout: 20000 });
    if (inventoryItem) {
      if (inventoryItem.itemType) {
        this.itemCreateTypeSelector.$('input').setValue(inventoryItem.itemType);
        const value = this.itemCreateTypeSelector.$(
          `.ng-option=${inventoryItem.itemType}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
      }
      if (inventoryItem.expires) {
        this.itemCreateExpiresInput.setValue(inventoryItem.expires);
      }
      if (inventoryItem.location) {
        this.itemCreateLocationInput.setValue(inventoryItem.location);
      }
      if (inventoryItem.sn) {
        this.itemCreateSNInput.setValue(inventoryItem.sn);
      }
      if (inventoryItem.status !== undefined) {
        this.itemCreateAvailableSelector
          .$('input')
          .setValue(inventoryItem.status);
        const value = this.itemCreateAvailableSelector.$(
          `.ng-option=${inventoryItem.status}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
      }
    }
  }

  public createInventoryItemCloseModal(clickCancel = false) {
    if (clickCancel) {
      this.itemCreateCancelBtn.click();
    } else {
      inventoryItemsPage.itemCreateConfirmBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    inventoryItemsPage.itemCreateBtn.waitForClickable({ timeout: 20000 });
  }

  public createInventoryItem(
    inventoryItem: InventoryItem,
    clickCancel = false
  ) {
    this.createInventoryItemOpenModal(inventoryItem);
    this.createInventoryItemCloseModal(clickCancel);
  }
}

const inventoryItemsPage = new InventoryItemsPage();
export default inventoryItemsPage;

export class InventoryItemObject {
  constructor(rowNum) {
    this.element = $$('#tableBodyInventoryItems > tr')[rowNum - 1];
    if (this.element) {
      this.id = +this.element.$('#itemId').getText();
      this.itemType = this.element.$('#itemType').getText();
      this.location = this.element.$('#itemLocation').getText();
      this.expires = this.element.$('#itemExpirationDate').getText();
      this.sn = this.element.$('#itemSN').getText();
      this.status = this.element.$('#itemStatus').getText();
      this.updateBtn = this.element.$('#editItemBtn');
      this.deleteBtn = this.element.$('#deleteItemBtn');
    }
  }

  public element;
  public id: number;
  public itemType: string;
  public location: string;
  public expires: string;
  public sn: string;
  public status: string;
  public updateBtn;
  public deleteBtn;

  public deleteOpenModal() {
    this.deleteBtn.waitForClickable({ timeout: 20000 });
    this.deleteBtn.scrollIntoView();
    this.deleteBtn.click();
    inventoryItemsPage.itemDeleteConfirmBtn.waitForDisplayed({
      timeout: 20000,
    });
  }

  public deleteCloseModal(clickCancel = false) {
    if (clickCancel) {
      inventoryItemsPage.itemDeleteCancelBtn.click();
    } else {
      inventoryItemsPage.itemDeleteConfirmBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    inventoryItemsPage.itemCreateBtn.waitForClickable({ timeout: 20000 });
  }

  public delete(clickCancel = false) {
    this.deleteOpenModal();
    this.deleteCloseModal(clickCancel);
    inventoryItemsPage.itemCreateBtn.waitForClickable({ timeout: 20000 });
  }

  public updateOpenModal(inventoryItem?: InventoryItem) {
    this.updateBtn.waitForClickable({ timeout: 20000 });
    this.updateBtn.scrollIntoView();
    this.updateBtn.click();
    inventoryItemsPage.itemEditCancelBtn.waitForDisplayed({ timeout: 20000 });
    if (inventoryItem) {
      if (inventoryItem.itemType && inventoryItem.itemType !== this.itemType) {
        inventoryItemsPage.itemEditTypeSelector
          .$('input')
          .setValue(inventoryItem.itemType);
        const value = inventoryItemsPage.itemEditTypeSelector.$(
          `.ng-option=${inventoryItem.itemType}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
      }
      if (inventoryItem.expires && inventoryItem.expires !== this.expires) {
        inventoryItemsPage.itemEditExpiresInput.setValue(inventoryItem.expires);
      }
      if (inventoryItem.location && inventoryItem.location !== this.location) {
        inventoryItemsPage.itemEditLocationInput.setValue(
          inventoryItem.location
        );
      }
      if (inventoryItem.sn && inventoryItem.sn !== this.sn) {
        inventoryItemsPage.itemEditSNInput.setValue(inventoryItem.sn);
      }
      if (
        inventoryItem.status !== undefined &&
        inventoryItem.status !== this.status
      ) {
        inventoryItemsPage.itemEditAvailableSelector
          .$('input')
          .setValue(inventoryItem.status);
        const value = inventoryItemsPage.itemEditAvailableSelector.$(
          `.ng-option=${inventoryItem.status}`
        );
        value.waitForDisplayed({ timeout: 20000 });
        value.click();
      }
    }
  }

  public updateCloseModal(clickCancel = false) {
    if (clickCancel) {
      inventoryItemsPage.itemEditCancelBtn.click();
    } else {
      inventoryItemsPage.itemEditConfirmBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    inventoryItemsPage.itemCreateBtn.waitForClickable({ timeout: 20000 });
  }

  public update(inventoryItem: InventoryItem, clickCancel = false) {
    this.updateOpenModal(inventoryItem);
    this.updateCloseModal(clickCancel);
    inventoryItemsPage.itemCreateBtn.waitForClickable({ timeout: 20000 });
  }
}

export class InventoryItem {
  public itemType: string;
  public location: string;
  public expires: string;
  public sn: string;
  public status: string;
}
