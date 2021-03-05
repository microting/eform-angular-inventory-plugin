import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonDictionaryModel } from 'src/app/common/models';
import { InventoryItemCreateModel } from '../../../../models';

@Component({
  selector: 'app-item-create-modal',
  templateUrl: './item-create-modal.component.html',
  styleUrls: ['./item-create-modal.component.scss']
})
export class ItemCreateModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output()
  createItem: EventEmitter<InventoryItemCreateModel> = new EventEmitter<InventoryItemCreateModel>();
  newItemModel: InventoryItemCreateModel = new InventoryItemCreateModel();
  @Input() itemTypesList: CommonDictionaryModel[];

  constructor() {}

  ngOnInit(): void {}

  show() {
    this.newItemModel = new InventoryItemCreateModel();
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  create() {
    this.createItem.emit(this.newItemModel);
  }
}
