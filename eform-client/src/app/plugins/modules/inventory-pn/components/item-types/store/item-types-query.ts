import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ItemTypesState, ItemTypesStore } from './item-types-store';

@Injectable({ providedIn: 'root' })
export class ItemTypesQuery extends Query<ItemTypesState> {
  constructor(protected store: ItemTypesStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectTagIds$ = this.select((state) => state.pagination.tagIds);
  selectNameFilter$ = this.select((state) => state.pagination.nameFilter);
  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
  selectOffset$ = this.select((state) => state.pagination.offset);
}
