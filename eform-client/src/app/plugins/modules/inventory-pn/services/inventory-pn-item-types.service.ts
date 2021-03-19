import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { CommonDictionaryModel, Paged } from 'src/app/common/models';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import { BaseService } from 'src/app/common/services/base.service';
import {InventoryPnImageTypesEnum} from 'src/app/plugins/modules/inventory-pn/enums';
import {
  InventoryItemTypeCreateModel,
  InventoryItemTypeModel,
  InventoryItemTypeSimpleModel,
  InventoryItemTypesRequestModel,
  InventoryItemTypeUpdateModel,
} from '../models';

const InventoryPnItemTypesMethods = {
  ItemTypes: 'api/inventory-pn/item-types',
  ItemTypesIndex: 'api/inventory-pn/item-types/index',
  ItemTypesDictionary: 'api/inventory-pn/item-types/dictionary',
  ItemTypesImages: 'api/inventory-pn/item-types/images',
};

@Injectable({
  providedIn: 'root',
})
export class InventoryPnItemTypesService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllItemTypes(
    model: InventoryItemTypesRequestModel
  ): Observable<OperationDataResult<Paged<InventoryItemTypeSimpleModel>>> {
    return this.post(InventoryPnItemTypesMethods.ItemTypesIndex, model);
  }

  getAllItemTypesDictionary(
    itemGroupId?: number
  ): Observable<OperationDataResult<CommonDictionaryModel[]>> {
    return this.get(
      InventoryPnItemTypesMethods.ItemTypesDictionary,
      itemGroupId ? { itemGroupId } : null
    );
  }

  getSingleItemType(
    itemTypeId: number
  ): Observable<OperationDataResult<InventoryItemTypeModel>> {
    return this.get(InventoryPnItemTypesMethods.ItemTypes + '/' + itemTypeId);
  }

  updateItemType(
    model: InventoryItemTypeUpdateModel
  ): Observable<OperationResult> {
    return this.put(InventoryPnItemTypesMethods.ItemTypes, model);
  }

  createItemType(
    model: InventoryItemTypeCreateModel
  ): Observable<OperationDataResult<number>> {
    return this.post(InventoryPnItemTypesMethods.ItemTypes, model);
  }

  deleteItemType(itemTypeId: number): Observable<OperationResult> {
    return this.delete(
      InventoryPnItemTypesMethods.ItemTypes + '/' + itemTypeId
    );
  }

  uploadItemTypeImages(model: {
    itemTypeId: number;
    itemTypeImageType: InventoryPnImageTypesEnum;
    files: Blob[];
  }): Observable<any> {
    return this.uploadFiles(
      InventoryPnItemTypesMethods.ItemTypesImages,
      model.files,
      {
        itemTypeId: model.itemTypeId,
        itemTypeImageType: model.itemTypeImageType,
      },
      'blob'
    );
  }
}
