import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ItemsState, ItemsStore } from './items-store';

@Injectable({ providedIn: 'root' })
export class ItemsQuery extends Query<ItemsState> {
  constructor(protected store: ItemsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectSnFilter$ = this.select((state) => state.pagination.nameFilter);
  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
  selectOffset$ = this.select((state) => state.pagination.offset);
}
