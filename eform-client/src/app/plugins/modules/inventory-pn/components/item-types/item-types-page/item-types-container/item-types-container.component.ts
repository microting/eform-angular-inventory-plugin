import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { updateTablePage, updateTableSorting } from 'src/app/common/helpers';
import {
  CommonDictionaryModel,
  Paged,
  PageSettingsModel,
} from 'src/app/common/models';
import { SharedPnService } from '../../../../../shared/services';
import {
  InventoryItemTypeSimpleModel,
  InventoryItemTypesRequestModel,
} from '../../../../models';
import {
  InventoryPnItemTypeTagsService,
  InventoryPnItemTypesService,
} from '../../../../services';

@AutoUnsubscribe()
@Component({
  selector: 'app-item-types-container',
  templateUrl: './item-types-container.component.html',
  styleUrls: ['./item-types-container.component.scss'],
})
export class ItemTypesContainerComponent implements OnInit, OnDestroy {
  @ViewChild('deleteItemTypeModal', { static: false }) deleteItemTypeModal;
  @ViewChild('itemTypeTagsModal') itemTypeTagsModal: any;

  nameSearchSubject = new Subject();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  itemTypesModel: Paged<InventoryItemTypeSimpleModel> = new Paged<InventoryItemTypeSimpleModel>();
  itemTypesRequestModel: InventoryItemTypesRequestModel = new InventoryItemTypesRequestModel();
  selectedItemTypeModel: InventoryItemTypeSimpleModel = new InventoryItemTypeSimpleModel();
  availableTags: CommonDictionaryModel[] = [];

  getInventoryTypesSub$: Subscription;
  getTagsSub$: Subscription;
  deleteItemTypeSub$: Subscription;

  constructor(
    private sharedPnService: SharedPnService,
    private itemTypesService: InventoryPnItemTypesService,
    private tagsService: InventoryPnItemTypeTagsService
  ) {
    this.nameSearchSubject.pipe(debounceTime(500)).subscribe((val) => {
      this.itemTypesRequestModel.nameFilter = val.toString();
      this.getItemTypes();
    });
  }

  ngOnInit() {
    this.getLocalPageSettings();
    this.getTags();
    this.getItemTypes();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings(
      'inventoryPnSettings',
      'ItemTypes'
    ).settings;
    this.localPageSettings.additional.forEach((value) => {
      if (value.key === 'tagIds') {
        this.itemTypesRequestModel.tagIds = JSON.parse(value.value);
      }
    });
  }

  updateLocalPageSettings() {
    const index = this.localPageSettings.additional.findIndex(
      (item) => item.key === 'tagIds'
    );
    if (index !== -1) {
      this.localPageSettings.additional[index].value = JSON.stringify(
        this.itemTypesRequestModel.tagIds
      );
    } else {
      this.localPageSettings.additional = [
        ...this.localPageSettings.additional,
        {
          key: 'tagIds',
          value: JSON.stringify(this.itemTypesRequestModel.tagIds),
        },
      ];
    }
    this.sharedPnService.updateLocalPageSettings(
      'inventoryPnSettings',
      this.localPageSettings,
      'ItemTypes'
    );
    this.getItemTypes();
  }

  getItemTypes() {
    this.itemTypesRequestModel = {
      ...this.itemTypesRequestModel,
      ...this.localPageSettings,
    };
    this.getInventoryTypesSub$ = this.itemTypesService
      .getAllItemTypes(this.itemTypesRequestModel)
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
    this.localPageSettings = {
      ...updateTableSorting(sort, this.localPageSettings),
    };
    this.updateLocalPageSettings();
  }

  changePage(offset: any) {
    const updatedRequestModel = updateTablePage(
      offset,
      this.itemTypesRequestModel
    );
    if (updatedRequestModel) {
      this.itemTypesRequestModel = {
        ...this.itemTypesRequestModel,
        ...updatedRequestModel,
      };
      this.getItemTypes();
    }
  }

  onNameFilterChanged(name: string) {
    this.nameSearchSubject.next(name);
  }

  openTagsModal() {
    this.itemTypeTagsModal.show();
  }

  saveTag(e: any) {
    if (!this.itemTypesRequestModel.tagIds.find((x) => x === e.id)) {
      this.itemTypesRequestModel.tagIds.push(e.id);
    }
    this.updateLocalPageSettings();
  }

  removeSavedTag(e: any) {
    this.itemTypesRequestModel.tagIds = this.itemTypesRequestModel.tagIds.filter(
      (x) => x !== e.id
    );
    this.updateLocalPageSettings();
  }

  tagSelected(id: number) {
    if (!this.itemTypesRequestModel.tagIds.find((x) => x === id)) {
      this.itemTypesRequestModel.tagIds = [
        ...this.itemTypesRequestModel.tagIds,
        id,
      ];
      this.updateLocalPageSettings();
    }
  }

  ngOnDestroy(): void {}

  onDeleteItemType(model: InventoryItemTypeSimpleModel) {
    this.deleteItemTypeSub$ = this.itemTypesService
      .deleteItemType(model.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.getItemTypes();
          this.deleteItemTypeModal.hide();
        }
      });
  }
}
