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
import { InventoryItemModel } from 'src/app/plugins/modules/inventory-pn/models';

export let InventoryPnItemsMethods = {
  Items: 'api/inventory-pn/items',
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
    model: PagedEntityRequest
  ): Observable<OperationDataResult<IPaged<InventoryItemModel>>> {
    return this.post(InventoryPnItemsMethods.Items, model);
  }

  getSingleItem(planningId: number): Observable<OperationDataResult<any>> {
    return this.get(InventoryPnItemsMethods.Items + '/' + planningId);
  }

  updateItem(model: any): Observable<OperationResult> {
    return this.put(InventoryPnItemsMethods.Items, model);
  }

  createItem(model: any): Observable<OperationResult> {
    return this.post(InventoryPnItemsMethods.Items, model);
  }

  deleteItem(fractionId: number): Observable<OperationResult> {
    return this.delete(InventoryPnItemsMethods.Items + '/' + fractionId);
  }
}
