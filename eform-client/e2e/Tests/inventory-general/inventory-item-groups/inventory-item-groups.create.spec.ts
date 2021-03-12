import loginPage from '../../../Page objects/Login.page';
import inventoryItemGroupsPage, {
  ItemGroup,
} from '../../../Page objects/Inventory/ItemGroups.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const itemGroup: ItemGroup = {
  code: generateRandmString(),
  description: generateRandmString(),
  name: generateRandmString(),
};

describe('Inventory Item Groups Create', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    inventoryItemGroupsPage.goToInventoryItemGroups();
  });
  it('should be create item group without parent item group', function () {
    const countBeforeCreate = inventoryItemGroupsPage.rowNum;
    inventoryItemGroupsPage.createInventoryItemGroup(itemGroup);
    expect(countBeforeCreate + 1, 'item group not created').eq(
      inventoryItemGroupsPage.rowNum
    );
    const itemGroupFromTable = inventoryItemGroupsPage.getInventoryItemGroupByName(
      itemGroup.name
    );
    expect(itemGroupFromTable.code, 'item group code is not equal').eq(
      itemGroup.code
    );
    expect(itemGroupFromTable.name, 'item group name is not equal').eq(
      itemGroup.name
    );
    expect(
      itemGroupFromTable.description,
      'item group description is not equal'
    ).eq(itemGroup.description);
    expect(itemGroupFromTable.parentGroup, 'item group parent is not empty').eq(
      ''
    );
  });
  it('should be create item group with parent item group', function () {
    const countBeforeCreate = inventoryItemGroupsPage.rowNum;
    const itemGroupWithParent: ItemGroup = {
      code: generateRandmString(),
      description: generateRandmString(),
      name: generateRandmString(),
      parentGroup: itemGroup.name,
    };
    inventoryItemGroupsPage.createInventoryItemGroup(itemGroupWithParent);
    expect(countBeforeCreate + 1, 'item group not created').eq(
      inventoryItemGroupsPage.rowNum
    );
    const itemGroupFromTable = inventoryItemGroupsPage.getInventoryItemGroupByName(
      itemGroupWithParent.name
    );
    expect(itemGroupFromTable.code, 'item group code is not equal').eq(
      itemGroupWithParent.code
    );
    expect(itemGroupFromTable.name, 'item group name is not equal').eq(
      itemGroupWithParent.name
    );
    expect(
      itemGroupFromTable.description,
      'item group description is not equal'
    ).eq(itemGroupWithParent.description);
    expect(itemGroupFromTable.parentGroup, 'item group parent is not equal').eq(
      itemGroupWithParent.parentGroup
    );
    itemGroupFromTable.delete();
  });
  it('should not be create item group without name', function () {
    const countBeforeCreate = inventoryItemGroupsPage.rowNum;
    const itemGroupWithoutName: ItemGroup = {
      code: generateRandmString(),
      description: generateRandmString(),
      name: undefined,
      parentGroup: itemGroup.name,
    };
    inventoryItemGroupsPage.createOpenModal(itemGroupWithoutName);
    expect(
      inventoryItemGroupsPage.itemGroupCreateConfirmBtn.isClickable(),
      'button create is clickable'
    ).eq(false);
    inventoryItemGroupsPage.createCloseModal(true);
    expect(countBeforeCreate, 'item group created').eq(
      inventoryItemGroupsPage.rowNum
    );
  });
  it('should not be create item group without description', function () {
    const countBeforeCreate = inventoryItemGroupsPage.rowNum;
    const itemGroupWithoutName: ItemGroup = {
      code: generateRandmString(),
      description: undefined,
      name: generateRandmString(),
      parentGroup: itemGroup.name,
    };
    inventoryItemGroupsPage.createOpenModal(itemGroupWithoutName);
    expect(
      inventoryItemGroupsPage.itemGroupCreateConfirmBtn.isClickable(),
      'button create is clickable'
    ).eq(false);
    inventoryItemGroupsPage.createCloseModal(true);
    expect(countBeforeCreate, 'item group created').eq(
      inventoryItemGroupsPage.rowNum
    );
  });
  it('should not be create item group without name and description', function () {
    const countBeforeCreate = inventoryItemGroupsPage.rowNum;
    const itemGroupWithoutName: ItemGroup = {
      code: generateRandmString(),
      description: undefined,
      name: undefined,
      parentGroup: itemGroup.name,
    };
    inventoryItemGroupsPage.createOpenModal(itemGroupWithoutName);
    expect(
      inventoryItemGroupsPage.itemGroupCreateConfirmBtn.isClickable(),
      'button create is clickable'
    ).eq(false);
    inventoryItemGroupsPage.createCloseModal(true);
    expect(countBeforeCreate, 'item group created').eq(
      inventoryItemGroupsPage.rowNum
    );
  });
  it('should not be create item group if click cancel button', function () {
    const countBeforeCreate = inventoryItemGroupsPage.rowNum;
    const itemGroupWithoutName: ItemGroup = {
      code: generateRandmString(),
      description: generateRandmString(),
      name: generateRandmString(),
      parentGroup: itemGroup.name,
    };
    inventoryItemGroupsPage.createInventoryItemGroup(
      itemGroupWithoutName,
      true
    );
    expect(countBeforeCreate, 'item group created').eq(
      inventoryItemGroupsPage.rowNum
    );
  });
  after(function () {
    inventoryItemGroupsPage
      .getInventoryItemGroupByName(itemGroup.name)
      .delete();
  });
});
