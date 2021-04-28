import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonDictionaryModel, Paged } from 'src/app/common/models';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import { InventoryPnImageTypesEnum } from '../enums';
import {
  InventoryItemTypeCreateModel,
  InventoryItemTypeModel,
  InventoryItemTypeSimpleModel,
  InventoryItemTypesRequestModel,
  InventoryItemTypeUpdateModel,
} from '../models';
import { ApiBaseService } from 'src/app/common/services';

export const InventoryPnItemTypesMethods = {
  ItemTypes: 'api/inventory-pn/item-types',
  ItemTypesIndex: 'api/inventory-pn/item-types/index',
  ItemTypesDictionary: 'api/inventory-pn/item-types/dictionary',
  ItemTypesImages: 'api/inventory-pn/item-types/images',
};

@Injectable({
  providedIn: 'root',
})
export class InventoryPnItemTypesService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllItemTypes(
    model: InventoryItemTypesRequestModel
  ): Observable<OperationDataResult<Paged<InventoryItemTypeSimpleModel>>> {
    return this.apiBaseService.post(
      InventoryPnItemTypesMethods.ItemTypesIndex,
      model
    );
  }

  getAllItemTypesDictionary(
    itemGroupId?: number
  ): Observable<OperationDataResult<CommonDictionaryModel[]>> {
    return this.apiBaseService.get(
      InventoryPnItemTypesMethods.ItemTypesDictionary,
      itemGroupId ? { itemGroupId } : null
    );
  }

  getSingleItemType(
    itemTypeId: number
  ): Observable<OperationDataResult<InventoryItemTypeModel>> {
    return this.apiBaseService.get(
      `${InventoryPnItemTypesMethods.ItemTypes}/${itemTypeId}`
    );
  }

  updateItemType(
    model: InventoryItemTypeUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put(
      InventoryPnItemTypesMethods.ItemTypes,
      model
    );
  }

  createItemType(
    model: InventoryItemTypeCreateModel
  ): Observable<OperationDataResult<number>> {
    return this.apiBaseService.post(
      InventoryPnItemTypesMethods.ItemTypes,
      model
    );
  }

  deleteItemType(itemTypeId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      `${InventoryPnItemTypesMethods.ItemTypes}/${itemTypeId}`
    );
  }

  getItemTypeImage(name: string): Observable<any> {
    return this.apiBaseService.getBlobData(
      `${InventoryPnItemTypesMethods.ItemTypesImages}/${name}`
    );
  }

  uploadItemTypeImages(model: {
    itemTypeId: number;
    itemTypeImageType: InventoryPnImageTypesEnum;
    files: Blob[];
  }): Observable<any> {
    return this.apiBaseService.uploadFiles(
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
