import loginPage from '../../../Page objects/Login.page';
import inventoryItemTypesPage, {
  InventoryItemType,
} from '../../../Page objects/Inventory/ItemTypes.page';
import inventoryItemGroupsPage, {
  ItemGroup,
} from '../../../Page objects/Inventory/ItemGroups.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;

const itemGroups: ItemGroup[] = [
  {
    code: generateRandmString(),
    name: generateRandmString(),
    description: generateRandmString(),
  },
  {
    code: generateRandmString(),
    name: generateRandmString(),
    description: generateRandmString(),
  },
];

const itemType: InventoryItemType = {
  RiscDescription: generateRandmString(),
  usage: generateRandmString(),
  description: generateRandmString(),
  name: generateRandmString(),
  itemGroup: itemGroups[0].name,
  tags: [generateRandmString(), generateRandmString()],
};

const tagsForEdit = [generateRandmString(), generateRandmString()];

describe('Inventory Item Types Page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    inventoryItemGroupsPage.createInventoryItemGroup(itemGroups[0]);
    inventoryItemGroupsPage.createInventoryItemGroup(itemGroups[1]);
    inventoryItemTypesPage.goToInventoryItemTypes();
  });
  it('should be create item type', function () {
    inventoryItemTypesPage.addNewTags([...itemType.tags, ...tagsForEdit]);
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    inventoryItemTypesPage.createInventoryItemType(itemType);
    expect(countBeforeCreate + 1, 'item type not be created').eq(
      inventoryItemTypesPage.rowNum
    );
  });
  it('should be edited item type', function () {
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    let inventoryItemTypeFromTable = inventoryItemTypesPage.getInventoryItemTypeByName(
      itemType.name
    );
    itemType.name = generateRandmString();
    itemType.usage = generateRandmString();
    itemType.description = generateRandmString();
    itemType.RiscDescription = generateRandmString();
    itemType.itemGroup = itemGroups[1].name;
    itemType.tags = tagsForEdit;
    inventoryItemTypeFromTable.update(itemType, true);
    expect(inventoryItemTypesPage.rowNum).eq(countBeforeCreate);
    inventoryItemTypeFromTable = inventoryItemTypesPage.getInventoryItemTypeByName(
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
  it('should not edited item type without name', function () {
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    const inventoryItemTypeFromTable = inventoryItemTypesPage.getInventoryItemTypeByName(
      itemType.name
    );
    const itemTypeInvalid: InventoryItemType = {
      RiscDescription: generateRandmString(),
      usage: generateRandmString(),
      description: generateRandmString(),
      name: '',
      itemGroup: undefined,
    };
    inventoryItemTypeFromTable.updateOpenModal(itemTypeInvalid);
    expect(inventoryItemTypesPage.itemTypeEditSaveBtn.isEnabled()).eq(false);
    inventoryItemTypeFromTable.updateCloseModal(true);
    expect(inventoryItemTypesPage.rowNum).eq(countBeforeCreate);
  });
  it('should not edited item type without description', function () {
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    const inventoryItemTypeFromTable = inventoryItemTypesPage.getInventoryItemTypeByName(
      itemType.name
    );
    const itemTypeInvalid: InventoryItemType = {
      RiscDescription: generateRandmString(),
      usage: generateRandmString(),
      description: '',
      name: generateRandmString(),
      itemGroup: undefined,
    };
    inventoryItemTypeFromTable.updateOpenModal(itemTypeInvalid);
    expect(inventoryItemTypesPage.itemTypeEditSaveBtn.isEnabled()).eq(false);
    inventoryItemTypeFromTable.updateCloseModal(true);
    expect(inventoryItemTypesPage.rowNum).eq(countBeforeCreate);
  });
  it('should not edited item type without name and description', function () {
    const countBeforeCreate = inventoryItemTypesPage.rowNum;
    const inventoryItemTypeFromTable = inventoryItemTypesPage.getInventoryItemTypeByName(
      itemType.name
    );
    const itemTypeInvalid: InventoryItemType = {
      RiscDescription: generateRandmString(),
      usage: generateRandmString(),
      description: '',
      name: '',
      itemGroup: undefined,
    };
    inventoryItemTypeFromTable.updateOpenModal(itemTypeInvalid);
    expect(inventoryItemTypesPage.itemTypeEditSaveBtn.isEnabled()).eq(false);
    inventoryItemTypeFromTable.updateCloseModal(true);
    expect(inventoryItemTypesPage.rowNum).eq(countBeforeCreate);
  });
  after(function () {
    inventoryItemTypesPage.clearTable();
    inventoryItemGroupsPage.goToInventoryItemGroups();
    for (let i = 0; i < itemGroups.length; i++) {
      inventoryItemGroupsPage
        .getInventoryItemGroupByName(itemGroups[i].name)
        .delete();
    }
  });
});
