import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { SharedPnService } from 'src/app/plugins/modules/shared/services';
import { format } from 'date-fns';
import {
  InventoryItemCreateModel,
  InventoryItemModel,
  InventoryItemsRequestModel,
  InventoryItemUpdateModel,
} from '../../../../models';
import {
  InventoryPnItemGroupsService,
  InventoryPnItemsService,
  InventoryPnItemTypesService,
} from '../../../../services';
import { getOffset } from 'src/app/common/helpers/pagination.helper';

@AutoUnsubscribe()
@Component({
  selector: 'app-items-container',
  templateUrl: './items-container.component.html',
  styleUrls: ['./items-container.component.scss'],
})
export class ItemsContainerComponent implements OnInit, OnDestroy {
  @ViewChild('deleteItemModal', { static: false }) deleteItemModal;
  @ViewChild('createItemModal', { static: false }) createItemModal;
  @ViewChild('editItemModal', { static: false }) editItemModal;
  SNSearchSubject = new Subject();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  itemsModel: Paged<InventoryItemModel> = new Paged<InventoryItemModel>();
  itemsRequestModel: InventoryItemsRequestModel = new InventoryItemsRequestModel();
  itemTypesList: CommonDictionaryModel[] = [];
  selectedItemGroupId: number | null = null;

  getItemsSub$: Subscription;
  getItemGroupsDictionarySub$: Subscription;
  getItemTypesDictionarySub$: Subscription;
  activatedRouteSub$: Subscription;
  updateItemSub$: Subscription;
  createItemSub$: Subscription;
  deleteItemSub$: Subscription;

  constructor(
    private sharedPnService: SharedPnService,
    private itemsService: InventoryPnItemsService,
    private itemTypesService: InventoryPnItemTypesService,
    private itemGroupsService: InventoryPnItemGroupsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.SNSearchSubject.pipe(debounceTime(500)).subscribe((val) => {
      this.itemsRequestModel.SNFilter = val.toString();
      this.getItems();
    });
    this.activatedRouteSub$ = this.activatedRoute.params.subscribe((params) => {
      this.selectedItemGroupId = +params['itemGroupId'];
    });
  }

  get pluginClaimsHelper() {
    return PluginClaimsHelper;
  }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.getLocalPageSettings();
    this.getItems();
    this.getItemTypesDictionary();
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
      itemGroupId: this.selectedItemGroupId,
    };
    this.getItemsSub$ = this.itemsService
      .getAllItems(this.itemsRequestModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.itemsModel = data.model;
        }
      });
  }

  getItemTypesDictionary() {
    this.getItemTypesDictionarySub$ = this.itemTypesService
      .getAllItemTypesDictionary()
      .subscribe((data) => {
        if (data && data.success) {
          this.itemTypesList = data.model;
        }
      });
  }

  onDeleteItem(inventoryItemId: number) {
    this.deleteItemSub$ = this.itemsService
      .deleteItem(inventoryItemId)
      .subscribe((data) => {
        if (data && data.success) {
          this.deleteItemModal.hide();
          this.itemsRequestModel = {
            ...this.itemsRequestModel,
            offset: getOffset(
              this.itemsRequestModel.pageSize,
              this.itemsRequestModel.offset,
              this.itemsModel.total - 1
            ),
          };
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

  onCreateItem(model: InventoryItemCreateModel<Date>) {
    this.createItemSub$ = this.itemsService
      .createItem({
        ...model,
        expirationDate: model.expirationDate
          ? format(model.expirationDate, 'yyyy-MM-dd')
          : null,
      })
      .subscribe((data) => {
        if (data && data.success) {
          this.createItemModal.hide();
          this.getItems();
        }
      });
  }

  onUpdateItem(model: InventoryItemUpdateModel<Date>) {
    this.updateItemSub$ = this.itemsService
      .updateItem({
        ...model,
        expirationDate: model.expirationDate
          ? format(model.expirationDate, 'yyyy-MM-dd')
          : null,
      })
      .subscribe((data) => {
        if (data && data.success) {
          this.editItemModal.hide();
          this.getItems();
        }
      });
  }

  ngOnDestroy(): void {}

  showCreateItemModal() {
    this.createItemModal.show();
  }

  showEditItemModal(model: InventoryItemModel) {
    this.editItemModal.show(model);
  }
}
