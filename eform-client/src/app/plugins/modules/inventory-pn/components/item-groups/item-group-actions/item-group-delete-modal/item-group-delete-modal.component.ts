import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { InventoryItemGroupModel } from '../../../../models';

@Component({
  selector: 'app-item-group-delete-modal',
  templateUrl: './item-group-delete-modal.component.html',
  styleUrls: ['./item-group-delete-modal.component.scss']
})
export class ItemGroupDeleteModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output()
  deleteItemGroup: EventEmitter<number> = new EventEmitter<number>();
  itemGroupModel: InventoryItemGroupModel = new InventoryItemGroupModel();

  constructor() {}

  ngOnInit() {}

  show(model: InventoryItemGroupModel) {
    this.itemGroupModel = model;
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  delete() {
    this.deleteItemGroup.emit(this.itemGroupModel.id);
  }
}
