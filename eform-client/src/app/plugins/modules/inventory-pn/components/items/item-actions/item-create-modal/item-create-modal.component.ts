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
  styleUrls: ['./item-create-modal.component.scss'],
})
export class ItemCreateModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output()
  createItem: EventEmitter<InventoryItemCreateModel<Date>> = new EventEmitter<InventoryItemCreateModel<Date>>();
  newItemModel: InventoryItemCreateModel<Date> = new InventoryItemCreateModel<Date>();
  @Input() itemTypesList: CommonDictionaryModel[];
  @Input() selectedItemGroupId: number | null = null;

  constructor() {}

  ngOnInit(): void {}

  show() {
    this.newItemModel = new InventoryItemCreateModel<Date>();
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  create() {
    this.createItem.emit(
      this.selectedItemGroupId
        ? { ...this.newItemModel, itemGroupId: this.selectedItemGroupId }
        : this.newItemModel
    );
  }
}
