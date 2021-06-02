import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  FiltrationStateModel,
  CommonPaginationState,
} from 'src/app/common/models';

export interface ItemTypesState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export function createInitialState(): ItemTypesState {
  return <ItemTypesState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    filters: {
      nameFilter: '',
      tagIds: [],
    },
    total: 0,
  };
}

const itemTypesPersistStorage = persistState({
  include: ['itemTypes'],
  key: 'inventoryPn',
  preStorageUpdate(storeName, state: ItemTypesState) {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'itemTypes', resettable: true })
export class ItemTypesStore extends Store<ItemTypesState> {
  constructor() {
    super(createInitialState());
  }
}

export const itemTypesPersistProvider = {
  provide: 'persistStorage',
  useValue: itemTypesPersistStorage,
  multi: true,
};
