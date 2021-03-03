import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { InventoryItemGroupsRequestModel } from '../../../../models';

@Component({
  selector: 'app-item-groups-header',
  templateUrl: './item-groups-header.component.html',
  styleUrls: ['./item-groups-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemGroupsHeaderComponent implements OnInit {
  @Input()
  itemGroupsRequestModel: InventoryItemGroupsRequestModel = new InventoryItemGroupsRequestModel();
  @Output()
  nameFilterChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  onNameFilterChanged(value: any) {
    this.nameFilterChanged.emit(value);
  }
}
