import { itemGroupsPersistProvider } from './components/item-groups/store';
import { itemTypesPersistProvider } from './components/item-types/store';
import { itemsPersistProvider } from './components/items/store';

export const inventoryStoreProviders = [
  itemGroupsPersistProvider,
  itemTypesPersistProvider,
  itemsPersistProvider,
];
