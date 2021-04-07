import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonDictionaryModel } from 'src/app/common/models';
import { InventoryItemTypesRequestModel } from '../../../../models';
import { ItemTypesStateService } from 'src/app/plugins/modules/inventory-pn/components/item-types/state/item-types-state-service';

@Component({
  selector: 'app-item-types-header',
  templateUrl: './item-types-header.component.html',
  styleUrls: ['./item-types-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTypesHeaderComponent implements OnInit {
  @Input() availableTags: CommonDictionaryModel[] = [];
  @Output() tagSaved: EventEmitter<any> = new EventEmitter<any>();
  @Output() savedTagRemoved: EventEmitter<any> = new EventEmitter<any>();
  @Output() nameFilterChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(public itemTypesStateService: ItemTypesStateService) {}

  ngOnInit(): void {}

  saveTag(e: any) {
    this.tagSaved.emit(e);
  }

  removeSavedTag(e: any) {
    this.savedTagRemoved.emit(e);
  }

  onNameFilterChanged(value: any) {
    this.nameFilterChanged.emit(value);
  }
}
