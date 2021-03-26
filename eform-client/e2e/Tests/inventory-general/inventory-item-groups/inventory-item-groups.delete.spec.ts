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

describe('Inventory Item Groups Delete', function () {
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
  });
  it('should be not delete item group if click cancel button', function () {
    const countBeforeDelete = inventoryItemGroupsPage.rowNum;
    const itemGroupFromTable = inventoryItemGroupsPage.getInventoryItemGroupByName(
      itemGroup.name
    );
    itemGroupFromTable.deleteOpenModal();
    expect(inventoryItemGroupsPage.selectedItemGroupDescription.getText()).eq(
      itemGroupFromTable.description
    );
    expect(+inventoryItemGroupsPage.selectedItemGroupId.getText()).eq(
      itemGroupFromTable.id
    );
    expect(inventoryItemGroupsPage.selectedItemGroupName.getText()).eq(
      itemGroupFromTable.name
    );
    itemGroupFromTable.deleteCloseModal(true);
    expect(countBeforeDelete, 'item group deleted').eq(
      inventoryItemGroupsPage.rowNum
    );
  });
  it('should be delete item group', function () {
    const countBeforeDelete = inventoryItemGroupsPage.rowNum;
    inventoryItemGroupsPage
      .getInventoryItemGroupByName(itemGroup.name)
      .delete();
    expect(countBeforeDelete - 1, 'item group not deleted').eq(
      inventoryItemGroupsPage.rowNum
    );
  });
});
