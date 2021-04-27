import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { CommonDictionaryModel, Paged } from 'src/app/common/models';
import { format } from 'date-fns';
import {
  InventoryItemCreateModel,
  InventoryItemModel,
  InventoryItemUpdateModel,
} from '../../../../models';
import {
  InventoryPnItemsService,
  InventoryPnItemTypesService,
} from '../../../../services';
import { ItemsStateService } from '../../store/items-state-service';

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
  itemsModel: Paged<InventoryItemModel> = new Paged<InventoryItemModel>();
  itemTypesList: CommonDictionaryModel[] = [];
  selectedItemGroupId: number | null = null;

  getItemsSub$: Subscription;
  getItemTypesDictionarySub$: Subscription;
  activatedRouteSub$: Subscription;
  updateItemSub$: Subscription;
  createItemSub$: Subscription;
  deleteItemSub$: Subscription;

  constructor(
    private itemsService: InventoryPnItemsService,
    private itemTypesService: InventoryPnItemTypesService,
    private activatedRoute: ActivatedRoute,
    public itemsStateService: ItemsStateService
  ) {
    this.SNSearchSubject.pipe(debounceTime(500)).subscribe((val) => {
      this.itemsStateService.updateSnFilter(val.toString());
      this.getItems();
    });
    this.activatedRouteSub$ = this.activatedRoute.params.subscribe((params) => {
      this.selectedItemGroupId = +params['itemGroupId'];
      this.itemsStateService.setItemGroupId(this.selectedItemGroupId);
    });
  }

  // get pluginClaimsHelper() {
  //   return PluginClaimsHelper;
  // }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.getItems();
    this.getItemTypesDictionary();
  }

  getItems() {
    this.getItemsSub$ = this.itemsStateService
      .getAllItems()
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
          this.itemsStateService.onDelete();
          this.getItems();
        }
      });
  }

  showDeleteItemModal(model: InventoryItemModel) {
    this.deleteItemModal.show(model);
  }

  sortTable(sort: string) {
    this.itemsStateService.onSortTable(sort);
    this.getItems();
  }

  changePage(offset: number) {
    this.itemsStateService.changePage(offset);
    this.getItems();
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

  onPageSizeChanged(pageSize: number) {
    this.itemsStateService.updatePageSize(pageSize);
    this.getItems();
  }
}
