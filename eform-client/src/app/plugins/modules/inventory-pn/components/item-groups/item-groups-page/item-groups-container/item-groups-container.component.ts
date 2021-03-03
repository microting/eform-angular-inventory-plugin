import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Paged, PageSettingsModel } from 'src/app/common/models';
import {
  InventoryItemModel,
  InventoryItemGroupsRequestModel,
  InventoryItemGroupModel,
} from '../../../../models';
import { SharedPnService } from '../../../../../shared/services';
import { InventoryPnItemGroupsService } from '../../../../services';
import { debounceTime } from 'rxjs/operators';
import { PluginClaimsHelper, sortTable } from 'src/app/common/helpers';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-item-groups-container',
  templateUrl: './item-groups-container.component.html',
  styleUrls: ['./item-groups-container.component.scss'],
})
export class ItemGroupsContainerComponent implements OnInit, OnDestroy {
  @ViewChild('deleteItemGroupModal', { static: false }) deleteItemGroupModal;
  nameSearchSubject = new Subject();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  itemGroupsModel: Paged<InventoryItemGroupModel> = new Paged<InventoryItemGroupModel>();
  itemGroupsRequestModel: InventoryItemGroupsRequestModel = new InventoryItemGroupsRequestModel();

  getItemGroupsSub$: Subscription;
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

  deleteItemGroup(itemGroupId: number) {
    this.deleteItemGroupSub$ = this.inventoryItemGroupsService
      .deleteItemGroup(itemGroupId)
      .subscribe((data) => {
        if (data && data.success) {
          this.deleteItemGroupModal.hide();
          this.getItemGroups();
        }
      });
  }

  showDeleteItemGroupModal(model: InventoryItemGroupModel) {
    this.deleteItemGroupModal.show(model);
  }

  sortTable(sort: string) {
    this.localPageSettings = { ...sortTable(sort, this.localPageSettings) };
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.itemGroupsRequestModel.offset = e;
      if (e === 0) {
        this.itemGroupsRequestModel.pageIndex = 0;
      } else {
        this.itemGroupsRequestModel.pageIndex = Math.floor(
          e / this.itemGroupsRequestModel.pageSize
        );
      }
      this.getItemGroups();
    }
  }

  onNameFilterChanged(name: string) {
    this.nameSearchSubject.next(name);
  }

  ngOnDestroy(): void {}
}
