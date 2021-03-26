import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { InventoryItemsRequestModel } from '../../../../models';

@Component({
  selector: 'app-items-page-header',
  templateUrl: './items-page-header.component.html',
  styleUrls: ['./items-page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsPageHeaderComponent implements OnInit {
  @Input()
  itemsRequestModel: InventoryItemsRequestModel = new InventoryItemsRequestModel();
  @Output() SNFilterChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  onSNFilterChanged(value: any) {
    this.SNFilterChanged.emit(value);
  }
}
