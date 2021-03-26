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
  InventoryItemGroupModel,
  InventoryItemGroupsRequestModel,
} from '../../../../models';

@Component({
  selector: 'app-item-groups-table',
  templateUrl: './item-groups-table.component.html',
  styleUrls: ['./item-groups-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemGroupsTableComponent implements OnInit {
  @Input() localPageSettings: PageSettingsModel = new PageSettingsModel();
  @Input()
  itemGroupsRequestModel: InventoryItemGroupsRequestModel = new InventoryItemGroupsRequestModel();
  @Input()
  itemGroupsModel: Paged<InventoryItemGroupModel> = new Paged<InventoryItemGroupModel>();
  @Output() sortTable: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  showDeleteItemGroupModal: EventEmitter<InventoryItemGroupModel> = new EventEmitter<InventoryItemGroupModel>();
  @Output()
  showEditItemGroupModal: EventEmitter<InventoryItemGroupModel> = new EventEmitter<InventoryItemGroupModel>();

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    {
      name: 'Code',
      elementId: 'codeTableHeader',
      sortable: true,
    },
    { name: 'Name', elementId: 'nameTableHeader', sortable: true },
    {
      name: 'Description',
      elementId: 'descriptionTableHeader',
      sortable: true,
    },
    {
      name: 'ParentGroup',
      elementId: 'parentGroupTableHeader',
      sortable: true,
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];
  constructor() {}

  ngOnInit(): void {}

  onSortTable(sort: string) {
    this.sortTable.emit(sort);
  }

  onShowDeleteItemGroupModal(model: InventoryItemGroupModel) {
    this.showDeleteItemGroupModal.emit(model);
  }

  onShowEditItemGroupModal(model: InventoryItemGroupModel) {
    this.showEditItemGroupModal.emit(model);
  }
}
