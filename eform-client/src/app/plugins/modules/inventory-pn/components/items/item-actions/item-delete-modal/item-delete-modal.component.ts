import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { InventoryItemModel } from '../../../../models';

@Component({
  selector: 'app-item-delete-modal',
  templateUrl: './item-delete-modal.component.html',
  styleUrls: ['./item-delete-modal.component.scss']
})
export class ItemDeleteModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output()
  deleteItem: EventEmitter<number> = new EventEmitter<number>();
  itemModel: InventoryItemModel = new InventoryItemModel();

  constructor() {}

  ngOnInit() {}

  show(model: InventoryItemModel) {
    this.itemModel = model;
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  delete() {
    this.deleteItem.emit(this.itemModel.id);
  }
}
