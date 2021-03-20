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
  tags: [generateRandmString(), generateRandmString()],
};

describe('Inventory Item Types Create', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage.createInventoryItemGroup(itemGroup);
    inventoryItemTypesPage.goToInventoryItemTypes();
  });
  it('should be create item type', function () {
    inventoryItemTypesPage.addNewTags(itemType.tags);
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    inventoryItemTypesPage.createInventoryItemType(itemType);
    expect(countBeforeCreate + 1, 'item type not be created').eq(
      inventoryItemTypesPage.rowNum
    );
    const inventoryItemTypeFromTable = inventoryItemTypesPage.getInventoryItemTypeByName(
      itemType.name
    );
    expect(inventoryItemTypeFromTable.name, 'name not equal').eq(itemType.name);
    expect(inventoryItemTypeFromTable.description, 'description not equal').eq(
      itemType.description
    );
    expect(
      inventoryItemTypeFromTable.RiscDescription,
      'RiscDescription not equal'
    ).eq(itemType.RiscDescription);
    expect(inventoryItemTypeFromTable.usage, 'usage not equal').eq(
      itemType.usage
    );
    expect(inventoryItemTypeFromTable.tags.length).eq(itemType.tags.length);
    expect(inventoryItemTypeFromTable.tags).to.include.members(itemType.tags);
  });
  it('should not created item type without item group', function () {
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    const itemTypeInvalid: InventoryItemType = {
      RiscDescription: generateRandmString(),
      usage: generateRandmString(),
      description: generateRandmString(),
      name: generateRandmString(),
      itemGroup: undefined,
      tags: [...itemType.tags],
    };
    inventoryItemTypesPage.createInventoryItemTypeOpenModal(itemTypeInvalid);
    expect(inventoryItemTypesPage.itemTypeCreateSaveBtn.isEnabled()).eq(false);
    inventoryItemTypesPage.createInventoryItemTypeCloseModal(true);
    expect(inventoryItemTypesPage.rowNum).eq(countBeforeCreate);
  });
  it('should not created item type without name', function () {
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    const itemTypeInvalid: InventoryItemType = {
      RiscDescription: generateRandmString(),
      usage: generateRandmString(),
      description: generateRandmString(),
      name: undefined,
      itemGroup: itemGroup.name,
      tags: [...itemType.tags],
    };
    inventoryItemTypesPage.createInventoryItemTypeOpenModal(itemTypeInvalid);
    expect(inventoryItemTypesPage.itemTypeCreateSaveBtn.isEnabled()).eq(false);
    inventoryItemTypesPage.createInventoryItemTypeCloseModal(true);
    expect(inventoryItemTypesPage.rowNum).eq(countBeforeCreate);
  });
  it('should not created item type without description', function () {
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    const itemTypeInvalid: InventoryItemType = {
      RiscDescription: generateRandmString(),
      usage: generateRandmString(),
      description: undefined,
      name: generateRandmString(),
      itemGroup: itemGroup.name,
      tags: [...itemType.tags],
    };
    inventoryItemTypesPage.createInventoryItemTypeOpenModal(itemTypeInvalid);
    expect(inventoryItemTypesPage.itemTypeCreateSaveBtn.isEnabled()).eq(false);
    inventoryItemTypesPage.createInventoryItemTypeCloseModal(true);
    expect(inventoryItemTypesPage.rowNum).eq(countBeforeCreate);
  });
  it('should not created item type without item group, name and description', function () {
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    const itemTypeInvalid: InventoryItemType = {
      RiscDescription: generateRandmString(),
      usage: generateRandmString(),
      description: undefined,
      name: undefined,
      itemGroup: undefined,
      tags: [...itemType.tags],
    };
    inventoryItemTypesPage.createInventoryItemTypeOpenModal(itemTypeInvalid);
    expect(inventoryItemTypesPage.itemTypeCreateSaveBtn.isEnabled()).eq(false);
    inventoryItemTypesPage.createInventoryItemTypeCloseModal(true);
    expect(inventoryItemTypesPage.rowNum).eq(countBeforeCreate);
  });
  it('should delete tag from table after delete tag from list tags', function () {
    inventoryItemTypesPage.deleteTags([itemType.tags[0]]);
    itemType.tags.splice(0, 1);
    loginPage.open('/');
    inventoryItemTypesPage.goToInventoryItemTypes();
    const inventoryItemTypeFromTable = inventoryItemTypesPage.getInventoryItemTypeByName(
      itemType.name
    );
    expect(inventoryItemTypeFromTable.tags.length).eq(itemType.tags.length);
    expect(inventoryItemTypeFromTable.tags).to.include.members(itemType.tags);
  });
  after(function () {
    inventoryItemTypesPage.deleteTags(itemType.tags);
    inventoryItemTypesPage.clearTable();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage
      .getInventoryItemGroupByName(itemGroup.name)
      .delete();
  });
});
