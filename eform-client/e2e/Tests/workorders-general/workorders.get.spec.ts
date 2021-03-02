import loginPage from '../../Page objects/Login.page';
import workOrdersPage from '../../Page objects/WorkOrders/WorkOrders.page';

const expect = require('chai').expect;

describe('Work Orders Page',function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    workOrdersPage.goToOrdersPage();
    $('#workOrderId').waitForDisplayed({timeout: 20000});
  });
  it('Read Work Orders', function () {
    const rowNum = workOrdersPage.rowNum;
    expect(rowNum).to.be.equal(2);
  });
  it('Sort Work Orders by Id', function () {
    $('#idTableHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const id = workOrdersPage.firstWorkOrderId;
    expect(id).equal('2');
  });
  it('Sort Work Orders by Created At', function () {
    $('#createdAtHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    $('#createdAtHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const id = workOrdersPage.firstWorkOrderId;
    expect(id).equal('2');
  });
  it('Sort Work Orders by Description', function () {
    $('#descriptionHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    $('#descriptionHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const id = workOrdersPage.firstWorkOrderId;
    expect(id).equal('2');
  });
  it('Sort Work Orders by Corrected at the Latest', function () {
    $('#correctedAtTheLatestHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    $('#correctedAtTheLatestHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const id = workOrdersPage.firstWorkOrderId;
    expect(id).equal('2');
  });
  it('Sort Work Orders by Done At', function () {
    $('#doneAtHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    $('#doneAtHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const id = workOrdersPage.firstWorkOrderId;
    expect(id).equal('2');
  });
  it('Search Work Orders', function () {
    const searchString = 'hhhh';
    $('#searchInput').setValue(searchString);
    browser.pause(500);
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    const rowNum = workOrdersPage.rowNum;
    expect(rowNum).to.be.equal(1);
  });
});
