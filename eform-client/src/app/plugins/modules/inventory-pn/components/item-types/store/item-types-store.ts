import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface ItemTypesState {
  pagination: CommonPaginationState;
}

export function createInitialState(): ItemTypesState {
  return <ItemTypesState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      nameFilter: '',
      offset: 0,
      tagIds: [],
    },
  };
}

const itemTypesPersistStorage = persistState({
  include: ['inventoryPnItemTypes'],
  key: 'pluginsStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'inventoryPnItemTypes', resettable: true })
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
