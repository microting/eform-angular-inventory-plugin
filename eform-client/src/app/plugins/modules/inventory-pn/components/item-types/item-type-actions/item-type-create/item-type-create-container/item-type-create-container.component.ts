import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as R from 'ramda';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { CommonDictionaryModel } from 'src/app/common/models';
import { InventoryPnImageTypesEnum } from '../../../../../enums';
import {
  InventoryItemTypeCreateModel,
  InventoryItemTypeImageModel,
} from '../../../../../models';
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
  pictogramImages: InventoryItemTypeImageModel[] = [];
  dangerLabelImages: InventoryItemTypeImageModel[] = [];

  getTagsSub$: Subscription;
  createItemTypeSub$: Subscription;
  getItemGroupsDictionarySub$: Subscription;
  getItemTypesDictionarySub$: Subscription;
  uploadItemTypeImages$: Subscription;

  get pendingImagesExists() {
    return (
      (this.pictogramImages && this.pictogramImages.length) ||
      (this.dangerLabelImages && this.dangerLabelImages.length)
    );
  }

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
          if (this.pendingImagesExists) {
            this.uploadImages(data.model);
          } else {
            this.goBack();
          }
        }
      });
  }

  uploadImages$(itemTypeId: number, imageType: InventoryPnImageTypesEnum) {
    if (this.pictogramImages && this.pictogramImages.length) {
      return this.itemTypesService.uploadItemTypeImages({
        files: this.pictogramImages.map((x) => {
          return x.file;
        }),
        itemTypeId,
        itemTypeImageType: imageType,
      });
    } else {
      return new Observable<any>();
    }
  }

  uploadImages(itemTypeId: number) {
    let imagesSubs = {};
    if (this.pictogramImages && this.pictogramImages.length) {
      imagesSubs = {...imagesSubs, pictogram: this.uploadImages$(itemTypeId, InventoryPnImageTypesEnum.Pictogram)};
    }
    if (this.dangerLabelImages && this.dangerLabelImages.length) {
      imagesSubs = {...imagesSubs, dangerLabel: this.uploadImages$(itemTypeId, InventoryPnImageTypesEnum.DangerLabel)};
    }
    // @ts-ignore
    if (imagesSubs.pictogram || imagesSubs.dangerLabel) {
      this.uploadItemTypeImages$ = forkJoin(imagesSubs).subscribe(() => {
        this.goBack();
      });
    }
  }

  getInitialData() {
    this.getTags();
    this.getItemGroupsDictionary();
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

  onImageProcessed(model: InventoryItemTypeImageModel) {
    if (model.imageType === InventoryPnImageTypesEnum.Pictogram) {
      this.pictogramImages = [...this.pictogramImages, model];
    } else {
      this.dangerLabelImages = [...this.dangerLabelImages, model];
    }
  }

  onDeleteImage(model: {
    imageIndex: number;
    imageType: InventoryPnImageTypesEnum;
  }) {
    if (model.imageType === InventoryPnImageTypesEnum.Pictogram) {
      this.pictogramImages = R.remove(
        model.imageIndex,
        1,
        this.pictogramImages
      );
    } else {
      this.dangerLabelImages = R.remove(
        model.imageIndex,
        1,
        this.dangerLabelImages
      );
    }
  }
}
