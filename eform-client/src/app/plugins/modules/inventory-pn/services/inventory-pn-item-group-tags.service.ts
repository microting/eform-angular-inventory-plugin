import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/common/services/base.service';
import {
  CommonDictionaryModel,
  OperationDataResult,
  OperationResult,
  SharedTagCreateModel,
  SharedTagModel,
} from 'src/app/common/models';

export let ItemGroupTagsMethods = {
  Tags: 'api/inventory-pn/item-groups/tags',
};

@Injectable()
export class InventoryPnItemGroupTagsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getPlanningsTags(): Observable<OperationDataResult<CommonDictionaryModel[]>> {
    return this.get<SharedTagModel[]>(ItemGroupTagsMethods.Tags);
  }

  updatePlanningTag(model: SharedTagModel): Observable<OperationResult> {
    return this.put(ItemGroupTagsMethods.Tags, model);
  }

  deletePlanningTag(id: number): Observable<OperationResult> {
    return this.delete(ItemGroupTagsMethods.Tags + '/' + id);
  }

  createPlanningTag(model: SharedTagCreateModel): Observable<OperationResult> {
    return this.post(ItemGroupTagsMethods.Tags, model);
  }
}
