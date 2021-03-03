import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { InventoryItemTypeModel } from '../../../models';

@Component({
  selector: 'app-item-type-delete-modal',
  templateUrl: './item-type-delete-modal.component.html',
  styleUrls: ['./item-type-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTypeDeleteModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output()
  deleteItemType: EventEmitter<InventoryItemTypeModel> = new EventEmitter<InventoryItemTypeModel>();
  itemTypeModel: InventoryItemTypeModel = new InventoryItemTypeModel();

  constructor() {}

  ngOnInit() {}

  show(model: InventoryItemTypeModel) {
    this.itemTypeModel = model;
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  delete() {
    this.deleteItemType.emit(this.itemTypeModel);
  }
}
