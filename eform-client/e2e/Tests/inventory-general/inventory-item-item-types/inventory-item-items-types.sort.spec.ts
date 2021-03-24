import loginPage from '../../../Page objects/Login.page';
import inventoryItemGroupsPage, {
  ItemGroup,
} from '../../../Page objects/Inventory/ItemGroups.page';
import {
  generateRandmString,
  testSorting,
} from '../../../Helpers/helper-functions';
import inventoryItemTypesPage from '../../../Page objects/Inventory/ItemTypes.page';

const expect = require('chai').expect;

const itemGroup: ItemGroup = {
  code: generateRandmString(),
  name: generateRandmString(),
  description: generateRandmString(),
};
const tags = [
  generateRandmString(),
  generateRandmString(),
  generateRandmString(),
];
const countItemTypes = 3;

describe('Inventory Item Type Sort', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage.createInventoryItemGroup(itemGroup);
    inventoryItemTypesPage.goToInventoryItemTypes();
  });
  it('should be create dummy item types', function () {
    inventoryItemTypesPage.addNewTags(tags);
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    inventoryItemTypesPage.createDummyInventoryItemTypes(
      itemGroup.name,
      tags,
      countItemTypes
    );
    expect(countBeforeCreate + countItemTypes, 'item types not created').eq(
      inventoryItemTypesPage.rowNum
    );
  });
  it('should be able to sort by ID', function () {
    testSorting(inventoryItemTypesPage.idTableHeader, '#itemTypeId', 'ID');
  });
  it('should be able to sort by CreatedDate', function () {
    testSorting(
      inventoryItemTypesPage.dateTableHeader,
      '#itemTypeDate',
      'CreatedDate'
    );
  });
  it('should be able to sort by Name', function () {
    testSorting(
      inventoryItemTypesPage.nameTableHeader,
      '#itemTypeName',
      'Name'
    );
  });
  it('should be able to sort by Usage', function () {
    testSorting(
      inventoryItemTypesPage.usageTableHeader,
      '#itemTypeUsage',
      'Usage'
    );
  });
  it('should be able to sort by Description', function () {
    testSorting(
      inventoryItemTypesPage.descriptionTableHeader,
      '#itemTypeDescription',
      'Description'
    );
  });
  it('should be able to sort by RiscDescription', function () {
    testSorting(
      inventoryItemTypesPage.riscDescriptionTableHeader,
      '#itemTypeRiscDescription',
      'RiscDescription'
    );
  });
  after(function () {
    inventoryItemTypesPage.clearTable();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage.clearTable();
  });
});
