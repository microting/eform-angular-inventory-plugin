import loginPage from '../../../Page objects/Login.page';
import inventoryItemGroupsPage, {
  ItemGroup,
} from '../../../Page objects/Inventory/ItemGroups.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
let itemGroups: ItemGroup[] = [
  {
    code: generateRandmString(),
    description: generateRandmString(),
    name: generateRandmString(),
  },
];
const countItemGroup = 3;

describe('Inventory Item Groups Edit', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    inventoryItemGroupsPage.goToInventoryItemGroups();
  });
  it('should be create item groups without and with parent item group', function () {
    const countBeforeCreate = inventoryItemGroupsPage.rowNum;
    inventoryItemGroupsPage.createInventoryItemGroup(itemGroups[0]);
    itemGroups = [
      ...inventoryItemGroupsPage.createDummyInventoryItemGroups(
        countItemGroup - 1,
        itemGroups[0].name
      ),
    ];
    expect(countBeforeCreate + countItemGroup, 'item groups not created').eq(
      inventoryItemGroupsPage.rowNum
    );
  });
  it('should be able to sort by ID', function () {
    browser.pause(1000);
    const itemGroupId = $$('#itemGroupId');
    const inventoryGroupsBefore = itemGroupId.map((ele) => {
      return ele.getText();
    });
    const spinnerAnimation = $('#spinner-animation');
    // check that sorting is correct in both directions
    for (let i = 0; i < 2; i++) {
      inventoryItemGroupsPage.idTableHeader.click();
      spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });

      const inventoryGroupsAfter = itemGroupId.map((ele) => {
        return ele.getText();
      });

      // get current direction of sorting
      const sortIcon = inventoryItemGroupsPage.idTableHeader.$('i').getText();
      let sorted;
      if (sortIcon === 'expand_more') {
        sorted = inventoryGroupsBefore.sort().reverse();
      } else if (sortIcon === 'expand_less') {
        sorted = inventoryGroupsBefore.sort();
      } else {
        sorted = inventoryGroupsBefore;
      }
      expect(sorted, 'Sort by ID incorrect').deep.equal(inventoryGroupsAfter);
    }
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should be able to sort by Code', function () {
    browser.pause(1000);
    const itemGroupCode = $$('#itemGroupCode');
    const inventoryGroupsBefore = itemGroupCode.map((ele) => {
      return ele.getText();
    });
    const spinnerAnimation = $('#spinner-animation');
    // check that sorting is correct in both directions
    for (let i = 0; i < 2; i++) {
      inventoryItemGroupsPage.codeTableHeader.click();
      spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });

      const inventoryGroupsAfter = itemGroupCode.map((ele) => {
        return ele.getText();
      });

      // get current direction of sorting
      const sortIcon = inventoryItemGroupsPage.codeTableHeader.$('i').getText();
      let sorted;
      if (sortIcon === 'expand_more') {
        sorted = inventoryGroupsBefore.sort().reverse();
      } else if (sortIcon === 'expand_less') {
        sorted = inventoryGroupsBefore.sort();
      } else {
        sorted = inventoryGroupsBefore;
      }
      expect(sorted, 'Sort by Code incorrect').deep.equal(inventoryGroupsAfter);
    }
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should be able to sort by Name', function () {
    browser.pause(1000);
    const itemGroupName = $$('#itemGroupName');
    const inventoryGroupsBefore = itemGroupName.map((ele) => {
      return ele.getText();
    });
    const spinnerAnimation = $('#spinner-animation');
    // check that sorting is correct in both directions
    for (let i = 0; i < 2; i++) {
      inventoryItemGroupsPage.nameTableHeader.click();
      spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });

      const inventoryGroupsAfter = itemGroupName.map((ele) => {
        return ele.getText();
      });

      // get current direction of sorting
      const sortIcon = inventoryItemGroupsPage.nameTableHeader.$('i').getText();
      let sorted;
      if (sortIcon === 'expand_more') {
        sorted = inventoryGroupsBefore.sort().reverse();
      } else if (sortIcon === 'expand_less') {
        sorted = inventoryGroupsBefore.sort();
      } else {
        sorted = inventoryGroupsBefore;
      }
      expect(sorted, 'Sort by Name incorrect').deep.equal(inventoryGroupsAfter);
    }
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should be able to sort by Description', function () {
    browser.pause(1000);
    const itemGroupDescription = $$('#itemGroupDescription');
    const inventoryGroupsBefore = itemGroupDescription.map((ele) => {
      return ele.getText();
    });
    const spinnerAnimation = $('#spinner-animation');
    // check that sorting is correct in both directions
    for (let i = 0; i < 2; i++) {
      inventoryItemGroupsPage.descriptionTableHeader.click();
      spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });

      const inventoryGroupsAfter = itemGroupDescription.map((ele) => {
        return ele.getText();
      });

      // get current direction of sorting
      const sortIcon = inventoryItemGroupsPage.descriptionTableHeader
        .$('i')
        .getText();
      let sorted;
      if (sortIcon === 'expand_more') {
        sorted = inventoryGroupsBefore.sort().reverse();
      } else if (sortIcon === 'expand_less') {
        sorted = inventoryGroupsBefore.sort();
      } else {
        sorted = inventoryGroupsBefore;
      }
      expect(sorted, 'Sort by Description incorrect').deep.equal(
        inventoryGroupsAfter
      );
    }
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should be able to sort by Parent group', function () {
    browser.pause(1000);
    const itemGroupParent = $$('#itemGroupParent');
    const inventoryGroupsBefore = itemGroupParent.map((ele) => {
      return ele.getText();
    });
    const spinnerAnimation = $('#spinner-animation');
    // check that sorting is correct in both directions
    for (let i = 0; i < 2; i++) {
      inventoryItemGroupsPage.parentGroupTableHeader.click();
      spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });

      const inventoryGroupsAfter = itemGroupParent.map((ele) => {
        return ele.getText();
      });

      // get current direction of sorting
      const sortIcon = inventoryItemGroupsPage.parentGroupTableHeader
        .$('i')
        .getText();
      let sorted;
      if (sortIcon === 'expand_more') {
        sorted = inventoryGroupsBefore.sort().reverse();
      } else if (sortIcon === 'expand_less') {
        sorted = inventoryGroupsBefore.sort();
      } else {
        sorted = inventoryGroupsBefore;
      }
      expect(sorted, 'Sort by Parent group incorrect').deep.equal(
        inventoryGroupsAfter
      );
    }
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  });
  after(function () {
    inventoryItemGroupsPage.clearTable();
  });
});
