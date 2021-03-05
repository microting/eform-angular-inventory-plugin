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
import { InventoryItemGroupCreateModel } from '../../../../models';

@Component({
  selector: 'app-item-group-create-modal',
  templateUrl: './item-group-create-modal.component.html',
  styleUrls: ['./item-group-create-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemGroupCreateModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output()
  createItemGroup: EventEmitter<InventoryItemGroupCreateModel> = new EventEmitter<InventoryItemGroupCreateModel>();
  newItemGroupModel: InventoryItemGroupCreateModel = new InventoryItemGroupCreateModel();
  @Input() itemGroupsList: CommonDictionaryModel[];

  constructor() {}

  ngOnInit() {}

  show() {
    this.newItemGroupModel = new InventoryItemGroupCreateModel();
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  create() {
    this.createItemGroup.emit(this.newItemGroupModel);
  }
}
