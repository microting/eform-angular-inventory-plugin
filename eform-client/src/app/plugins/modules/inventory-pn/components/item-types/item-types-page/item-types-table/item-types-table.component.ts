import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Paged,
  PageSettingsModel,
  TableHeaderElementModel,
} from 'src/app/common/models';
import {
  InventoryItemTypeSimpleModel,
  InventoryItemTypesRequestModel,
} from '../../../../models';

@Component({
  selector: 'app-item-types-table',
  templateUrl: './item-types-table.component.html',
  styleUrls: ['./item-types-table.component.scss'],
})
export class ItemTypesTableComponent implements OnInit {
  @Input() localPageSettings: PageSettingsModel = new PageSettingsModel();
  @Input()
  itemTypesRequestModel: InventoryItemTypesRequestModel = new InventoryItemTypesRequestModel();
  @Input()
  itemTypesModel: Paged<InventoryItemTypeSimpleModel> = new Paged<InventoryItemTypeSimpleModel>();
  @Output() sortTable: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  deleteItemType: EventEmitter<InventoryItemTypeSimpleModel> = new EventEmitter<InventoryItemTypeSimpleModel>();
  @Output() tagSelected: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  showPictures: EventEmitter<{
    images: string[];
    isPictogram: boolean;
  }> = new EventEmitter<{ images: string[]; isPictogram: boolean }>();
  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    {
      name: 'CreatedDate',
      elementId: 'createdDateTableHeader',
      sortable: true,
    },
    { name: 'Created by', elementId: '', sortable: false },
    {
      name: 'ParentTypeName',
      elementId: 'itemTypeTableHeader',
      sortable: false,
    },
    { name: 'Name', elementId: 'nameTableHeader', sortable: true },
    { name: 'Usage', elementId: 'usageTableHeader', sortable: true },
    { name: 'Description', elementId: 'descriptionTableHeader', sortable: true },
    { name: 'RiskDescription', elementId: 'riskDescriptionTableHeader', sortable: true },
    { name: 'Comment', elementId: '', sortable: false },
    { name: 'Tags', elementId: '', sortable: false },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor() {}

  ngOnInit(): void {}

  onSortTable(sort: string) {
    this.sortTable.emit(sort);
  }

  onShowDeleteItemTypeModal(model: InventoryItemTypeSimpleModel) {
    this.deleteItemType.emit(model);
  }

  onTagSelected(id: number) {
    this.tagSelected.emit(id);
  }

  openImagesModal(images: string[], isPictogram: boolean) {
    this.showPictures.emit({ images, isPictogram });
  }
}
