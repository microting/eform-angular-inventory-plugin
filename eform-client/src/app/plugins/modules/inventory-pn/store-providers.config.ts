import { itemGroupsPersistProvider } from './components/item-groups/store/item-groups-store';
import { itemTypesPersistProvider } from './components/item-types/store/item-types-store';
import { itemsPersistProvider } from './components/items/store/items-store';

export const inventoryStoreProviders = [
  itemGroupsPersistProvider,
  itemTypesPersistProvider,
  itemsPersistProvider,
];
