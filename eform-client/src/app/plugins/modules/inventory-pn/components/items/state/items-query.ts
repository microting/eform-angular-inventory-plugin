import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ItemsStore, ItemsState } from './items-store';

@Injectable({ providedIn: 'root' })
export class ItemsQuery extends Query<ItemsState> {
  constructor(protected store: ItemsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectPageSize$ = this.select('pageSize');
  selectSnFilter$ = this.select('snFilter');
  selectIsSortDsc$ = this.select('isSortDsc');
  selectSort$ = this.select('sort');
  selectOffset$ = this.select('offset');
}
