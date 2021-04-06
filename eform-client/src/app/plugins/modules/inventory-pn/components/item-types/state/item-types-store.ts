import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface ItemTypesState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  offset: number;
  tagIds: number[];
}

export function createInitialState(): ItemTypesState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    offset: 0,
    tagIds: [],
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'itemTypes' })
export class ItemTypesStore extends Store<ItemTypesState> {
  constructor() {
    super(createInitialState());
  }
}
