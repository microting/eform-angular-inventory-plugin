import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  CommonPaginationState,
  FiltrationStateModel,
} from 'src/app/common/models';

export interface ItemGroupsState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export function createInitialState(): ItemGroupsState {
  return <ItemGroupsState>{
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

const itemGroupsPersistStorage = persistState({
  include: ['itemGroups'],
  key: 'inventoryPn',
  preStorageUpdate(storeName, state: ItemGroupsState) {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'itemGroups', resettable: true })
export class ItemGroupsStore extends Store<ItemGroupsState> {
  constructor() {
    super(createInitialState());
  }
}

export const itemGroupsPersistProvider = {
  provide: 'persistStorage',
  useValue: itemGroupsPersistStorage,
  multi: true,
};
