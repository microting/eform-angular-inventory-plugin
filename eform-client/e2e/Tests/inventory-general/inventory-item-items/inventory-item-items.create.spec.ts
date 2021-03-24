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

describe('Inventory Items Create', function () {
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
    const itemFromTable = inventoryItemsPage.getFirstInventoryItem();
    expect(item.itemType).eq(itemFromTable.itemType);
    expect(item.status).eq(itemFromTable.status);
    expect(item.sn).eq(itemFromTable.sn);
    expect(item.location).eq(itemFromTable.location);
    expect(item.expires).eq(
      format(parse(itemFromTable.expires, 'dd.MM.yyyy', new Date()), 'M/d/yyyy')
    );
    expect(itemType.itemGroup).eq(itemFromTable.itemGroup);
  });
  it('should not created item without item type', function () {
    const countBeforeCreate = inventoryItemsPage.rowNum;
    const itemInvalid: InventoryItem = {
      status: 'På',
      sn: generateRandmString(),
      location: generateRandmString(),
      expires: '10/30/2031',
      itemType: undefined,
    };
    inventoryItemsPage.createInventoryItemOpenModal(itemInvalid);
    expect(inventoryItemsPage.itemCreateConfirmBtn.isEnabled()).eq(false);
    inventoryItemsPage.createInventoryItemCloseModal(true);
    expect(countBeforeCreate, 'item created').eq(inventoryItemsPage.rowNum);
  });
  it('should not created item without location', function () {
    const countBeforeCreate = inventoryItemsPage.rowNum;
    const itemInvalid: InventoryItem = {
      status: 'På',
      sn: generateRandmString(),
      location: undefined,
      expires: '10/30/2031',
      itemType: itemType.name,
    };
    inventoryItemsPage.createInventoryItemOpenModal(itemInvalid);
    expect(inventoryItemsPage.itemCreateConfirmBtn.isEnabled()).eq(false);
    inventoryItemsPage.createInventoryItemCloseModal(true);
    expect(countBeforeCreate, 'item created').eq(inventoryItemsPage.rowNum);
  });
  it('should not created item without item type and location', function () {
    const countBeforeCreate = inventoryItemsPage.rowNum;
    const itemInvalid: InventoryItem = {
      status: 'På',
      sn: generateRandmString(),
      location: undefined,
      expires: '10/30/2031',
      itemType: undefined,
    };
    inventoryItemsPage.createInventoryItemOpenModal(itemInvalid);
    expect(inventoryItemsPage.itemCreateConfirmBtn.isEnabled()).eq(false);
    inventoryItemsPage.createInventoryItemCloseModal(true);
    expect(countBeforeCreate, 'item created').eq(inventoryItemsPage.rowNum);
  });
  after(function () {
    inventoryItemsPage.clearTable();
    inventoryItemTypesPage.goToInventoryItemTypes();
    inventoryItemTypesPage.getInventoryItemTypeByName(itemType.name).delete();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage
      .getInventoryItemGroupByName(itemGroup.name)
      .delete();
  });
});
