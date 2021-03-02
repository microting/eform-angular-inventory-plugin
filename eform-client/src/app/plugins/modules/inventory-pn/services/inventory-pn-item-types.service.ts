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
import { IPaged, PagedEntityRequest } from 'src/app/common/models';
import {
  InventoryItemTypeUpdateModel,
  InventoryItemTypeModel,
  InventoryItemCreateModel,
} from '../models';

export let InventoryPnItemTypesMethods = {
  ItemTypes: 'api/inventory-pn/item-types',
  ItemTypesIndex: 'api/inventory-pn/item-types/index',
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
    model: PagedEntityRequest
  ): Observable<OperationDataResult<IPaged<InventoryItemTypeModel>>> {
    return this.post(InventoryPnItemTypesMethods.ItemTypesIndex, model);
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

  createItemType(model: InventoryItemCreateModel): Observable<OperationResult> {
    return this.post(InventoryPnItemTypesMethods.ItemTypes, model);
  }

  deleteItemType(itemTypeId: number): Observable<OperationResult> {
    return this.delete(
      InventoryPnItemTypesMethods.ItemTypes + '/' + itemTypeId
    );
  }
}
