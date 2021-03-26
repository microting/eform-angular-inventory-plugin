import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CommonDictionaryModel } from 'src/app/common/models';
import {
  InventoryItemTypeImageModel,
  InventoryItemTypeModel,
} from '../../../../../models';
import { InventoryPnImageTypesEnum } from '../../../../../enums';

@Component({
  selector: 'app-item-type-edit-form',
  templateUrl: './item-type-edit-form.component.html',
  styleUrls: ['./item-type-edit-form.component.scss'],
})
export class ItemTypeEditFormComponent implements OnInit {
  @Input() editItemTypeForm: FormGroup;
  @Input() availableItemGroups: CommonDictionaryModel[] = [];
  @Input() availableTags: CommonDictionaryModel[] = [];
  @Input() filteredItemTypes: CommonDictionaryModel[][] = [];
  @Input() dependencies: FormArray;
  @Input() selectedItemTypeModel: InventoryItemTypeModel;
  @Output() createNewDependency: EventEmitter<void> = new EventEmitter<void>();
  @Output() dependentItemGroupChanged: EventEmitter<{
    itemGroupId: number;
    dependencyIndex: number;
  }> = new EventEmitter<{ itemGroupId: number; dependencyIndex: number }>();
  @Output() deleteDependency: EventEmitter<number> = new EventEmitter<number>();
  @Output() imageProcessed: EventEmitter<{
    imageType: InventoryPnImageTypesEnum;
    dataUrl: string;
    file: File;
  }> = new EventEmitter<{
    imageType: InventoryPnImageTypesEnum;
    dataUrl: string;
    file: File;
  }>();
  @Output() deleteImage: EventEmitter<{
    imageIndex: number;
    imageType: InventoryPnImageTypesEnum;
  }> = new EventEmitter<{
    imageIndex: number;
    imageType: InventoryPnImageTypesEnum;
  }>();
  @Output() deleteUploadedImage: EventEmitter<{
    imageId: number;
    imageType: InventoryPnImageTypesEnum;
  }> = new EventEmitter<{
    imageId: number;
    imageType: InventoryPnImageTypesEnum;
  }>();
  @Input() pictogramImages: InventoryItemTypeImageModel[];
  @Input() dangerLabelImages: InventoryItemTypeImageModel[];

  get imageTypes() {
    return InventoryPnImageTypesEnum;
  }

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

  onDeleteDependency(dependencyIndex: number) {
    this.deleteDependency.emit(dependencyIndex);
  }

  onImageProcessed(model: InventoryItemTypeImageModel) {
    this.imageProcessed.emit(model);
  }

  onDeleteImage(model: {
    imageIndex: number;
    imageType: InventoryPnImageTypesEnum;
  }) {
    this.deleteImage.emit(model);
  }

  onDeleteUploadedImage(model: {
    imageId: number;
    imageType: InventoryPnImageTypesEnum;
  }) {
    this.deleteUploadedImage.emit(model);
  }
}
