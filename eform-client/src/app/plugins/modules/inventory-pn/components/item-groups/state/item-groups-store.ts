import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface ItemGroupsState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  offset: number;
}

export function createInitialState(): ItemGroupsState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'itemGroups' })
export class ItemGroupsStore extends Store<ItemGroupsState> {
  constructor() {
    super(createInitialState());
  }
}
