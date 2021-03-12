import loginPage from '../../../Page objects/Login.page';
import inventoryItemsPage from '../../../Page objects/Inventory/Items.page';

const expect = require('chai').expect;

describe('Inventory Items Page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    inventoryItemsPage.goToInventoryItems();
  });
});
