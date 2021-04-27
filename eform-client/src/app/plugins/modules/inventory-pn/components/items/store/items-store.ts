import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface ItemsState {
  pagination: CommonPaginationState;
}

export function createInitialState(): ItemsState {
  return <ItemsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      nameFilter: '',
      offset: 0,
    },
  };
}

const itemsPersistStorage = persistState({
  include: ['inventoryPnItems'],
  key: 'pluginsStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'inventoryPnItems', resettable: true })
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
