import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ItemGroupsStore, ItemGroupsState } from './item-groups-store';

@Injectable({ providedIn: 'root' })
export class ItemGroupsQuery extends Query<ItemGroupsState> {
  constructor(protected store: ItemGroupsStore) {
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
}
