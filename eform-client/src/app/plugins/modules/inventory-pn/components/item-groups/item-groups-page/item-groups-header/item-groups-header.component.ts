import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ItemGroupsStateService } from '../../state/item-groups-state-service';

@Component({
  selector: 'app-item-groups-header',
  templateUrl: './item-groups-header.component.html',
  styleUrls: ['./item-groups-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemGroupsHeaderComponent implements OnInit {
  @Output()
  nameFilterChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(public itemGroupsStateService: ItemGroupsStateService) {}

  ngOnInit(): void {}

  onNameFilterChanged(value: any) {
    this.nameFilterChanged.emit(value);
  }
}
