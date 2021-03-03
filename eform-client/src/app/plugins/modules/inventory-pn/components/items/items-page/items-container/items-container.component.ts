import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Paged, PageSettingsModel } from 'src/app/common/models';
import { SharedPnService } from 'src/app/plugins/modules/shared/services';
import { debounceTime } from 'rxjs/operators';
import { PluginClaimsHelper, sortTable } from 'src/app/common/helpers';
import { InventoryPnClaims } from '../../../../enums';
import { InventoryPnItemsService } from '../../../../services';
import {
  InventoryItemModel,
  InventoryItemsRequestModel,
} from '../../../../models';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-items-container',
  templateUrl: './items-container.component.html',
  styleUrls: ['./items-container.component.scss'],
})
export class ItemsContainerComponent implements OnInit, OnDestroy {
  @ViewChild('deleteItemModal', { static: false }) deleteItemModal;
  SNSearchSubject = new Subject();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  itemsModel: Paged<InventoryItemModel> = new Paged<InventoryItemModel>();
  itemsRequestModel: InventoryItemsRequestModel = new InventoryItemsRequestModel();

  getItemsSub$: Subscription;
  deleteItemSub$: Subscription;

  constructor(
    private sharedPnService: SharedPnService,
    private inventoryItemsService: InventoryPnItemsService
  ) {
    this.SNSearchSubject.pipe(debounceTime(500)).subscribe((val) => {
      this.itemsRequestModel.SNFilter = val.toString();
      this.getItems();
    });
  }

  get pluginClaimsHelper() {
    return PluginClaimsHelper;
  }

  get inventoryPnClaims() {
    return InventoryPnClaims;
  }

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings(
      'inventoryPnSettings',
      'Items'
    ).settings;
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings(
      'inventoryPnSettings',
      this.localPageSettings,
      'Items'
    );
    this.getItems();
  }

  getItems() {
    this.itemsRequestModel = {
      ...this.itemsRequestModel,
      ...this.localPageSettings,
    };
    this.getItemsSub$ = this.inventoryItemsService
      .getAllItems(this.itemsRequestModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.itemsModel = data.model;
        }
      });
  }

  deleteItem(inventoryItemId: number) {
    this.deleteItemSub$ = this.inventoryItemsService
      .deleteItem(inventoryItemId)
      .subscribe((data) => {
        if (data && data.success) {
          this.deleteItemModal.hide();
          this.getItems();
        }
      });
  }


  showDeleteItemModal(model: InventoryItemModel) {
    this.deleteItemModal.show(model);
  }

  sortTable(sort: string) {
    this.localPageSettings = { ...sortTable(sort, this.localPageSettings) };
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.itemsRequestModel.offset = e;
      if (e === 0) {
        this.itemsRequestModel.pageIndex = 0;
      } else {
        this.itemsRequestModel.pageIndex = Math.floor(
          e / this.itemsRequestModel.pageSize
        );
      }
      this.getItems();
    }
  }

  onSNFilterChanged(name: string) {
    this.SNSearchSubject.next(name);
  }

  ngOnDestroy(): void {}
}
