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
  InventoryItemGroupCreateModel,
  InventoryItemGroupModel,
  InventoryItemGroupUpdateModel,
} from '../models';

export let InventoryPnItemGroupsMethods = {
  ItemGroups: 'api/inventory-pn/item-groups',
  ItemGroupsIndex: 'api/inventory-pn/item-groups/index',
};

@Injectable({
  providedIn: 'root',
})
export class InventoryPnItemGroupsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllItemGroups(
    model: PagedEntityRequest
  ): Observable<OperationDataResult<IPaged<InventoryItemGroupModel>>> {
    return this.post(InventoryPnItemGroupsMethods.ItemGroupsIndex, model);
  }

  getSingleItemGroup(
    itemGroupId: number
  ): Observable<OperationDataResult<InventoryItemGroupModel>> {
    return this.get(
      InventoryPnItemGroupsMethods.ItemGroups + '/' + itemGroupId
    );
  }

  updateItemGroup(
    model: InventoryItemGroupUpdateModel
  ): Observable<OperationResult> {
    return this.put(InventoryPnItemGroupsMethods.ItemGroups, model);
  }

  createItemGroup(
    model: InventoryItemGroupCreateModel
  ): Observable<OperationResult> {
    return this.post(InventoryPnItemGroupsMethods.ItemGroups, model);
  }

  deleteItemGroup(itemGroupId: number): Observable<OperationResult> {
    return this.delete(
      InventoryPnItemGroupsMethods.ItemGroups + '/' + itemGroupId
    );
  }
}
