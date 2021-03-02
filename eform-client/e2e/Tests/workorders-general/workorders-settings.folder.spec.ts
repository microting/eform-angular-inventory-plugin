import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {Guid} from 'guid-typescript';
import foldersPage from '../../Page objects/Folders.page';
import workOrdersPage from '../../Page objects/WorkOrders/WorkOrders.page';

const expect = require('chai').expect;

describe('Work Orders Settings Folder', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    foldersPage.createNewFolder(name, description);

    const name2 = Guid.create().toString();
    const description2 = Guid.create().toString();
    foldersPage.createNewFolder(name2, description2);

    workOrdersPage.goToWorkOrdersSettingsPage();
  });
  it('Assign Folder', function () {
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    $('#folderSelectorLabel').waitForDisplayed({timeout: 20000});
    const oldFolder = $('#folderSelectorInput').getValue();
    workOrdersPage.selectFirstFolder();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const newFolder = $('#folderSelectorInput').getValue();
    expect(oldFolder).not.equal(newFolder);
  });
  it('Change Assigned Folder', function () {
    workOrdersPage.goToWorkOrdersSettingsPage();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    $('#folderSelectorLabel').waitForDisplayed({timeout: 20000});
    const oldFolder = $('#folderSelectorInput').getValue();
    workOrdersPage.selectSecondFolder();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const newFolder = $('#folderSelectorInput').getValue();
    expect(oldFolder).not.equal(newFolder);
  });
});
