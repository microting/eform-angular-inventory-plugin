import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import { CommonDictionaryModel, Paged } from 'src/app/common/models';
import {
  InventoryItemGroupCreateModel,
  InventoryItemGroupModel,
  InventoryItemGroupsRequestModel,
  InventoryItemGroupUpdateModel,
} from '../models';
import { ApiBaseService } from 'src/app/common/services';

export let InventoryPnItemGroupsMethods = {
  ItemGroups: 'api/inventory-pn/item-groups',
  ItemGroupsIndex: 'api/inventory-pn/item-groups/index',
  ItemGroupsDictionary: 'api/inventory-pn/item-groups/dictionary',
};

@Injectable({
  providedIn: 'root',
})
export class InventoryPnItemGroupsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllItemGroups(
    model: InventoryItemGroupsRequestModel
  ): Observable<OperationDataResult<Paged<InventoryItemGroupModel>>> {
    return this.apiBaseService.post(
      InventoryPnItemGroupsMethods.ItemGroupsIndex,
      model
    );
  }

  getSingleItemGroup(
    itemGroupId: number
  ): Observable<OperationDataResult<InventoryItemGroupModel>> {
    return this.apiBaseService.get(
      InventoryPnItemGroupsMethods.ItemGroups + '/' + itemGroupId
    );
  }

  getAllItemGroupsDictionary(): Observable<
    OperationDataResult<CommonDictionaryModel[]>
  > {
    return this.apiBaseService.get(
      InventoryPnItemGroupsMethods.ItemGroupsDictionary
    );
  }

  updateItemGroup(
    model: InventoryItemGroupUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put(
      InventoryPnItemGroupsMethods.ItemGroups,
      model
    );
  }

  createItemGroup(
    model: InventoryItemGroupCreateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(
      InventoryPnItemGroupsMethods.ItemGroups,
      model
    );
  }

  deleteItemGroup(itemGroupId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      InventoryPnItemGroupsMethods.ItemGroups + '/' + itemGroupId
    );
  }
}
