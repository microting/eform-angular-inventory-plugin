import loginPage from '../../../Page objects/Login.page';
import inventoryItemGroupsPage, {
  ItemGroup,
} from '../../../Page objects/Inventory/ItemGroups.page';
import {
  generateRandmString,
  testSorting,
} from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
let itemGroups: ItemGroup[] = [
  {
    code: generateRandmString(),
    description: generateRandmString(),
    name: generateRandmString(),
  },
];
const countItemGroup = 3;

describe('Inventory Item Groups Sort', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    inventoryItemGroupsPage.goToInventoryItemGroups();
  });
  it('should be create item groups without and with parent item group', function () {
    const countBeforeCreate = inventoryItemGroupsPage.rowNum;
    inventoryItemGroupsPage.createInventoryItemGroup(itemGroups[0]);
    itemGroups = [
      ...inventoryItemGroupsPage.createDummyInventoryItemGroups(
        countItemGroup - 1,
        itemGroups[0].name
      ),
    ];
    expect(countBeforeCreate + countItemGroup, 'item groups not created').eq(
      inventoryItemGroupsPage.rowNum
    );
  });
  it('should be able to sort by ID', function () {
    testSorting(inventoryItemGroupsPage.idTableHeader, '#itemGroupId', 'ID');
  });
  it('should be able to sort by Code', function () {
    testSorting(
      inventoryItemGroupsPage.codeTableHeader,
      '#itemGroupCode',
      'Code'
    );
  });
  it('should be able to sort by Name', function () {
    testSorting(
      inventoryItemGroupsPage.nameTableHeader,
      '#itemGroupName',
      'Name'
    );
  });
  it('should be able to sort by Description', function () {
    testSorting(
      inventoryItemGroupsPage.descriptionTableHeader,
      '#itemGroupDescription',
      'Description'
    );
  });
  it('should be able to sort by Parent group', function () {
    testSorting(
      inventoryItemGroupsPage.parentGroupTableHeader,
      '#itemGroupParent',
      'Parent group'
    );
  });
  after(function () {
    inventoryItemGroupsPage.clearTable();
  });
});
