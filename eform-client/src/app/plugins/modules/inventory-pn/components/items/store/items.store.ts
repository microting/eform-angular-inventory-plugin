import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  FiltrationStateModel,
  CommonPaginationState,
} from 'src/app/common/models';

export interface ItemsState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export function createInitialState(): ItemsState {
  return <ItemsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    filters: {
      nameFilter: '',
    },
    total: 0,
  };
}

const itemsPersistStorage = persistState({
  include: ['items'],
  key: 'inventoryPn',
  preStorageUpdate(storeName, state: ItemsState) {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'items', resettable: true })
export class ItemsStore extends Store<ItemsState> {
  constructor() {
    super(createInitialState());
  }
}

export const itemsPersistProvider = {
  provide: 'persistStorage',
  useValue: itemsPersistStorage,
  multi: true,
};
