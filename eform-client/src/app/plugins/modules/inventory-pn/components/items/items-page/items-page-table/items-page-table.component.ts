import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  Paged,
  PageSettingsModel,
  TableHeaderElementModel,
} from 'src/app/common/models';
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
  @Input() selectedItemGroupId: number;
  @Output() sortTable: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  showDeleteItemModal: EventEmitter<InventoryItemModel> = new EventEmitter<InventoryItemModel>();
  @Output()
  showEditItemModal: EventEmitter<InventoryItemModel> = new EventEmitter<InventoryItemModel>();

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    { name: 'ItemType', elementId: 'typeTableHeader', sortable: true },
    { name: 'Location', elementId: 'locationTableHeader', sortable: true },
    { name: 'ExpirationDate', elementId: 'expiresTableHeader', sortable: true },
    { name: 'SN', elementId: 'SNTableHeader', sortable: true },
    { name: 'ItemGroup', elementId: 'itemGroupTableHeader', sortable: true },
    { name: 'Available', elementId: 'StatusTableHeader', sortable: true },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor() {}

  ngOnInit(): void {}

  onSortTable(sort: string) {
    this.sortTable.emit(sort);
  }

  onShowDeleteItemModal(model: InventoryItemModel) {
    this.showDeleteItemModal.emit(model);
  }

  onShowEditItemModal(model: InventoryItemModel) {
    this.showEditItemModal.emit(model);
  }
}
