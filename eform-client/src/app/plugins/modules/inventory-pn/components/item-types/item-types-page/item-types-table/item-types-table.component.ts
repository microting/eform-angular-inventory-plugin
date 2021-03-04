import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Paged, PageSettingsModel } from 'src/app/common/models';
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
  showDeleteItemTypeModal: EventEmitter<InventoryItemTypeSimpleModel> = new EventEmitter<InventoryItemTypeSimpleModel>();
  @Output() tagSelected: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  onSortTable(sort: string) {
    this.sortTable.emit(sort);
  }

  onShowDeleteItemTypeModal(model: InventoryItemTypeSimpleModel) {
    this.showDeleteItemTypeModal.emit(model);
  }

  onTagSelected(id: number) {
    this.tagSelected.emit(id);
  }
}
