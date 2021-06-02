import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  OperationDataResult,
  OperationResult,
  SharedTagCreateModel,
  SharedTagModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

export let ItemGroupTagsMethods = {
  Tags: 'api/inventory-pn/item-type-tags',
};

@Injectable()
export class InventoryPnItemTypeTagsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getPlanningsTags(): Observable<OperationDataResult<CommonDictionaryModel[]>> {
    return this.apiBaseService.get<SharedTagModel[]>(ItemGroupTagsMethods.Tags);
  }

  updatePlanningTag(model: SharedTagModel): Observable<OperationResult> {
    return this.apiBaseService.put(ItemGroupTagsMethods.Tags, model);
  }

  deletePlanningTag(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(ItemGroupTagsMethods.Tags + '/' + id);
  }

  createPlanningTag(model: SharedTagCreateModel): Observable<OperationResult> {
    return this.apiBaseService.post(ItemGroupTagsMethods.Tags, model);
  }
}
