import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { InventoryItemsRequestModel } from '../../../../models';
import { ItemsStateService } from '../../state/items-state-service';

@Component({
  selector: 'app-items-page-header',
  templateUrl: './items-page-header.component.html',
  styleUrls: ['./items-page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsPageHeaderComponent implements OnInit {
  @Output() SNFilterChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(public itemsStateService: ItemsStateService) {}

  ngOnInit(): void {}

  onSNFilterChanged(value: any) {
    this.SNFilterChanged.emit(value);
  }
}
