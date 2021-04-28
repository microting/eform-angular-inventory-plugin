import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import { Paged } from 'src/app/common/models';
import {
  InventoryItemCreateModel,
  InventoryItemModel,
  InventoryItemsRequestModel,
  InventoryItemUpdateModel,
} from '../models';
import { ApiBaseService } from 'src/app/common/services';

export let InventoryPnItemsMethods = {
  Items: 'api/inventory-pn/items',
  ItemsIndex: 'api/inventory-pn/items/index',
};

@Injectable({
  providedIn: 'root',
})
export class InventoryPnItemsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllItems(
    model: InventoryItemsRequestModel
  ): Observable<OperationDataResult<Paged<InventoryItemModel>>> {
    return this.apiBaseService.post(InventoryPnItemsMethods.ItemsIndex, model);
  }

  getSingleItem(
    inventoryItemId: number
  ): Observable<OperationDataResult<InventoryItemModel>> {
    return this.apiBaseService.get(
      InventoryPnItemsMethods.Items + '/' + inventoryItemId
    );
  }

  updateItem(
    model: InventoryItemUpdateModel<string>
  ): Observable<OperationResult> {
    return this.apiBaseService.put(InventoryPnItemsMethods.Items, model);
  }

  createItem(
    model: InventoryItemCreateModel<string>
  ): Observable<OperationResult> {
    return this.apiBaseService.post(InventoryPnItemsMethods.Items, model);
  }

  deleteItem(inventoryItemId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      InventoryPnItemsMethods.Items + '/' + inventoryItemId
    );
  }
}
