import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as R from 'ramda';
import { Subscription } from 'rxjs';
import { CommonDictionaryModel } from 'src/app/common/models';
import { InventoryPnImageTypesEnum } from '../../../../../enums';
import { InventoryItemTypeCreateModel } from '../../../../../models';
import {
  InventoryPnItemGroupsService,
  InventoryPnItemTypesService,
  InventoryPnItemTypeTagsService,
} from '../../../../../services';

@AutoUnsubscribe()
@Component({
  selector: 'app-item-type-create-container',
  templateUrl: './item-type-create-container.component.html',
  styleUrls: ['./item-type-create-container.component.scss'],
})
export class ItemTypeCreateContainerComponent implements OnInit, OnDestroy {
  availableTags: CommonDictionaryModel[] = [];
  availableItemGroups: CommonDictionaryModel[] = [];
  filteredItemTypes: CommonDictionaryModel[][] = [];
  newItemTypeForm: FormGroup;
  itemTypeDependencies: FormArray = new FormArray([]);
  pictogramImagesPreview: string[] = [];
  dangerLabelImagesPreview: string[] = [];

  getTagsSub$: Subscription;
  createItemTypeSub$: Subscription;
  getItemGroupsDictionarySub$: Subscription;
  getItemTypesDictionarySub$: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private itemTypesService: InventoryPnItemTypesService,
    private tagsService: InventoryPnItemTypeTagsService,
    private itemGroupsService: InventoryPnItemGroupsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initCreateForm();
    this.getInitialData();
  }

  goBack() {
    this.location.back();
  }

  initCreateForm() {
    this.newItemTypeForm = this.formBuilder.group({
      itemGroupId: [null, Validators.required],
      name: ['', Validators.required],
      riskDescription: [''],
      usage: [''],
      description: ['', Validators.required],
      pictogramImages: [[]],
      dangerLabelImages: [[]],
      tagIds: [[]],
    });
  }

  addNewDependency() {
    this.itemTypeDependencies.push(
      this.formBuilder.group({
        itemGroupId: [null, Validators.required],
        itemTypesIds: [[]],
      })
    );
  }

  getTags() {
    this.getTagsSub$ = this.tagsService.getPlanningsTags().subscribe((data) => {
      if (data && data.success) {
        this.availableTags = data.model;
      }
    });
  }

  getItemGroupsDictionary() {
    this.getItemGroupsDictionarySub$ = this.itemGroupsService
      .getAllItemGroupsDictionary()
      .subscribe((data) => {
        if (data && data.success) {
          this.availableItemGroups = data.model;
        }
      });
  }

  getItemTypesDictionary(itemGroupId: number, dependencyIndex: number) {
    this.getItemTypesDictionarySub$ = this.itemTypesService
      .getAllItemTypesDictionary(itemGroupId)
      .subscribe((data) => {
        if (data && data.success) {
          if (this.filteredItemTypes[dependencyIndex]) {
            // If dependency found - update only types on change
            this.filteredItemTypes = R.update(
              dependencyIndex,
              data.model,
              this.filteredItemTypes
            );
          } else {
            // If dependency not found - push new item types to array
            this.filteredItemTypes = [...this.filteredItemTypes, data.model];
          }
        }
      });
  }

  createItemType() {
    const dependencies = this.itemTypeDependencies.value as {
      itemGroupId: number;
      itemTypesIds: number[];
    }[];
    const createModel = this.newItemTypeForm
      .value as InventoryItemTypeCreateModel;
    this.createItemTypeSub$ = this.itemTypesService
      .createItemType({ ...createModel, dependencies: [...dependencies] })
      .subscribe((data) => {
        if (data && data.success) {
          this.location.back();
        }
      });
  }

  getInitialData() {
    this.getTags();
    this.getItemGroupsDictionary();
  }

  uploadFile(event, fieldName: string = 'pictogramImages') {
    const file = (event.target as HTMLInputElement).files[0];
    this.newItemTypeForm.patchValue({
      pictogramImages: [...this.newItemTypeForm.get(fieldName).value, file],
    });
    this.newItemTypeForm.get(fieldName).updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      fieldName === 'pictogramImages'
        ? (this.pictogramImagesPreview = [
            ...this.pictogramImagesPreview,
            reader.result as string,
          ])
        : (this.dangerLabelImagesPreview = [
            ...this.dangerLabelImagesPreview,
            reader.result as string,
          ]);
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {}

  onDependentItemGroupChanged(dependency: {
    itemGroupId: number;
    dependencyIndex: number;
  }) {
    this.getItemTypesDictionary(
      dependency.itemGroupId,
      dependency.dependencyIndex
    );
  }

  onDeleteDependency(dependencyIndex: number) {
    this.itemTypeDependencies.removeAt(dependencyIndex);
    this.filteredItemTypes = R.remove(
      dependencyIndex,
      1,
      this.filteredItemTypes
    );
  }

  onImageProcessed(model: {
    imageType: InventoryPnImageTypesEnum;
    dataUrl: string;
  }) {
    debugger;
    if (model.imageType === InventoryPnImageTypesEnum.Pictogram) {
      this.pictogramImagesPreview = [
        ...this.dangerLabelImagesPreview,
        model.dataUrl,
      ];
    } else {
      this.dangerLabelImagesPreview = [
        ...this.dangerLabelImagesPreview,
        model.dataUrl,
      ];
    }
  }
}
