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

describe('Inventory Items Edit', function () {
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
  it('should be edited item', function () {
    const countBeforeCreate = inventoryItemsPage.rowNum;
    item.location = generateRandmString();
    item.sn = generateRandmString();
    item.status = 'Ved';
    item.expires = '11/21/2032';
    inventoryItemsPage.getFirstInventoryItem().update(item);
    expect(countBeforeCreate, 'item created').eq(inventoryItemsPage.rowNum);
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
  it('should not edited item without location', function () {
    const countBeforeCreate = inventoryItemsPage.rowNum;
    const itemInvalid: InventoryItem = {
      status: 'På',
      sn: generateRandmString(),
      location: '',
      expires: '10/30/2031',
      itemType: itemType.name,
    };
    const itemFromTable = inventoryItemsPage.getFirstInventoryItem();
    itemFromTable.updateOpenModal(itemInvalid);
    expect(inventoryItemsPage.itemEditConfirmBtn.isEnabled()).eq(false);
    itemFromTable.updateCloseModal(true);
    expect(countBeforeCreate, 'item created').eq(inventoryItemsPage.rowNum);
  });
  after(function () {
    inventoryItemsPage.clearTable();
    inventoryItemTypesPage.goToInventoryItemTypes();
    inventoryItemTypesPage.clearTable();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage.clearTable();
  });
});
