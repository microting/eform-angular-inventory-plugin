import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as R from 'ramda';
import { forkJoin, Subscription } from 'rxjs';
import {noWhitespaceValidator} from 'src/app/common/helpers';
import { CommonDictionaryModel } from 'src/app/common/models';
import { InventoryPnImageTypesEnum } from 'src/app/plugins/modules/inventory-pn/enums';
import {
  InventoryItemTypeImageModel,
  InventoryItemTypeModel,
  InventoryItemTypeUpdateModel,
} from '../../../../../models';
import {
  InventoryPnItemGroupsService,
  InventoryPnItemTypesService,
  InventoryPnItemTypeTagsService,
} from '../../../../../services';

@AutoUnsubscribe()
@Component({
  selector: 'app-item-type-edit-container',
  templateUrl: './item-type-edit-container.component.html',
  styleUrls: ['./item-type-edit-container.component.scss'],
})
export class ItemTypeEditContainerComponent implements OnInit, OnDestroy {
  selectedItemTypeId: number;
  selectedItemTypeModel: InventoryItemTypeModel = new InventoryItemTypeModel();
  availableTags: CommonDictionaryModel[] = [];
  availableItemGroups: CommonDictionaryModel[] = [];
  filteredItemTypes: CommonDictionaryModel[][] = [];
  editItemTypeForm: FormGroup;
  itemTypeDependencies: FormArray = new FormArray([]);
  dependenciesIdsForDelete: number[] = [];
  pictogramImages: InventoryItemTypeImageModel[] = [];
  pictogramImagesForDelete: number[] = [];
  dangerLabelImages: InventoryItemTypeImageModel[] = [];
  dangerLabelImagesForDelete: number[] = [];

  getTagsSub$: Subscription;
  activatedRouteSub$: Subscription;
  getItemTypeSub$: Subscription;
  updateItemTypeSub$: Subscription;
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
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRouteSub$ = this.activatedRoute.params.subscribe((params) => {
      this.selectedItemTypeId = +params['id'];
    });

    this.initEditForm();
    this.getInitialData();
  }

  goBack() {
    this.location.back();
  }

  initEditForm() {
    this.editItemTypeForm = this.formBuilder.group({
      id: [null, Validators.required],
      itemGroupId: ['', Validators.required],
      name: ['', [Validators.required, noWhitespaceValidator]],
      riskDescription: [''],
      usage: [''],
      description: ['', [Validators.required, noWhitespaceValidator]],
      pictogramImages: [],
      dangerLabelImages: [],
      tagIds: [],
      dependencies: [],
    });
  }

  updateEditForm(model: InventoryItemTypeModel) {
    this.editItemTypeForm.patchValue({
      id: model.id,
      itemGroupId: model.itemGroupId,
      name: model.name,
      riskDescription: model.riskDescription,
      usage: model.usage,
      description: model.description,
      tagIds: model.tagIds,
    });

    model.dependencies.map((x, index) => {
      this.itemTypeDependencies.push(
        this.formBuilder.group({
          itemGroupId: [x.itemGroupId, Validators.required],
          itemTypesIds: [x.itemTypesIds],
        })
      );
      this.getItemTypesDictionary(x.itemGroupId, index);
    });
  }

  addNewDependency() {
    this.itemTypeDependencies.push(
      this.formBuilder.group({
        itemGroupId: [null, Validators.required],
        itemTypesIds: [],
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

  getItemType() {
    this.getItemTypeSub$ = this.itemTypesService
      .getSingleItemType(this.selectedItemTypeId)
      .subscribe((data) => {
        if (data && data.success) {
          this.updateEditForm(data.model);
          this.selectedItemTypeModel = data.model;
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
          debugger;
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

  uploadImages$(itemTypeId: number, imageType: InventoryPnImageTypesEnum) {
    return this.itemTypesService.uploadItemTypeImages({
      files:
        imageType === InventoryPnImageTypesEnum.Pictogram
          ? this.pictogramImages.map((x) => {
              return x.file;
            })
          : this.dangerLabelImages.map((x) => {
              return x.file;
            }),
      itemTypeId,
      itemTypeImageType: imageType,
    });
  }

  uploadImages(itemTypeId: number) {
    let imagesSubs = {};
    if (this.pictogramImages && this.pictogramImages.length) {
      imagesSubs = {
        ...imagesSubs,
        pictogram: this.uploadImages$(
          itemTypeId,
          InventoryPnImageTypesEnum.Pictogram
        ),
      };
    }
    if (this.dangerLabelImages && this.dangerLabelImages.length) {
      imagesSubs = {
        ...imagesSubs,
        dangerLabel: this.uploadImages$(
          itemTypeId,
          InventoryPnImageTypesEnum.DangerLabel
        ),
      };
    }
    // @ts-ignore
    if (imagesSubs.pictogram || imagesSubs.dangerLabel) {
      this.uploadItemTypeImages$ = forkJoin(imagesSubs).subscribe(() => {
        this.goBack();
      });
    }
  }

  updateItemType() {
    // Composing required values in a model
    this.updateItemTypeSub$ = this.itemTypesService
      .updateItemType({
        // Form values
        ...this.editItemTypeForm.value,
        dependencies: [...this.itemTypeDependencies.value],
        dependenciesIdsForDelete: [...this.dependenciesIdsForDelete],
        pictogramImagesForDelete: [...this.pictogramImagesForDelete],
        dangerLabelImagesForDelete: [...this.dangerLabelImagesForDelete],
      } as InventoryItemTypeUpdateModel)
      .subscribe(() => {
        if (this.pendingImagesExists) {
          this.uploadImages(this.selectedItemTypeId);
        } else {
          this.goBack();
        }
      });
  }

  getInitialData() {
    this.getTags();
    this.getItemGroupsDictionary();
    this.getItemType();
  }

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
    // Remove item from FormArray, array of dependent types and add to dependency id to delete array
    this.itemTypeDependencies.removeAt(dependencyIndex);
    this.filteredItemTypes = R.remove(
      dependencyIndex,
      1,
      this.filteredItemTypes
    );
    const foundDependency = this.itemTypeDependencies.at(dependencyIndex).value;
    if (foundDependency.id) {
      this.dependenciesIdsForDelete = [
        ...this.dependenciesIdsForDelete,
        foundDependency.id,
      ];
    }
  }

  ngOnDestroy(): void {}

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

  onDeleteUploadedImage(model: {
    imageId: number;
    imageType: InventoryPnImageTypesEnum;
  }) {
    // Add to arrays for delete and remove from uploaded images for preview
    if (model.imageType === InventoryPnImageTypesEnum.Pictogram) {
      this.pictogramImagesForDelete = [
        ...this.pictogramImagesForDelete,
        model.imageId,
      ];
      const foundImageIndex = this.selectedItemTypeModel.pictogramImages.findIndex(
        (x) => x.id === model.imageId
      );
      this.selectedItemTypeModel.pictogramImages = R.remove(
        foundImageIndex,
        1,
        this.selectedItemTypeModel.pictogramImages
      );
    } else {
      this.dangerLabelImagesForDelete = [
        ...this.dangerLabelImagesForDelete,
        model.imageId,
      ];
      const foundImageIndex = this.selectedItemTypeModel.dangerLabelImages.findIndex(
        (x) => x.id === model.imageId
      );
      this.selectedItemTypeModel.dangerLabelImages = R.remove(
        foundImageIndex,
        1,
        this.selectedItemTypeModel.dangerLabelImages
      );
    }
  }
}
