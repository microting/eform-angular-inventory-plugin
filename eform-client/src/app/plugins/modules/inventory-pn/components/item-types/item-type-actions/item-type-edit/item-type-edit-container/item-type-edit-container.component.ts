import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { CommonDictionaryModel } from 'src/app/common/models';
import { InventoryPnImageTypesEnum } from 'src/app/plugins/modules/inventory-pn/enums';
import {
  InventoryItemTypeCreateModel,
  InventoryItemTypeImageModel,
  InventoryItemTypeModel,
  InventoryItemTypeUpdateModel,
} from '../../../../../models';
import {
  InventoryPnItemGroupsService,
  InventoryPnItemTypesService,
  InventoryPnItemTypeTagsService,
} from '../../../../../services';
import * as R from 'ramda';

@AutoUnsubscribe()
@Component({
  selector: 'app-item-type-edit-container',
  templateUrl: './item-type-edit-container.component.html',
  styleUrls: ['./item-type-edit-container.component.scss'],
})
export class ItemTypeEditContainerComponent implements OnInit, OnDestroy {
  selectedItemTypeId: number;
  availableTags: CommonDictionaryModel[] = [];
  availableItemGroups: CommonDictionaryModel[] = [];
  filteredItemTypes: CommonDictionaryModel[][] = [];
  editItemTypeForm: FormGroup;
  itemTypeDependencies: FormArray = new FormArray([]);
  dependenciesIdsForDelete: number[] = [];
  pictogramImages: InventoryItemTypeImageModel[] = [];
  dangerLabelImages: InventoryItemTypeImageModel[] = [];

  getTagsSub$: Subscription;
  activatedRouteSub$: Subscription;
  getItemTypeSub$: Subscription;
  updateItemTypeSub$: Subscription;
  getItemGroupsDictionarySub$: Subscription;
  getItemTypesDictionarySub$: Subscription;
  uploadItemTypePictograms$: Subscription;
  uploadItemTypeDangerLabels$: Subscription;

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
      itemGroupId: [null, Validators.required],
      name: ['', Validators.required],
      riskDescription: [''],
      usage: [''],
      description: ['', Validators.required],
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
      debugger;
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

  uploadImages(itemTypeId: number) {
    if (this.pictogramImages && this.pictogramImages.length) {
      this.uploadItemTypePictograms$ = this.itemTypesService
        .uploadItemTypeImages({
          files: this.pictogramImages.map((x) => {
            return x.file;
          }),
          itemTypeId,
          itemTypeImageType: InventoryPnImageTypesEnum.Pictogram,
        })
        .subscribe((data) => {});
    }
    if (this.dangerLabelImages && this.dangerLabelImages.length) {
      this.uploadItemTypeDangerLabels$ = this.itemTypesService
        .uploadItemTypeImages({
          files: this.dangerLabelImages.map((x) => {
            return x.file;
          }),
          itemTypeId,
          itemTypeImageType: InventoryPnImageTypesEnum.DangerLabel,
        })
        .subscribe((data) => {});
    }
  }

  updateItemType() {
    // Compose model from array of dependencies and ids for delete
    const dependencies = this.itemTypeDependencies.value as {
      id: number;
      itemGroupId: number;
      itemTypesIds: number[];
    }[];
    const updateModel = this.editItemTypeForm
      .value as InventoryItemTypeUpdateModel;
    this.updateItemTypeSub$ = this.itemTypesService
      .updateItemType({
        ...updateModel,
        dependencies: [...dependencies],
        dependenciesIdsForDelete: [...this.dependenciesIdsForDelete],
      })
      .subscribe((data) => {
        if (data && data.success) {
          this.uploadImages(this.selectedItemTypeId);
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
}
