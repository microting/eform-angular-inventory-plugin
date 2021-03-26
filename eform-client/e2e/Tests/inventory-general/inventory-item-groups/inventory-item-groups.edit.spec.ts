import loginPage from '../../../Page objects/Login.page';
import inventoryItemGroupsPage, {
  ItemGroup,
} from '../../../Page objects/Inventory/ItemGroups.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const itemGroups: ItemGroup[] = [
  {
    code: generateRandmString(),
    description: generateRandmString(),
    name: generateRandmString(),
  },
  {
    code: generateRandmString(),
    description: generateRandmString(),
    name: generateRandmString(),
  },
  {
    code: generateRandmString(),
    description: generateRandmString(),
    name: generateRandmString(),
  },
];

itemGroups[1].parentGroup = itemGroups[0].name;

describe('Inventory Item Groups Edit', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    inventoryItemGroupsPage.goToInventoryItemGroups();
  });
  it('should be create three item groups without and with parent item group', function () {
    const countBeforeCreate = inventoryItemGroupsPage.rowNum;
    for (let i = 0; i < itemGroups.length; i++) {
      inventoryItemGroupsPage.createInventoryItemGroup(itemGroups[i]);
    }
    expect(countBeforeCreate + itemGroups.length, 'item groups not created').eq(
      inventoryItemGroupsPage.rowNum
    );
  });
  it('should not be edit item group with parent item group if click cancel button', function () {
    const itemGroupWithParentForEdit: ItemGroup = {
      code: generateRandmString(),
      description: generateRandmString(),
      name: generateRandmString(),
      parentGroup: itemGroups[2].name,
    };
    let itemGroup = inventoryItemGroupsPage.getInventoryItemGroupByName(
      itemGroups[1].name
    );
    itemGroup.update(itemGroupWithParentForEdit, true);
    itemGroup = inventoryItemGroupsPage.getInventoryItemGroupByName(
      itemGroups[1].name
    );
    expect(itemGroup.code, 'item group code is not equal').eq(
      itemGroups[1].code
    );
    expect(itemGroup.name, 'item group name is not equal').eq(
      itemGroups[1].name
    );
    expect(itemGroup.description, 'item group description is not equal').eq(
      itemGroups[1].description
    );
    expect(itemGroup.parentGroup, 'item group parent is not equal').eq(
      itemGroups[1].parentGroup
    );
  });
  it('should be edit item group with parent item group', function () {
    let itemGroup = inventoryItemGroupsPage.getInventoryItemGroupByName(
      itemGroups[1].name
    );

    itemGroups[1].code = generateRandmString();
    itemGroups[1].description = generateRandmString();
    itemGroups[1].name = generateRandmString();
    itemGroups[1].parentGroup = itemGroups[2].name;

    itemGroup.update(itemGroups[1]);
    itemGroup = inventoryItemGroupsPage.getInventoryItemGroupByName(
      itemGroups[1].name
    );
    expect(itemGroup.code, 'item group code is not equal').eq(
      itemGroups[1].code
    );
    expect(itemGroup.name, 'item group name is not equal').eq(
      itemGroups[1].name
    );
    expect(itemGroup.description, 'item group description is not equal').eq(
      itemGroups[1].description
    );
    expect(itemGroup.parentGroup, 'item group parent is not equal').eq(
      itemGroups[1].parentGroup
    );
  });
  it('should not be edit item group without name', function () {
    const objForEdit: ItemGroup = {
      ...itemGroups[0],
      name: '',
    };
    const itemGroup = inventoryItemGroupsPage.getInventoryItemGroupByName(
      itemGroups[0].name
    );
    itemGroup.updateOpenModal(objForEdit);
    expect(
      inventoryItemGroupsPage.itemGroupUpdateConfirmBtn.isClickable(),
      'update btn is clickable'
    ).eq(false);
    itemGroup.updateCloseModal(true);
  });
  it('should not be edit item group without description', function () {
    const objForEdit: ItemGroup = {
      ...itemGroups[0],
      description: '',
    };
    const itemGroup = inventoryItemGroupsPage.getInventoryItemGroupByName(
      itemGroups[0].name
    );
    itemGroup.updateOpenModal(objForEdit);
    expect(
      inventoryItemGroupsPage.itemGroupUpdateConfirmBtn.isClickable(),
      'update btn is clickable'
    ).eq(false);
    itemGroup.updateCloseModal(true);
  });
  it('should not be edit item group without name and description', function () {
    const objForEdit: ItemGroup = {
      ...itemGroups[0],
      name: '',
      description: '',
    };
    const itemGroup = inventoryItemGroupsPage.getInventoryItemGroupByName(
      itemGroups[0].name
    );
    itemGroup.updateOpenModal(objForEdit);
    expect(
      inventoryItemGroupsPage.itemGroupUpdateConfirmBtn.isClickable(),
      'update btn is clickable'
    ).eq(false);
    itemGroup.updateCloseModal(true);
  });
  after(function () {
    inventoryItemGroupsPage.clearTable();
  });
});
