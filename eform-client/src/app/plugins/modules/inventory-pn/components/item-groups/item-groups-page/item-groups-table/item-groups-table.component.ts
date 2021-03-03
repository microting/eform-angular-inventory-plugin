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

  constructor() {}

  ngOnInit(): void {}

  onSortTable(sort: string) {
    this.sortTable.emit(sort);
  }

  onShowDeleteItemGroupModal(model: InventoryItemGroupModel) {
    this.showDeleteItemGroupModal.emit(model);
  }
}
