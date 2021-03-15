import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { CommonDictionaryModel } from 'src/app/common/models';
import {
  InventoryItemTypeCreateModel,
  InventoryItemTypeModel, InventoryItemTypeUpdateModel,
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

  getTagsSub$: Subscription;
  activatedRouteSub$: Subscription;
  getItemTypeSub$: Subscription;
  updateItemTypeSub$: Subscription;
  getItemGroupsDictionarySub$: Subscription;
  getItemTypesDictionarySub$: Subscription;

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
      name: [''],
      riskDescription: [''],
      usage: [''],
      description: [''],
      pictogramImages: [],
      dangerLabelImages: [],
      tagIds: [],
      dependencies: []
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

    debugger;

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

  updateItemType() {
    const dependencies = this.itemTypeDependencies.value as {
      itemGroupId: number;
      itemTypesIds: number[];
    }[];
    const updateModel = this.editItemTypeForm
      .value as InventoryItemTypeUpdateModel;
    this.updateItemTypeSub$ = this.itemTypesService
      .updateItemType({ ...updateModel, dependencies: [...dependencies] })
      .subscribe((data) => {
        if (data && data.success) {
          this.location.back();
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

  ngOnDestroy(): void {}
}
