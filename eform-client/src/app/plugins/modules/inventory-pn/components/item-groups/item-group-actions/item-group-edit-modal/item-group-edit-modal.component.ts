import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {CommonDictionaryModel} from 'src/app/common/models';
import {
  InventoryItemGroupModel,
  InventoryItemGroupUpdateModel,
} from 'src/app/plugins/modules/inventory-pn/models';

@Component({
  selector: 'app-item-group-edit-modal',
  templateUrl: './item-group-edit-modal.component.html',
  styleUrls: ['./item-group-edit-modal.component.scss'],
})
export class ItemGroupEditModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Input() itemGroupsList: CommonDictionaryModel[];
  @Output()
  updateItemGroup: EventEmitter<InventoryItemGroupUpdateModel> = new EventEmitter<InventoryItemGroupUpdateModel>();
  selectedItemGroupModel: InventoryItemGroupUpdateModel = new InventoryItemGroupUpdateModel();


  constructor() {}

  ngOnInit() {}

  show(model: InventoryItemGroupModel) {
    this.selectedItemGroupModel = new InventoryItemGroupUpdateModel();
    debugger;
    this.selectedItemGroupModel = {
      id: model.id,
      description: model.description,
      code: model.code,
      name: model.name,
      parentId: model.parent ? model.parent.id : null,
    };
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  onUpdateItemGroup() {
    this.updateItemGroup.emit(this.selectedItemGroupModel);
  }
}
