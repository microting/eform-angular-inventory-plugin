import loginPage from '../../../Page objects/Login.page';
import inventoryItemTypesPage, {
  InventoryItemType,
} from '../../../Page objects/Inventory/ItemTypes.page';
import inventoryItemGroupsPage, {
  ItemGroup,
} from '../../../Page objects/Inventory/ItemGroups.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;

const itemGroup: ItemGroup = {
  code: generateRandmString(),
  name: generateRandmString(),
  description: generateRandmString(),
};

const itemType: InventoryItemType = {
  RiscDescription: generateRandmString(),
  usage: generateRandmString(),
  description: generateRandmString(),
  name: generateRandmString(),
  itemGroup: itemGroup.name,
};

describe('Inventory Item Types Delete', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage.createInventoryItemGroup(itemGroup);
    inventoryItemTypesPage.goToInventoryItemTypes();
  });
  it('should be create item type', function () {
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    inventoryItemTypesPage.createInventoryItemType(itemType);
    expect(countBeforeCreate + 1, 'item type not be created').eq(
      inventoryItemTypesPage.rowNum
    );
  });
  it('should be not delete item type', function () {
    const countBeforeDelete = inventoryItemTypesPage.rowNum;
    const inventoryItemTypeObject = inventoryItemTypesPage.getInventoryItemTypeByName(
      itemType.name
    );
    inventoryItemTypeObject.deleteOpenModal();
    expect(inventoryItemTypesPage.selectedItemTypeId.getText()).equal(
      inventoryItemTypeObject.id
    );
    expect(inventoryItemTypesPage.selectedItemTypeDescription.getText()).equal(
      inventoryItemTypeObject.description
    );
    expect(inventoryItemTypesPage.selectedItemTypeName.getText()).equal(
      inventoryItemTypeObject.name
    );
    inventoryItemTypeObject.deleteCloseModal(true);
    expect(countBeforeDelete, 'item type be deleted').eq(
      inventoryItemTypesPage.rowNum
    );
  });
  it('should be delete item type', function () {
    const countBeforeDelete = inventoryItemTypesPage.rowNum;
    const inventoryItemTypeObject = inventoryItemTypesPage.getInventoryItemTypeByName(
      itemType.name
    );
    inventoryItemTypeObject.delete();
    expect(countBeforeDelete - 1, 'item type not be deleted').eq(
      inventoryItemTypesPage.rowNum
    );
  });
  after(function () {
    inventoryItemTypesPage.clearTable();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage
      .getInventoryItemGroupByName(itemGroup.name)
      .delete();
  });
});
