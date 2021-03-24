import loginPage from '../../../Page objects/Login.page';
import inventoryItemsPage, {
  InventoryItem,
} from '../../../Page objects/Inventory/Items.page';
import inventoryItemGroupsPage, {
  ItemGroup,
} from '../../../Page objects/Inventory/ItemGroups.page';
import { generateRandmString } from '../../../Helpers/helper-functions';
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

const item: InventoryItem = {
  status: 'På',
  sn: generateRandmString(),
  location: generateRandmString(),
  expires: '10/30/2031',
  itemType: itemType.name,
};

describe('Inventory Items Delete', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage.createInventoryItemGroup(itemGroup);
    inventoryItemTypesPage.goToInventoryItemTypes();
    inventoryItemTypesPage.createInventoryItemType(itemType);
    inventoryItemsPage.goToInventoryItems();
  });
  it('should be created item', function () {
    const countBeforeCreate = inventoryItemsPage.rowNum;
    inventoryItemsPage.createInventoryItem(item);
    expect(countBeforeCreate + 1, 'item not created').eq(
      inventoryItemsPage.rowNum
    );
  });
  it('should not delete item if click cancel', function () {
    const countBeforeDelete = inventoryItemsPage.rowNum;
    const itemFromTable = inventoryItemsPage.getFirstInventoryItem();
    itemFromTable.deleteOpenModal();
    expect(+inventoryItemsPage.selectedItemId.getText()).eq(itemFromTable.id);
    expect(inventoryItemsPage.selectedItemLocation.getText()).eq(
      itemFromTable.location
    );
    expect(inventoryItemsPage.selectedItemSN.getText()).eq(itemFromTable.sn);
    itemFromTable.deleteCloseModal(true);
    expect(countBeforeDelete, 'item deleted').eq(inventoryItemsPage.rowNum);
  });
  it('should deleted item', function () {
    const countBeforeDelete = inventoryItemsPage.rowNum;
    const itemFromTable = inventoryItemsPage.getFirstInventoryItem();
    itemFromTable.delete();
    expect(countBeforeDelete - 1, 'item not deleted').eq(
      inventoryItemsPage.rowNum
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
