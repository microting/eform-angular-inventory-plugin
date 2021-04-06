import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ItemTypesStore, ItemTypesState } from './item-types-store';

@Injectable({ providedIn: 'root' })
export class ItemTypesQuery extends Query<ItemTypesState> {
  constructor(protected store: ItemTypesStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectPageSize$ = this.select('pageSize');
  selectNameFilter$ = this.select('nameFilter');
  selectIsSortDsc$ = this.select('isSortDsc');
  selectSort$ = this.select('sort');
  selectOffset$ = this.select('offset');
  selectTagIds$ = this.select('tagIds');
}
