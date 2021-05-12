import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonDictionaryModel, Paged } from 'src/app/common/models';
import { InventoryItemTypeSimpleModel } from '../../../../models';
import {
  InventoryPnItemTypesService,
  InventoryPnItemTypeTagsService,
} from '../../../../services';
import { ItemTypesStateService } from '../../store';

@AutoUnsubscribe()
@Component({
  selector: 'app-item-types-container',
  templateUrl: './item-types-container.component.html',
  styleUrls: ['./item-types-container.component.scss'],
})
export class ItemTypesContainerComponent implements OnInit, OnDestroy {
  @ViewChild('imagesModalComponent', { static: false }) imagesModalComponent;
  @ViewChild('deleteItemTypeModal', { static: false }) deleteItemTypeModal;
  @ViewChild('itemTypeTagsModal') itemTypeTagsModal: any;

  nameSearchSubject = new Subject();
  itemTypesModel: Paged<InventoryItemTypeSimpleModel> = new Paged<InventoryItemTypeSimpleModel>();
  selectedItemTypeModel: InventoryItemTypeSimpleModel = new InventoryItemTypeSimpleModel();
  availableTags: CommonDictionaryModel[] = [];

  getInventoryTypesSub$: Subscription;
  getTagsSub$: Subscription;
  deleteItemTypeSub$: Subscription;

  constructor(
    private itemTypesService: InventoryPnItemTypesService,
    private tagsService: InventoryPnItemTypeTagsService,
    public itemTypesStateService: ItemTypesStateService
  ) {
    this.nameSearchSubject.pipe(debounceTime(500)).subscribe((val: string) => {
      this.itemTypesStateService.updateNameFilter(val);
      this.getItemTypes();
    });
  }

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getItemTypes();
    this.getTags();
  }

  getItemTypes() {
    this.getInventoryTypesSub$ = this.itemTypesStateService
      .getAllItemTypes()
      .subscribe((data) => {
        if (data && data.success) {
          this.itemTypesModel = data.model;
        }
      });
  }

  getTags() {
    this.getTagsSub$ = this.tagsService.getPlanningsTags().subscribe((data) => {
      if (data && data.success) {
        this.availableTags = data.model;
      }
    });
  }

  showDeleteItemTypeModal(model: InventoryItemTypeSimpleModel) {
    this.selectedItemTypeModel = model;
    this.deleteItemTypeModal.show();
  }

  sortTable(sort: string) {
    this.itemTypesStateService.onSortTable(sort);
    this.getItemTypes();
  }

  changePage(offset: number) {
    this.itemTypesStateService.changePage(offset);
    this.getItemTypes();
  }

  onNameFilterChanged(name: string) {
    this.nameSearchSubject.next(name);
  }

  openTagsModal() {
    this.itemTypeTagsModal.show();
  }

  saveTag(e: any) {
    this.itemTypesStateService.addOrRemoveTagIds(e.id);
    this.getItemTypes();
  }

  removeSavedTag(e: any) {
    this.itemTypesStateService.addOrRemoveTagIds(e.value.id);
    this.getItemTypes();
  }

  tagSelected(id: number) {
    this.itemTypesStateService.addOrRemoveTagIds(id);
    this.getItemTypes();
  }

  onDeleteItemType(model: InventoryItemTypeSimpleModel) {
    this.deleteItemTypeSub$ = this.itemTypesService
      .deleteItemType(model.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.itemTypesStateService.onDelete();
          this.getItemTypes();
          this.deleteItemTypeModal.hide();
        }
      });
  }

  openPicturesModal(model: { images: string[]; isPictogram: boolean }) {
    this.imagesModalComponent.show(model);
  }

  ngOnDestroy(): void {}

  onPageSizeChanged(pageSize: number) {
    this.itemTypesStateService.updatePageSize(pageSize);
    this.getItemTypes();
  }
}
