import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonDictionaryModel } from 'src/app/common/models';
import {
  InventoryItemModel,
  InventoryItemUpdateModel,
} from '../../../../models';

@Component({
  selector: 'app-item-edit-modal',
  templateUrl: './item-edit-modal.component.html',
  styleUrls: ['./item-edit-modal.component.scss'],
})
export class ItemEditModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output()
  updateItem: EventEmitter<InventoryItemUpdateModel> = new EventEmitter<InventoryItemUpdateModel>();
  selectedItemModel: InventoryItemUpdateModel = new InventoryItemUpdateModel();
  @Input() itemTypesList: CommonDictionaryModel[];

  constructor() {}

  ngOnInit(): void {}

  show(model: InventoryItemModel) {
    this.selectedItemModel = {
      id: model.id,
      available: model.available,
      customerId: model.customerId,
      expirationDate: model.expirationDate,
      itemTypeId: model.itemType ? model.itemType.id : null,
      location: model.location,
      SN: model.SN,
    };
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  create() {
    this.updateItem.emit(this.selectedItemModel);
  }
}
