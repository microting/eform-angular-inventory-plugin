import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Paged, PageSettingsModel } from 'src/app/common/models';
import {
  InventoryItemModel,
  InventoryItemsRequestModel,
} from '../../../../models';

@Component({
  selector: 'app-items-page-table',
  templateUrl: './items-page-table.component.html',
  styleUrls: ['./items-page-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsPageTableComponent implements OnInit {
  @Input() localPageSettings: PageSettingsModel = new PageSettingsModel();
  @Input()
  itemsRequestModel: InventoryItemsRequestModel = new InventoryItemsRequestModel();
  @Input()
  itemsModel: Paged<InventoryItemModel> = new Paged<InventoryItemModel>();
  @Output() sortTable: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  showDeleteItemModal: EventEmitter<InventoryItemModel> = new EventEmitter<InventoryItemModel>();
  @Output()
  showEditItemModal: EventEmitter<InventoryItemModel> = new EventEmitter<InventoryItemModel>();

  constructor() {}

  ngOnInit(): void {}

  onSortTable(sort: string) {
    this.sortTable.emit(sort);
  }

  onShowDeleteItemModal(model: InventoryItemModel) {
    this.showDeleteItemModal.emit(model);
  }

  onShowEditItemModal(model: InventoryItemModel) {
    this.showDeleteItemModal.emit(model);
  }
}
