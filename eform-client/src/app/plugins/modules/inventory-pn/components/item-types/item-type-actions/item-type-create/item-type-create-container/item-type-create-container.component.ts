import {Location} from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { CommonDictionaryModel } from 'src/app/common/models';
import {InventoryItemTypeCreateModel} from 'src/app/plugins/modules/inventory-pn/models';
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
  availableItemTypes: CommonDictionaryModel[] = [];
  newItemTypeForm: FormGroup;
  itemTypeDependencies: FormArray = new FormArray([]);

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
      name: [''],
      riskDescription: [''],
      usage: [''],
      description: [''],
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

  getItemTypesDictionary() {
    this.getItemTypesDictionarySub$ = this.itemTypesService
      .getAllItemTypesDictionary()
      .subscribe((data) => {
        if (data && data.success) {
          this.availableItemTypes = data.model;
        }
      });
  }

  createItemType() {
    this.createItemTypeSub$ = this.itemTypesService
      .createItemType(this.newItemTypeForm.value as InventoryItemTypeCreateModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.location.back();
        }
      });
  }

  getInitialData() {
    this.getTags();
    this.getItemGroupsDictionary();
    this.getItemTypesDictionary();
  }

  ngOnDestroy(): void {}
}
