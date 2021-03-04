import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {InventoryItemTypeSimpleModel} from '../../../models';

@Component({
  selector: 'app-item-type-delete-modal',
  templateUrl: './item-type-delete-modal.component.html',
  styleUrls: ['./item-type-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTypeDeleteModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output()
  deleteItemType: EventEmitter<InventoryItemTypeSimpleModel> = new EventEmitter<InventoryItemTypeSimpleModel>();
  itemTypeModel: InventoryItemTypeSimpleModel = new InventoryItemTypeSimpleModel();

  constructor() {}

  ngOnInit() {}

  show(model: InventoryItemTypeSimpleModel) {
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
