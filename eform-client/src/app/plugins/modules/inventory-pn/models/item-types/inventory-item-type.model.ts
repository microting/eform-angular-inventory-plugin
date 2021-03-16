import { InventoryItemTypeDependencyModel } from './inventory-item-type-dependency.model';

export class InventoryItemTypeModel {
  id: number;
  itemGroupId: number;
  name: string;
  riskDescription: string;
  usage: string;
  description: string;
  tagIds: number[];
  pictogramImages: string[];
  dangerLabelImages: string[];
  dependencies: InventoryItemTypeDependencyModel[];
}
