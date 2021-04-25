import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface ItemGroupsState {
  pagination: CommonPaginationState;
}

export function createInitialState(): ItemGroupsState {
  return <ItemGroupsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      nameFilter: '',
      offset: 0,
    },
  };
}

const itemGroupsPersistStorage = persistState({
  include: ['inventoryPnItemGroups'],
  key: 'pluginsStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'inventoryPnItemGroups', resettable: true })
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
