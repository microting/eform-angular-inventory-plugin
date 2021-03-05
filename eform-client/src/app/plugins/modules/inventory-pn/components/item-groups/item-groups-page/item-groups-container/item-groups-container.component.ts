import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  PluginClaimsHelper,
  updateTablePage,
  updateTableSorting,
} from 'src/app/common/helpers';
import {
  CommonDictionaryModel,
  Paged,
  PageSettingsModel,
} from 'src/app/common/models';
import { SharedPnService } from '../../../../../shared/services';
import {
  InventoryItemGroupCreateModel,
  InventoryItemGroupModel,
  InventoryItemGroupsRequestModel,
  InventoryItemGroupUpdateModel,
} from '../../../../models';
import { InventoryPnItemGroupsService } from '../../../../services';

@AutoUnsubscribe()
@Component({
  selector: 'app-item-groups-container',
  templateUrl: './item-groups-container.component.html',
  styleUrls: ['./item-groups-container.component.scss'],
})
export class ItemGroupsContainerComponent implements OnInit, OnDestroy {
  @ViewChild('deleteItemGroupModal', { static: false }) deleteItemGroupModal;
  @ViewChild('createItemGroupModal', { static: false }) createItemGroupModal;
  @ViewChild('editItemGroupModal', { static: false }) editItemGroupModal;
  nameSearchSubject = new Subject();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  itemGroupsModel: Paged<InventoryItemGroupModel> = new Paged<InventoryItemGroupModel>();
  itemGroupsRequestModel: InventoryItemGroupsRequestModel = new InventoryItemGroupsRequestModel();
  itemGroupsList: CommonDictionaryModel[];

  getItemGroupsSub$: Subscription;
  getItemGroupsDictionarySub$: Subscription;
  createItemGroupSub$: Subscription;
  updateItemGroupSub$: Subscription;
  deleteItemGroupSub$: Subscription;

  constructor(
    private sharedPnService: SharedPnService,
    private inventoryItemGroupsService: InventoryPnItemGroupsService
  ) {
    this.nameSearchSubject.pipe(debounceTime(500)).subscribe((val) => {
      this.itemGroupsRequestModel.nameFilter = val.toString();
      this.getItemGroups();
    });
  }

  get pluginClaimsHelper() {
    return PluginClaimsHelper;
  }

  ngOnInit() {
    this.getLocalPageSettings();
    this.getItemGroups();
    this.getItemGroupsDictionary();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings(
      'inventoryPnSettings',
      'ItemGroups'
    ).settings;
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings(
      'inventoryPnSettings',
      this.localPageSettings,
      'ItemGroups'
    );
    this.getItemGroups();
  }

  getItemGroups() {
    this.itemGroupsRequestModel = {
      ...this.itemGroupsRequestModel,
      ...this.localPageSettings,
    };
    this.getItemGroupsSub$ = this.inventoryItemGroupsService
      .getAllItemGroups(this.itemGroupsRequestModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.itemGroupsModel = data.model;
        }
      });
  }

  getItemGroupsDictionary() {
    this.getItemGroupsDictionarySub$ = this.inventoryItemGroupsService
      .getAllItemGroupsDictionary()
      .subscribe((data) => {
        if (data && data.success) {
          this.itemGroupsList = data.model;
        }
      });
  }

  showDeleteItemGroupModal(model: InventoryItemGroupModel) {
    this.deleteItemGroupModal.show(model);
  }

  showCreateItemGroupModal() {
    this.createItemGroupModal.show();
  }

  showEditItemGroupModal(model: InventoryItemGroupModel) {
    this.editItemGroupModal.show(model);
  }

  sortTable(sort: string) {
    this.localPageSettings = {
      ...updateTableSorting(sort, this.localPageSettings),
    };
    this.updateLocalPageSettings();
  }

  changePage(offset: number | null) {
    const updatedRequestModel = updateTablePage(
      offset,
      this.itemGroupsRequestModel
    );
    if (updatedRequestModel) {
      this.itemGroupsRequestModel = {
        ...this.itemGroupsRequestModel,
        ...updatedRequestModel,
      };
      this.getItemGroups();
    }
  }

  onNameFilterChanged(name: string) {
    this.nameSearchSubject.next(name);
  }

  ngOnDestroy(): void {}

  onCreateItemGroup(model: InventoryItemGroupCreateModel) {
    this.createItemGroupSub$ = this.inventoryItemGroupsService
      .createItemGroup(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.createItemGroupModal.hide();
          this.getItemGroups();
        }
      });
  }

  onUpdateItemGroup(model: InventoryItemGroupUpdateModel) {
    this.updateItemGroupSub$ = this.inventoryItemGroupsService
      .updateItemGroup(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.editItemGroupModal.hide();
          this.getItemGroups();
        }
      });
  }

  onDeleteItemGroup(itemGroupId: number) {
    this.deleteItemGroupSub$ = this.inventoryItemGroupsService
      .deleteItemGroup(itemGroupId)
      .subscribe((data) => {
        if (data && data.success) {
          this.deleteItemGroupModal.hide();
          this.getItemGroups();
        }
      });
  }
}
