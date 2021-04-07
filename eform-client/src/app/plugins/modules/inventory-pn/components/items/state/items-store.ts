import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface ItemsState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  snFilter: string;
  offset: number;
}

export function createInitialState(): ItemsState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    snFilter: '',
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'items' })
export class ItemsStore extends Store<ItemsState> {
  constructor() {
    super(createInitialState());
  }
}
