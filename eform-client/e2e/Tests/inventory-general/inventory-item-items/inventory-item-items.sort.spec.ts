import loginPage from '../../../Page objects/Login.page';
import inventoryItemsPage from '../../../Page objects/Inventory/Items.page';
import inventoryItemGroupsPage, {
  ItemGroup,
} from '../../../Page objects/Inventory/ItemGroups.page';
import {
  generateRandmString,
  testSorting,
} from '../../../Helpers/helper-functions';
import inventoryItemTypesPage, {
  InventoryItemType,
} from '../../../Page objects/Inventory/ItemTypes.page';
import { format, parse } from 'date-fns';

const expect = require('chai').expect;

const itemGroup: ItemGroup = {
  code: generateRandmString(),
  name: generateRandmString(),
  description: generateRandmString(),
};

const itemType: InventoryItemType = {
  description: generateRandmString(),
  name: generateRandmString(),
  itemGroup: itemGroup.name,
};

const countItems = 3;

describe('Inventory Items Sort', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage.createInventoryItemGroup(itemGroup);
    inventoryItemTypesPage.goToInventoryItemTypes();
    inventoryItemTypesPage.createInventoryItemType(itemType);
    inventoryItemsPage.goToInventoryItems();
  });
  it('should be create dummy items', function () {
    const countBeforeCreate = inventoryItemsPage.rowNum;
    inventoryItemsPage.createDummyInventoryItemTypes(itemType.name, countItems);
    expect(countBeforeCreate + countItems, 'items not created').eq(
      inventoryItemsPage.rowNum
    );
  });
  it('should be able to sort by ID', function () {
    testSorting(inventoryItemsPage.idTableHeader, '#itemId', 'ID');
  });
  it('should be able to sort by ItemType', function () {
    testSorting(inventoryItemsPage.typeTableHeader, '#itemType', 'ItemType');
  });
  it('should be able to sort by Location', function () {
    testSorting(
      inventoryItemsPage.locationTableHeader,
      '#itemLocation',
      'Location'
    );
  });
  // it('should be able to sort by Expires', function () {
  //   testSorting(
  //     inventoryItemsPage.expiresTableHeader,
  //     '#itemExpirationDate',
  //     'Expires',
  //     (ele) => parse(ele.getText(), 'dd.MM.yyyy', new Date())
  //   );
  // });
  // it('should be able to sort by SN', function () {
  //   testSorting(inventoryItemsPage.SNTableHeader, '#itemSN', 'SN');
  // });
  it('should be able to sort by ItemGroups', function () {
    testSorting(
      inventoryItemsPage.itemGroupTableHeader,
      '#itemGroup',
      'ItemGroups'
    );
  });
  it('should be able to sort by Status', function () {
    const mapFunc = (ele) => {
      switch (ele.getText()) {
        case 'På':
          return true;
        case 'Ved':
          return false;
      }
    };
    testSorting(
      inventoryItemsPage.StatusTableHeader,
      '#itemStatus',
      'Status',
      mapFunc
    );
  });
  after(function () {
    inventoryItemsPage.clearTable();
    inventoryItemTypesPage.goToInventoryItemTypes();
    inventoryItemTypesPage.clearTable();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage.clearTable();
  });
});
