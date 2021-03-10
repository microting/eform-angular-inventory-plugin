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
  @Input() itemGroupsList: CommonDictionaryModel[];
  @Input() selectedItemGroupId: number | null = null;

  constructor() {}

  ngOnInit(): void {}

  show(model: InventoryItemModel) {
    this.selectedItemModel = {
      id: model.id,
      available: model.available,
      customerId: model.customerId,
      expirationDate: model.expirationDate,
      itemTypeId: model.itemType ? model.itemType.id : null,
      itemGroupId: model.itemGroup ? model.itemGroup.id : null,
      location: model.location,
      sn: model.sn,
    };
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  update() {
    this.updateItem.emit(
      this.selectedItemGroupId
        ? { ...this.selectedItemModel, itemGroupId: this.selectedItemGroupId }
        : this.selectedItemModel
    );
  }
}
