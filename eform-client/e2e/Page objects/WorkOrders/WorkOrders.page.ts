import { PageWithNavbarPage } from '../PageWithNavbar.page';
import loginPage from '../Login.page';
import myEformsPage from '../MyEforms.page';

class WorkOrdersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }

  public get firstWorkOrderId() {
    return $$('#workOrderId')[0].getText();
  }

  public goToWorkOrdersSettingsPage() {
    browser.pause(5000);
    myEformsPage.Navbar.goToPluginsPage();
    this.workOrderSettingsBtn.waitForDisplayed({ timeout: 20000 });
    this.workOrderSettingsBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public assignDeviceUser(name: string) {
    $('#addNewSiteBtn').waitForDisplayed({ timeout: 20000 });
    $('#addNewSiteBtn').click();
    $('#selectDeviceUser').waitForDisplayed({ timeout: 20000 });
    $('#selectDeviceUser').click();
    $('#selectDeviceUser input').setValue(name);
    browser.pause(5000);
    $$('#selectDeviceUser .ng-option')[0].click();
    $('#siteAssignBtnSave').click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    browser.pause(10000);
  }

  public removeAssignedDeviceUser() {
    $('#addNewSiteBtn').waitForDisplayed({ timeout: 20000 });
    $$('#removeSiteBtn')[$$('#removeSiteBtn').length - 1].click();
    $('#removeSiteSaveBtn').waitForDisplayed({ timeout: 20000 });
    $('#removeSiteSaveBtn').click();
    $('#spinner-animation').waitForDisplayed({ timeout: 30000, reverse: true });
  }

  public cancelRemovingDeviceUser() {
    $('#addNewSiteBtn').waitForDisplayed({ timeout: 20000 });
    $$('#removeSiteBtn')[$$('#removeSiteBtn').length - 1].click();
    $('#removeSiteSaveCancelBtn').waitForDisplayed({ timeout: 20000 });
    $('#removeSiteSaveCancelBtn').click();
  }

  public workOrdersBtn() {
    $('#work-orders-pn').waitForDisplayed({ timeout: 60000 });
    return $('#work-orders-pn');
  }

  public get workOrderSettingsBtn() {
    return $$('#plugin-settings-link')[$$('#plugin-settings-link').length - 1];
  }

  public goToOrdersPage() {
    this.workOrdersBtn().click();
    this.ordersBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 30000, reverse: true });
  }

  public get ordersBtn() {
    return $(
      `//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Orders')]`
    );
  }

  cancelAddingDeviceUser() {
    $('#addNewSiteBtn').waitForDisplayed({ timeout: 20000 });
    $('#addNewSiteBtn').click();
    $('#selectDeviceUser').waitForDisplayed({ timeout: 20000 });
    $('#selectDeviceUser').click();
    $$('#selectDeviceUser .ng-option')[0].click();
    $('#siteAssignBtnSaveCancel').click();
  }

  public selectFirstFolder() {
    $('#folderSelectorLabel').waitForDisplayed({timeout: 20000});
    $('#folderSelectorLabel').click();
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    $$('#folderTreeName')[ $$('#folderTreeName').length - 1].click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  public selectSecondFolder() {
    $('#folderSelectorLabel').waitForDisplayed({timeout: 20000});
    $('#folderSelectorLabel').click();
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    $$('#folderTreeName')[ $$('#folderTreeName').length - 2].click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
}

const workOrdersPage = new WorkOrdersPage();
export default workOrdersPage;
