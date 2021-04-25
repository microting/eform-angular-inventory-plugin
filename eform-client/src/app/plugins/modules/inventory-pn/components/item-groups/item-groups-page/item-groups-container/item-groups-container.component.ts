import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonDictionaryModel, Paged } from 'src/app/common/models';
import {
  InventoryItemGroupCreateModel,
  InventoryItemGroupModel,
  InventoryItemGroupUpdateModel,
} from '../../../../models';
import { InventoryPnItemGroupsService } from '../../../../services';
import { ItemGroupsStateService } from '../../store/item-groups-state-service';

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
  itemGroupsModel: Paged<InventoryItemGroupModel> = new Paged<InventoryItemGroupModel>();
  itemGroupsList: CommonDictionaryModel[];
  itemGroupsFilteredList: CommonDictionaryModel[];

  getItemGroupsSub$: Subscription;
  getItemGroupsDictionarySub$: Subscription;
  createItemGroupSub$: Subscription;
  updateItemGroupSub$: Subscription;
  deleteItemGroupSub$: Subscription;

  constructor(
    private inventoryItemGroupsService: InventoryPnItemGroupsService,
    public itemGroupsStateService: ItemGroupsStateService
  ) {
    this.nameSearchSubject.pipe(debounceTime(500)).subscribe((val) => {
      this.itemGroupsStateService.updateNameFilter(val.toString());
      this.getItemGroups();
    });
  }

  ngOnInit() {
    this.getItemGroups();
    this.getItemGroupsDictionary();
  }

  getItemGroups() {
    this.getItemGroupsSub$ = this.itemGroupsStateService
      .getAllItemGroups()
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
    this.itemGroupsFilteredList = [
      ...this.itemGroupsList.filter((x) => x.id !== model.id),
    ];
    this.editItemGroupModal.show(model);
  }

  sortTable(sort: string) {
    this.itemGroupsStateService.onSortTable(sort);
    this.getItemGroups();
  }

  changePage(offset: number | null) {
    this.itemGroupsStateService.changePage(offset);
    this.getItemGroups();
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
          this.getItemGroupsDictionary();
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
          this.getItemGroupsDictionary();
        }
      });
  }

  onDeleteItemGroup(itemGroupId: number) {
    this.deleteItemGroupSub$ = this.inventoryItemGroupsService
      .deleteItemGroup(itemGroupId)
      .subscribe((data) => {
        if (data && data.success) {
          this.deleteItemGroupModal.hide();
          this.itemGroupsStateService.onDelete();
          this.getItemGroups();
          this.getItemGroupsDictionary();
        }
      });
  }

  onPageSizeChanged(pageSize: number) {
    this.itemGroupsStateService.updatePageSize(pageSize);
    this.getItemGroups();
  }
}
