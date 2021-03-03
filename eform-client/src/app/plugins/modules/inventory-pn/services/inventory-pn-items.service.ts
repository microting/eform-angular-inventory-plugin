import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import { BaseService } from 'src/app/common/services/base.service';
import { Paged, PagedEntityRequest } from 'src/app/common/models';
import {
  InventoryItemCreateModel,
  InventoryItemModel,
  InventoryItemsRequestModel,
  InventoryItemUpdateModel,
} from 'src/app/plugins/modules/inventory-pn/models';

export let InventoryPnItemsMethods = {
  Items: 'api/inventory-pn/items',
  ItemsIndex: 'api/inventory-pn/items/index',
};

@Injectable({
  providedIn: 'root',
})
export class InventoryPnItemsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllItems(
    model: InventoryItemsRequestModel
  ): Observable<OperationDataResult<Paged<InventoryItemModel>>> {
    return this.post(InventoryPnItemsMethods.ItemsIndex, model);
  }

  getSingleItem(
    inventoryItemId: number
  ): Observable<OperationDataResult<InventoryItemModel>> {
    return this.get(InventoryPnItemsMethods.Items + '/' + inventoryItemId);
  }

  updateItem(model: InventoryItemUpdateModel): Observable<OperationResult> {
    return this.put(InventoryPnItemsMethods.Items, model);
  }

  createItem(model: InventoryItemCreateModel): Observable<OperationResult> {
    return this.post(InventoryPnItemsMethods.Items, model);
  }

  deleteItem(inventoryItemId: number): Observable<OperationResult> {
    return this.delete(InventoryPnItemsMethods.Items + '/' + inventoryItemId);
  }
}
