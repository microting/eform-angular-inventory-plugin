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
import { InventoryItemTypeModel } from '../models';

export let InventoryPnItemTypesMethods = {
  ItemTypes: 'api/inventory-pn/item-types',
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
    return this.post(InventoryPnItemTypesMethods.ItemTypes, model);
  }

  getSingleItemType(planningId: number): Observable<OperationDataResult<any>> {
    return this.get(InventoryPnItemTypesMethods.ItemTypes + '/' + planningId);
  }

  updateItemType(model: any): Observable<OperationResult> {
    return this.put(InventoryPnItemTypesMethods.ItemTypes, model);
  }

  createItemType(model: any): Observable<OperationResult> {
    return this.post(InventoryPnItemTypesMethods.ItemTypes, model);
  }

  deleteItemType(fractionId: number): Observable<OperationResult> {
    return this.delete(
      InventoryPnItemTypesMethods.ItemTypes + '/' + fractionId
    );
  }
}
