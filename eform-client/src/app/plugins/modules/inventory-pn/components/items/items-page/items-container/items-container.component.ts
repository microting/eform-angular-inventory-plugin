import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  PluginClaimsHelper,
  updateTablePage,
  updateTableSorting,
} from 'src/app/common/helpers';
import { Paged, PageSettingsModel } from 'src/app/common/models';
import { SharedPnService } from 'src/app/plugins/modules/shared/services';
import {
  InventoryItemModel,
  InventoryItemsRequestModel,
} from '../../../../models';
import { InventoryPnItemsService } from '../../../../services';

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

  onDeleteItem(inventoryItemId: number) {
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
    this.localPageSettings = {
      ...updateTableSorting(sort, this.localPageSettings),
    };
    this.updateLocalPageSettings();
  }

  changePage(offset: number) {
    const updatedRequestModel = updateTablePage(offset, this.itemsRequestModel);
    if (updatedRequestModel) {
      this.itemsRequestModel = {
        ...this.itemsRequestModel,
        ...updatedRequestModel,
      };
      this.getItems();
    }
  }

  onSNFilterChanged(name: string) {
    this.SNSearchSubject.next(name);
  }

  ngOnDestroy(): void {}
}
