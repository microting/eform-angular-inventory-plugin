import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CommonDictionaryModel } from 'src/app/common/models';

@Component({
  selector: 'app-item-type-create-form',
  templateUrl: './item-type-create-form.component.html',
  styleUrls: ['./item-type-create-form.component.scss'],
})
export class ItemTypeCreateFormComponent implements OnInit {
  @Input() createItemTypeForm: FormGroup;
  @Input() availableItemGroups: CommonDictionaryModel[] = [];
  @Input() availableTags: CommonDictionaryModel[] = [];
  @Input() filteredItemTypes: CommonDictionaryModel[][] = [];
  @Input() dependencies: FormArray;
  @Output() createNewDependency: EventEmitter<void> = new EventEmitter<void>();
  @Output() dependentItemGroupChanged: EventEmitter<{
    itemGroupId: number;
    dependencyIndex: number;
  }> = new EventEmitter<{ itemGroupId: number; dependencyIndex: number }>();

  constructor() {}

  ngOnInit(): void {}

  onCreateNewDependency() {
    this.createNewDependency.emit();
  }

  onDependentItemGroupChanged(
    newItemGroup: { id: number },
    dependencyIndex: number
  ) {
    this.dependentItemGroupChanged.emit({
      itemGroupId: newItemGroup.id,
      dependencyIndex,
    });
  }
}
